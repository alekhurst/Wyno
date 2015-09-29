angular.module( 'WynoAdmin' ).controller( 'LoginController', [
'$scope',
'$rootScope',
'$state',
'$location',
'$meteor',
function( $scope, $rootScope, $state, $location, $meteor ) {
	$scope.login = { email: "", password: "" };
	$scope.login_error = false;
	$scope.creating_account = false;
	$scope.forgetting_password = false;
	$scope.new_admin = {};
	$scope.create_account_errors = {};
	$scope.$meteorSubscribe( 'wineries' ).then( function() {
		$scope.wineries = $meteor.collection( function() {
	        return Wineries.find()
	    });
	});

	/**
	 * Attempts to log a user in. If that fails, show an 
	 * error. On success, take them to their winery's home
	 */
	$scope.submitLogin = function() {
		$meteor.loginWithPassword( $scope.login.email , $scope.login.password ).then( function() {
			$scope.login_error = false;
		   	$location.path( '/winery/' + $rootScope.currentUser.profile.winery_id );
		}, function( err ){
			$scope.login_error = true;
		});
	}

	/**
	 * Opens the create account popup
	 */
	$scope.openCreateAccountPopup = function() {
		$scope.creating_account = true;
	}

	/**
	 * Closes the create account popup
	 */
	$scope.closeCreateAccountPopup = function() {
		$scope.creating_account = false;
		$scope.new_admin = {};
	}

	/**
	 * Creates an account when user presses submit in the
	 * create account popup. If there are errors in their
	 * form, this will display them.
	 */
	$scope.createAdminAccount = function() {
		// call createUser meteor method
		$meteor.createUser({
		    email: $scope.new_admin.email,
		    password: $scope.new_admin.password,
		    profile: { 
		    	first_name: $scope.new_admin.first_name,
		    	last_name: $scope.new_admin.last_name,
		    	role: "admin",
		    	winery_id: $scope.new_admin.winery
		    }
		}).then( function(){
		   	$location.path( '/winery/' + $rootScope.currentUser.profile.winery_id );
		}, function(err){
		    displayErrors( err );
		});

		// called from error function of createUser
		function displayErrors( err ) {
			var details, i;
			// clear all previous errors
			$scope.create_account_errors = {};
			// if there aren't details, display the reason to user
			if( !err.details ) {
				$scope.create_account_errors.other = err.reason;
				return;
			}
			// display individual field errors
			details = JSON.parse( err.details ) 
			for( i = 0; i < details.length; i++ ) {
		    	switch( details[ i ].name ) {
		    		case "emails.0.address":
		    			$scope.create_account_errors.invalid_email = true;
		    			break;
		    		case "profile.first_name":
		    			$scope.create_account_errors.first_name = true;
		    			break;
		    		case "profile.last_name":
		    			$scope.create_account_errors.last_name = true;
		    			break;
		    		case "profile.winery_id":
		    			$scope.create_account_errors.winery = true;
		    			break;
		    		default:
		    			break;
		    	}
		    }
		}
	}

	/**
	 * When user hits login state, check if they are already
	 * logged in. If they are take them to their winery's home
	 */
	$scope.checkIfLoggedIn = function() {
		$meteor.requireUser().then( function() { 
			$state.go( 'winery_home', { winery_id: $rootScope.currentUser.profile.winery_id } )
		}, function( err ) { 
			return; 
		} );
	}

	$scope.checkIfLoggedIn();
} ] );
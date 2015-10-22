angular.module( 'WynoApp' ).controller( 'WinerySelectionController', [
'$scope',
'$stateParams',
'$state',
'$rootScope',
'$meteor',
function( $scope, $stateParams, $state, $rootScope, $meteor ) {
	$rootScope.body_bg_color = "#F4F4F4";
	$scope.user_panel_showing = false;
	$scope.user_logged_in = (function() {
	    if( Meteor.userId() )
	      	return true;
	    return false;
	})();
	
	$scope.$meteorSubscribe( 'wineries' ).then( function() {
		$scope.wineries = $meteor.collection( function() {
			return Wineries.find({});
		});
		$scope.$meteorSubscribe( 'images' ).then( function() { 
			$scope.images = $meteor.collectionFS( Images, false, Images ) 
		});
	});

	$scope.getImageOriginal = function( id ) {
		if ( id && Images.findOne( id ) ) {
      		return Images.findOne( id ).url({store: 'original'});
    	}
	}

	/**
	 * When user taps a winery, this takes them to 
	 * that winery's home page.
	 * @param {number} winery_id
	 */
	$scope.selectWinery = function( winery ) {
		$state.go( 'winery_home', { winery_id: winery._id } );
	};

	$scope.showUserPanel = function() {
		$scope.user_panel_showing = true;
	};

	$scope.hideUserPanel = function() {
		$scope.user_panel_showing = false;
	}

	$scope.loginWithFacebook = function() {
		Meteor.loginWithFacebook({requestPermissions: ['email']}, function(err){
            if (err) {
                throw new Meteor.Error("Facebook login failed");
            } else {
            	$scope.user_logged_in = true;
            }
        });

	};

	$scope.logout = function() {
		Meteor.logout(function(err){
            if (err) {
                throw new Meteor.Error("Logout failed");
            } else {
            	$scope.user_logged_in = false;
            }
        })
	};

	$scope.openNotesList = function() {
		$state.go( 'notes' );
	};

	$scope.openReviewsList = function() {
		$state.go( 'reviews' );
	};
}]);
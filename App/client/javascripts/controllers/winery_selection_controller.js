angular.module( 'WynoApp' ).controller( 'WinerySelectionController', [
'$scope',
'$stateParams',
'$state',
'$rootScope',
'$meteor',
function( $scope, $stateParams, $state, $rootScope, $meteor ) {
	$rootScope.body_bg_color = "#F4F4F4";
	$scope.user_panel_showing = false;
	
	$scope.$meteorSubscribe( 'wineries' ).then( function() {
		$scope.wineries = $meteor.collection( function() {
			return Wineries.find({});
		});
		$scope.$meteorSubscribe( 'images' ).then( function() { 
			$scope.images = $meteor.collectionFS( Images, false, Images ) 
		});
	});

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

	$scope.openNotesList = function() {
		$state.go( 'notes' );
	};

	$scope.openReviewsList = function() {
		$state.go( 'reviews' );
	};
}]);
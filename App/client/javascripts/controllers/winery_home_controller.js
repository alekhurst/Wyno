angular.module( 'WynoApp' ).controller( 'WineryHomeController', [
'$scope',
'$stateParams',
'$state',
'$rootScope',
'$meteor',
function( $scope, $stateParams, $state, $rootScope, $meteor ) {
	$rootScope.body_bg_color = "white";
	$scope.$meteorSubscribe( 'wineries' ).then( function() {
		$scope.current_winery = Wineries.findOne( $stateParams.winery_id );
	});
	$scope.$meteorSubscribe( 'images' ).then( function() { 
		$scope.images = $meteor.collectionFS( Images, false, Images ) 
	});

	$scope.getImageOriginal = function( id ) {
		if ( id && Images.findOne( id ) ) {
      		return Images.findOne( id ).url({store: 'original'});
    	}
	}

	/**
	 * Called when user taps any button in this view.
	 * @param {string} location : where to redirect
	 */
	$scope.goTo = function( location ) {
		$state.go( location, { winery_id: $stateParams.winery_id } );
	}
}]);
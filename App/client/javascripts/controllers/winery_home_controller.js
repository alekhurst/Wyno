angular.module( 'WynoApp' ).controller( 'WineryHomeController', [
'$scope',
'$stateParams',
'$state',
'$rootScope',
'$meteor',
function( $scope, $stateParams, $state, $rootScope, $meteor ) {
	$rootScope.setBackgroundColor( "white" );

	$scope.$meteorSubscribe( 'wineries' ).then( function() {
		$scope.current_winery = Wineries.findOne( $stateParams.winery_id );
	});
	$scope.$meteorSubscribe( 'images' ).then( function() { 
		$scope.images = $meteor.collectionFS( Images, false, Images ) 
	});

	/**
	 * Called when user taps any button in this view.
	 * @param {string} location : where to redirect
	 */
	$scope.goTo = function( location ) {
		$state.go( location, { winery_id: $stateParams.winery_id } );
	}
}]);
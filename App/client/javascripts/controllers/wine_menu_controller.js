angular.module( 'WynoApp' ).controller( 'WineMenuController', [
'$scope',
'$stateParams',
'$location',
'$rootScope',
'$meteor',
function( $scope, $stateParams, $location, $rootScope, $meteor ) {
	$rootScope.body_bg_color = "white";

	$scope.initialize = function() {
		// get the wines & bind to wines collection
		$scope.$meteorSubscribe( 'wines' ).then( function() {
			$scope.wines = $meteor.collection( function() {
				return Wines.find( { winery_id: $stateParams.winery_id }, { sort: { created_at: 1 } } );
			});
		});
	}

	/**
	 * Open details for a selected wine
	 * @param { Number } id
	 */
	$scope.openWineDetails = function ( id ) {
		$location.url( '/wine/' + id + "?just_browsing=true" )
	}
	
	$scope.initialize();
} ] );
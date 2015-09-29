angular.module( 'WynoApp' ).controller( 'SpecialsController', [
'$scope',
'$stateParams',
'$location',
'$rootScope',
'$meteor',
function( $scope, $stateParams, $location, $rootScope, $meteor ) {
	$rootScope.body_bg_color = "#F4F4F4";

    $scope.$meteorSubscribe( 'specials' ).then( function() {
		$scope.specials = $meteor.collection( function() {
	        return Specials.find( { winery_id: $stateParams.winery_id }, { sort: { created_at: 1 } } );
	    });
	});
	$scope.$meteorSubscribe( 'wines' ).then( function() {
		$scope.wines = $meteor.collection( function() {
	        return Wines.find( { winery_id: $stateParams.winery_id }, { sort: { created_at: 1 } } );
	    });
	    $scope.getAssociatedWines();
	})

	/**
	 * Gets the associated wines for each special during initialization
	 * of the collections above
	 */
    $scope.getAssociatedWines = function() {
    	var i;
		for( i = 0; i < $scope.specials.length; i++ ) {
			$scope.specials[ i ].associated_wine = Wines.findOne( $scope.specials[ i ].wine_id )
		}
    }

	/**
	 * Open details for a selected wine
	 * @param { Number } id
	 */
	$scope.openWineDetails = function ( id ) {
		$location.url( '/wine/' + id + "?just_browsing=true" )
	}
}]);
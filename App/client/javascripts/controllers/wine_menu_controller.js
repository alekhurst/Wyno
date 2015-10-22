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
		// get images & subscribe to collection
		$scope.$meteorSubscribe( 'images' ).then( function() { 
			$scope.images = $meteor.collectionFS( Images, false, Images ) 
		});
	}

	/**
	 * Gets the thumbnail of each wine's image
	 * @param {string} id - photo id to query
	 */
	$scope.getImageThumbnail = function( id ) {
		if ( id && Images.findOne( id ) ) {
      		return Images.findOne( id ).url({store: 'thumbnail'});
    	}
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
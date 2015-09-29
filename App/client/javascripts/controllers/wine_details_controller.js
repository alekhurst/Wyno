angular.module( 'WynoApp' ).controller( 'WineDetailsController', [
'$scope',
'$stateParams',
'$rootScope',
'$meteor',
'TasteFactory',
function( $scope, $stateParams, $rootScope, $meteor, TasteFactory ) {
	$rootScope.body_bg_color = "white";
	$scope.current_tasting = TasteFactory;

	$scope.initialize = function() {
		if( $stateParams.just_browsing === "true" ) {
			$scope.just_browsing = true;
		} else {
			$scope.just_browsing = false;
		}
		
		$scope.$meteorSubscribe( 'wines' ).then( function() {
			// findOne not working??? for now just finding/taking [0]
			$scope.this_wine = $meteor.collection( function() {
				return Wines.find( { _id: $stateParams.wine_id } );
			});
			$scope.this_wine = $scope.this_wine[ 0 ];
		});
		$scope.$meteorSubscribe( 'reviews' ).then( function() {
			$scope.reviews = $meteor.collection( function() {
				return reviews = Reviews.find( { wine_id: $stateParams.wine_id } );
			});
		})
		$scope.$meteorSubscribe( 'images' ).then( function() { 
			$scope.images = $meteor.collectionFS( Images, false, Images ) 
		});
	}

	$scope.getImageOriginal = function( id ) {
		if ( id && Images.findOne( id ) ) {
      		return Images.findOne( id ).url({store: 'original'});
    	}
	}
	
	$scope.selectWine = function() {
		$scope.current_tasting.selectWine( $scope.this_wine._id );
	};

	$scope.unselectWine = function() {
		$scope.current_tasting.unselectWine( $scope.this_wine._id );
	};

	$scope.createReadableDate = function( timestamp ) {
		var date = new Date( Number( timestamp ) );
		// Get year
		var year = date.getFullYear();
		// Get month
		var month_names = ["Jan", "Feb", "Mar", "April", "May", "June",
		  "July", "Aug", "Sep", "Oct", "Nov", "Dec"
		];
		var month = month_names[ date.getMonth() ];
		// get day
		var day = date.getDate();

		return day + " " + month + " " + year;
	}

	$scope.initialize();
}]);
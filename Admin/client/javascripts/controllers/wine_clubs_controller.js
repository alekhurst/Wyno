angular.module( 'WynoAdmin' ).controller( 'WineClubsController', [
'$scope',
'$stateParams',
'$meteor',
function( $scope, $stateParams, $meteor ) {
	$scope.$meteorSubscribe( 'wine_clubs' ).then( function() {
		$scope.wine_clubs = $meteor.collection( function() {
	        return WineClubs.find( {}, { sort: { created_at: 1 } } );
	    });
	});
	$scope.temp_wine_club = {};
	$scope.editing = false;
	$scope.adding = false;
	

	$scope.addWineClub = function() {
		$scope.adding = true;
		$scope.temp_wine_club = {
			winery_id: $stateParams.winery_id,
			title: "",
			deal: {
				denomination: "bottle",
				quantity: "1",
				rate: "year",
				price: "12.99"
			}
		}
	}

	$scope.editWineClub = function( id ) {
		$scope.editing = true;
		$scope.temp_wine_club = WineClubs.findOne( id )
	}

	$scope.deleteWineClub = function( id ) {
		$meteor.call( 'deleteWineClub', id );
	}

	$scope.saveWineClub = function() {
		$scope.temp_wine_club.deal.quantity = Number( $scope.temp_wine_club.deal.quantity )
		if( $scope.editing ) {
			$scope.temp_wine_club.updated_at = Date.now();
			$meteor.call( 'updateWineClub', $scope.temp_wine_club );
		} else if( $scope.adding ) {
			$scope.temp_wine_club.created_at = Date.now();
			$meteor.call( 'createWineClub', $scope.temp_wine_club );
		}

		$scope.closePopup();
	}

	$scope.closePopup = function() {
		$scope.adding = false;
		$scope.editing = false;
		$scope.temp_wine_club = {};
	}
} ] );
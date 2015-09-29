angular.module( 'WynoAdmin' ).controller( 'SpecialsController', [
'$scope',
'$stateParams',
'$meteor',
function( $scope, $stateParams, $meteor ) {
	$scope.editing = false;
	$scope.adding = false;
	$scope.temp_special = {};
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
	 * When user clicks edit on a special, this is called to open 
	 * the popup and set the state to editing. Finds the special
	 * to edit and copies it into temp_special until saved or canceled
	 * @param {string} id
	 */
	$scope.editSpecial = function( id ) {
		$scope.editing = true;
		angular.extend( $scope.temp_special, Specials.findOne( id ) );
		if( $scope.temp_special.wine_id )
			$scope.individual_wine = true;
	}

	/**
	 * When user clicks the plus on top right, this is called to open 
	 * the popup and set the state to adding. Creates an empty special
	 * object.
	 */
	$scope.addSpecial = function() {
		$scope.adding = true;
		$scope.temp_special = {
			title: "",
			updated_at: undefined,
			winery_id: $stateParams.winery_id,
			wine_id: undefined
		}
	}

	/**
	 * Saves the special to the database. If we were editing, update
	 * an existing special, otherwise create a new one.
	 */
	$scope.saveSpecial = function() {
		if( !$scope.individual_wine ) {
			$scope.temp_special.wine_id = undefined;
		}

		if( $scope.adding ) {
			$scope.temp_special.created_at = Date.now();
			$meteor.call( 'createSpecial', $scope.temp_special ).then( function() {
				$scope.getAssociatedWines() 
			});
		} else if( $scope.editing ) {
			$scope.temp_special.updated_at = Date.now();
			$meteor.call( 'updateSpecial', $scope.temp_special ).then( function() {
				$scope.getAssociatedWines() 
			});
		}
		
		$scope.closePopup();
	}

	/**
	 * Deletes a special from the database
	 */
	$scope.deleteSpecial = function( special_id ) {
		$meteor.call( 'deleteSpecial', special_id );
	}

	/**
	 * closes the popup and removes editing or adding state
	 */
	$scope.closePopup = function() {
		$scope.editing = false;
		$scope.adding = false;
		$scope.temp_special = {};
	}
} ] );
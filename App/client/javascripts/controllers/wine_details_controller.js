angular.module( 'WynoApp' ).controller( 'WineDetailsController', [
'$scope',
'$state',
'$stateParams',
'$rootScope',
'$meteor',
'TasteFactory',
function( $scope, $state, $stateParams, $rootScope, $meteor, TasteFactory ) {
	$rootScope.body_bg_color = "white";
	$scope.current_tasting = TasteFactory;
	$scope.current_user_review = undefined;
	$scope.current_user_note = undefined;

	$scope.initialize = function() {
		if( $stateParams.just_browsing === "true" ) {
			$scope.just_browsing = true;
		} else {
			$scope.just_browsing = false;
		}
		
		$scope.$meteorSubscribe( 'wines' ).then( function() {
			$scope.this_wine = $meteor.collection( function() {
				return Wines.find( { _id: $stateParams.wine_id } );
			});
			$scope.this_wine = $scope.this_wine[ 0 ];
		});
		$scope.$meteorSubscribe( 'reviews' ).then( function() {
			$scope.reviews = $meteor.collection( function() {
				return Reviews.find( { wine_id: $stateParams.wine_id } );
			});
		})
		$scope.$meteorSubscribe( 'notes' ).then( function() {
			$scope.notes = $meteor.collection( function() {
				return Notes.find( { wine_id: $stateParams.wine_id } );
			});
		})
		$scope.$meteorSubscribe( 'images' ).then( function() { 
			$scope.images = $meteor.collectionFS( Images, false, Images ) 
		});
	}

	/**
	 * Gets the full sized wine image for displaying in the view
	 */
	$scope.getImageOriginal = function( id ) {
		if ( id && Images.findOne( id ) ) {
      		return Images.findOne( id ).url({store: 'original'});
    	}
	}
	
	/**
	 * Selects a wine if we came from a tasting and the button
	 * is visible
	 */
	$scope.selectWine = function() {
		$scope.current_tasting.selectWine( $scope.this_wine._id );
	};

	/**
	 * Unelects a wine if we came from a tasting and the button
	 * is visible
	 */
	$scope.unselectWine = function() {
		$scope.current_tasting.unselectWine( $scope.this_wine._id );
	};

	/**
	 * Creates a readable date for the reviews
	 */
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

	/**
	 * Returns true if the user has already taken a note on this wine.
	 * returns false otherwise
	 */
	$scope.checkForUserNote = function() {
		if( !Meteor.userId() || !$scope.this_wine || !$scope.notes ) {
			return undefined;
		}

		for( var i = 0; i < $scope.notes.length; i++ ) {
			if( $scope.notes[i].user_id === Meteor.userId() ) {
				$scope.current_user_note = $scope.notes[i];
				return true;
			}
		}
		return false;
	}

	/**
	 * Opens editing/creating a existing/new note
	 * @param {string} nid - note id
	 */
	$scope.openEditNote = function(nid) {
		if( !nid ) {
			$state.go('edit_note', {note_id: 'new', wine_id: $stateParams.wine_id});
		} else {
			$state.go('edit_note', {note_id: nid, wine_id: $stateParams.wine_id});
		}
	}

	/**
	 * Returns true if the user has already reviewed this wine
	 * returns false otherwise
	 */
	$scope.checkForUserReview = function() {
		if( !Meteor.userId() || !$scope.this_wine || !$scope.reviews ) {
			return undefined;
		}

		for( var i = 0; i < $scope.reviews.length; i++ ) {
			if( $scope.reviews[i].user_id === Meteor.userId() ) {
				$scope.current_user_review = $scope.reviews[i];
				return true;
			}
		}
		return false;
	}

	/**
	 * Open the editing/creating view so a user can make a review.
	 * If no review id was provided, we are creating a new one
	 * @param {string} rid - review id
	 */
	$scope.openEditReview = function( rid ) {
		if( !rid ) {
			$state.go('edit_review', {review_id: 'new', wine_id: $stateParams.wine_id});
		} else {
			$state.go('edit_review', {review_id: rid, wine_id: $stateParams.wine_id});
		}
	}

	$scope.initialize();
}]);
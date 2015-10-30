angular.module( 'WynoApp' ).controller( 'EditNoteController', [
'$scope',
'$stateParams',
'$state',
'$rootScope',
'$meteor',
function( $scope, $stateParams, $state, $rootScope, $meteor ) {
	$rootScope.body_bg_color = "#F4F4F4"; 
	$scope.temp_note = {};
	$scope.header_text = '';
	$scope.editing_a_note = undefined;
	$scope.submit_deactivated = false;


	// if there's no user logged in, or there was no wine_id
	// provided, just go back
	if(!Meteor.userId() || !$stateParams.wine_id ) {
		$rootScope.goBack();
	}

	// if we're creating a note, initialize some properties
	// to display in the view
	if($stateParams.note_id === 'new') {
		$scope.header_text = "Create a note";
		$scope.temp_note = {
			created_at: Date.now()
		}
	} else {
		// if we got here, we're editing a previous note
		$scope.header_text = "Edit this note";
		$scope.editing_a_note = true;
		$scope.$meteorSubscribe( 'notes' ).then( function() {
			$scope.temp_note = angular.copy($scope.$meteorCollection( function() {
				return Notes.find( { _id: $stateParams.note_id } );
			})[0]);
		});
	}

	$scope.$meteorSubscribe( 'wines' ).then( function() {
		$scope.wines = $scope.$meteorCollection( function() {
			return Wines.find( { _id: $stateParams.wine_id } );
		});
	});
	$scope.$meteorSubscribe( 'wineries' ).then( function() {
		$scope.wineries = $scope.$meteorCollection( function() {
			return Wineries.find();
		});
	});

	/**
	 * Get the associated wine to this note for displaying
	 */
	$scope.getAssociatedWine = function() {
		if( !$scope.wines|| !$scope.wineries || !$scope.temp_note ) {
			return;
		}
		
		var data_string = ''; // will contains the winery name & wine name
		var temp_wine = $scope.wines[0];
		var temp_winery = $scope.$meteorObject(Wineries, temp_wine.winery_id, false);
		return temp_winery.name + " " + temp_wine.vintage + " " + temp_wine.name;
	}

	/**
	 * When a user is creating a note or note and 
	 * selects a star, this highlights the correct amount
	 */
	$scope.selectRatingStars = function( num_selected ) {
		$scope.temp_note.stars = num_selected;
	}

	/**
	 * Creates a readable date from a timestamp
	 */
	$scope.createReadableDate = function() {
		if( !$scope.temp_note ) {
			return " ";
		}
		var timestamp = $scope.temp_note.created_at;
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
	 * Calls the delete method on this note
	 */
	$scope.deleteNote = function() {
		$meteor.call( "deleteNote", $scope.temp_note).then( function( data ) {
			$rootScope.goBack();
		}, function( err ) {
			$scope.submission_err = err;
		});
	}

	/**
	 * Saves or updates a note based on how we got to
	 * this view
	 */
	$scope.saveNote = function() {
		if( $scope.submit_deactivated ) {
			return;
		}
		$scope.submit_deactivated  = true;
		var new_note, method_to_call;
		if( $stateParams.note_id === "new" ) {
			// no previous note existed, create a new one
			new_note = {
				user_id: Meteor.userId(),
				wine_id: $stateParams.wine_id,
				created_at: Date.now(),
				text: $scope.temp_note.text, 
				stars: $scope.temp_note.stars
			}
			method_to_call = "createNote";
		} else {
			// there was a previous note, update it
			new_note = {
				_id: $scope.temp_note._id,
				user_id: Meteor.userId(),
				wine_id: $stateParams.wine_id,
				created_at: $scope.temp_note.created_at,
				updated_at: Date.now(),
				text: $scope.temp_note.text, 
				stars: $scope.temp_note.stars
			}
			method_to_call = "updateNote";
		}

		$meteor.call( method_to_call, new_note ).then( function( data ) {
			$rootScope.goBack();
			$scope.submit_deactivated  = false;
		}, function( err ) {
			$scope.submission_err = err.reason;
			$scope.submit_deactivated  = false;
		} );
	}
}]);
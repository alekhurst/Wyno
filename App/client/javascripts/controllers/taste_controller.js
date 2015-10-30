/*
 
The way this file is structured is explained here. 

--
View state:
The $scope.state variable maintains which view we're in, since this view 
(/client/views/taste.ng.html) is techically composed of 2 views: the wine 
list view (where users select wines for tasting), and the ready to taste 
view (where users actually taste wines). the $scope.state variable dictates
which view we are in.
--
Ready to taste:
When the user is ready to taste, the tasting is composed of phases, which
are created in the /client/javascript/controllers/tast_factory.js. The taste
factory also serves as a model for storing all of the wine ids a user selected
to taste, and helpers to get the data from these ids.
--
Notes/Reviews:
Notes and reviews can only be accessed when a user is logged in. If they are
not logged in and press "take a note" or "leave a review" while not logged in
they are propmted to make an account. 

When the taste view is loaded, three objects are created: note_or_review,
temp_note, and temp_review. the note_or_review maintains state for what's happening
while taking notes or reviews (such as which one we're using the input fields for).

If the user is logged in and they've taken a note or review on the current wine,
the temp_note/temp_review is populated with their existing data and they can update
their note/review with the same interface. 
--

*/


angular.module( 'WynoApp' ).controller( 'TasteController', [
'$scope',
'$stateParams',
'$location',
'$rootScope',
'$meteor',
'TasteFactory',
function( $scope, $stateParams, $location, $rootScope, $meteor, TasteFactory ) {
	/**
	 * Initialize the wine tasting list to display, load
	 * current tasting session info, and update guidance
	 * text. 
	 */
	$scope.initialize = function() {
		// white background for this page
		$rootScope.body_bg_color = "white";
		// get current winery
		$scope.winery_id = $stateParams.winery_id ;
		// put a reference to TasteFactory in the scope
		$scope.tasting_session = TasteFactory;
		// state of tasting, either 'choosing' or 'finished'
		$scope.state = 'choosing';
		// get the wines & bind to wines collection in Mongo
	    $scope.$meteorSubscribe( 'wines' ).then( function() {
			$scope.wines = $meteor.collection( function() {
				return Wines.find( { winery_id: $stateParams.winery_id }, { sort: { created_at: 1 } } );
			});
		});
		// get images & subscribe to collection
		$scope.$meteorSubscribe( 'images' ).then( function() { 
			$scope.images = $meteor.collectionFS( Images, false, Images ) 
		});
		// if the current winery_id differs from tasting_session.winery_id,
		// it means the user started tasting at a winery, but is now at
		// a different one. Therefore we reset the the tasting_session.
		if( $scope.tasting_session.winery_id !== $scope.winery_id )
			$scope.tasting_session.reset( $scope.winery_id );
		// this handles updating guidance text based on the tasting_session data
		$scope.guidance_text = $scope.updateGuidanceText();
		
		// everything below here is notes/reviews initialization
		$scope.resetTempNoteAndReview();
		// initialize user notes & reviews
		$scope.user_notes = {};
		$scope.user_reviews = {};
		// if user is logged in, get their notes & reviews
		if( Meteor.userId() ) {
			$scope.getUserNotesAndReviews();
		}
	}

	/**
	 * Toggles a wine's selected state, adds/removes it
	 * from the tasting_session.selected_wines list, and 
	 * updates the guidance text.
	 * @param { Number } wine_id 
	 */
	$scope.toggleSelected = function( wine_id ) {
		if( $scope.checkIfSelected( wine_id ) ) {
			$scope.tasting_session.unselectWine( wine_id );
		} else {
			$scope.tasting_session.selectWine( wine_id );
		}

		$scope.guidance_text = $scope.updateGuidanceText( $scope.tasting_session.selected_wines.length );
	}

	/**
	 * checks whether or not a wine is currently selected
	 * @param {number} wine_id
	 */
	$scope.checkIfSelected = function( wine_id ) {
		for( var i = 0; i < $scope.tasting_session.selected_wines.length; i++ ) {
			if( $scope.tasting_session.selected_wines[i] == wine_id )
				return true;
		}
		return false;
	}

	/**
	 * Updates the guidance text at the top of the page
	 * @param {number} num_selected - number of wines currently selected
	 */
	$scope.updateGuidanceText = function() {
		num_selected =  $scope.tasting_session.selected_wines.length;
		if( num_selected === 0 ) return '0 wines selected'; 
		else return num_selected + ' wines selected'; 
	}

	/**
	 * Open details for a selected wine
	 * @param { String } id
	 */
	$scope.openWineDetails = function ( id ) {
		$location.url( '/wine/' + id + "?just_browsing=false" )
	}

	/**
	 * Changes the $scope.state which is reflected by 
	 * the view. ready means the user has selected their wines
	 * and will now begin tasting.
	 * @param { String } next_state
	 */
	$scope.changeState = function( next_state ) {
		$scope.state = next_state;
		if( next_state === "ready" ) {
			$scope.tasting_session.createTasting();
			$scope.createPhaseText();
			$scope.resetTempNoteAndReview();
		} else if( next_state === "choosing" ) {
			$scope.note_or_review.state = undefined;
		}
	}

	/**
	 * Changes the tasting phase based on the direction
	 * @param {string} direction - "prev" or "next"
	 */
	$scope.changePhase = function( direction ) {
		if( direction === "next" ) {
			$scope.tasting_session.current_phase++;
		} else if( direction === "prev" ) {
			$scope.tasting_session.current_phase--;
		}
		$scope.createPhaseText();
		$scope.tasting_session.setCurrentWine();
		$scope.resetTempNoteAndReview();
	}

	/**
	 * Phases exist when the user is done selecting wines
	 * and has began tasting the wines. Creates text for 
	 * each phase of the tasting.
	 */
	$scope.createPhaseText = function() {
		if( !$scope.tasting_session.phases.length )
			return;
		var text = "";
		var cp = $scope.tasting_session.current_phase;
		switch( cp ) {
			case 0:
				text = "Let's start with a " + $scope.tasting_session.phases[ cp ].type + ":";
				break;
			case 1:
				text = "Next we'll go with the " ;
				break;
			case 2: 
				text = "Getting slightly richer, try the ";
				break;
			case 3: 
				text = "To round out the pallete, let's do the ";
				break;
			case 4:
				text = "Back over the top with a slightly deeper flavor ";
				break;
			case 5:
				text = "Lastly, the most full bodied of your selections ";
				break;
			default: 
				text = "Let's try the ";
		}
		$scope.phase_prefix = text;
	}

/****** Everything below here pertains to notes & reviews *******/

	/**
	 * Initialization for temp notes and reviews is here.
	 * Temp notes and reviews are either a copy of an 
	 * existing note in the db or set to an initial state.
	 */
	$scope.resetTempNoteAndReview = function() {
		// data pertaining to the state of note or review
		// states: "note", "review", "not_logged_in", 
		// "showing_save_successful"
		$scope.note_or_review = {
			state: undefined,
			intended_state: undefined
		}
		// initialize to empty
		$scope.temp_note = {
			state: undefined,
			selected: 0,
			text: ""
		}
		// initialize to empty
		$scope.temp_review = {
			state: undefined,
			stars_selected: 0,
			text: ""
		}
	}	

	/**
	 * Users must be logged in before creating a note/review.
	 * This logs them in and displays the notes if successful.
	 * @param {string} intended_state - "note" or "review"
	 */
	$scope.loginWithFacebook = function() {
		Meteor.loginWithFacebook({requestPermissions: ['email']}, function(err){
            if (err) {
                throw new Meteor.Error("Facebook login failed");
            } else {
            	// get user notes/reviews & check for existing 
            	$scope.getUserNotesAndReviews();
            	// intended_state set in showNoteOrReviewInterface()
            	$scope.note_or_review.state = $scope.note_or_review.intended_state;
            	// reset intended state
            	$scope.note_or_review.intended_state = undefined;
            }
        });
	};

	/** 
	 * Gets all notes and reviews pertaining to the
	 * current user if they're logged in
	 */
	$scope.getUserNotesAndReviews = function() {
		// see if there is a note from this user on this wine in the db
		$scope.$meteorSubscribe( 'notes' ).then( function() {
			$scope.user_notes = $meteor.collection( function() {
				return Notes.find( { user_id: Meteor.userId() } );
			});
			// when user logs in via this interface
			$scope.checkForExistingNote();
		});
		$scope.$meteorSubscribe( 'reviews' ).then( function() {
			$scope.user_reviews = $meteor.collection( function() {
				return Reviews.find( { user_id: Meteor.userId() } );
			});
			$scope.checkForExistingReview();
		});
	}

	/**
	 * Checks that the user is logged in. If they are,
	 * shows the note or review feature
	 * @param {string} selection - either "note" or "review"
	 */
	$scope.showNoteOrReviewInterface = function( selection ) {
		if( !Meteor.userId() ) {
			// stores their intended state to display
			// the correct UI after logging in
			$scope.note_or_review.state = "not_logged_in";
			// where the user wanted to go before prompted 
			// to log in (provided by call from UI).
			// slightly buggish on "not-authorized" 
			// error of saveNote() ... this is undefined. 
			$scope.note_or_review.intended_state = selection;
		} else if( selection === "note" ) {
			// sets note or review state to note
			$scope.note_or_review.state = "note";
			$scope.checkForExistingNote();
		} else if( selection === "review" ) {
			// sets note or review state to review
			$scope.note_or_review.state = "review";
			$scope.checkForExistingReview();
		}
	}

	/**
	 * On phase change, checks to see if the user has 
	 * already taken a note on this wine, if so, display
	 * their previously created note. If we didn't find 
	 * one, initialize temp note to creating state.
	 */
	$scope.checkForExistingNote = function() {
		// not logged in or never created any notes
		if( !Meteor.userId() )
			return;
		// search through created notes and return if we found a match
		for( var i = 0; i < $scope.user_notes.length; i++ ) {
			if( $scope.user_notes[ i ].wine_id === $scope.tasting_session.current_wine._id ) {
				$scope.temp_note = {
					_id: $scope.user_notes[ i ]._id,
					state: "editing",
					stars_selected: $scope.user_notes[ i ].stars,
					text: $scope.user_notes[ i ].text
				}
				return;
			}
		}
		// no match was found, initialize temp note to creating state
		$scope.temp_note = {
			state: "creating",
			stars_selected: 0,
			text: ""
		}
	}

	/**
	 * On phase change, checks to see if the user has 
	 * already created a review on this wine, if so, display
	 * their previously created review.
	 */
	$scope.checkForExistingReview = function() {
		// not logged in or never created any notes
		if( !Meteor.userId() )
			return;
		// search through created notes and return if we found a match
		for( var i = 0; i < $scope.user_reviews.length; i++ ) {
			if( $scope.user_reviews[ i ].wine_id === $scope.tasting_session.current_wine._id ) {
				$scope.temp_review = {
					_id: $scope.user_reviews[ i ]._id,
					state: "editing",
					stars_selected: $scope.user_reviews[ i ].stars,
					text: $scope.user_reviews[ i ].text
				}
				return;
			}
		}
		// no match was found, initialize temp note to creating state
		$scope.temp_review = {
			state: "creating",
			stars_selected: 0,
			text: ""
		}
	}

	/**
	 * When a user is creating a note or review and 
	 * selects a star, this highlights the correct amount
	 */
	$scope.selectRatingStars = function( num_selected ) {
		if( $scope.note_or_review.state === "note" )
			$scope.temp_note.stars_selected = num_selected;
		else if( $scope.note_or_review.state === "review" )
			$scope.temp_review.stars_selected = num_selected;
	}

	/**
	 * When a user saves a note they took on a wine,
	 * this associates the data with their account.
	 */
	$scope.saveNote = function() {
		var new_note, method_to_call;
		if( $scope.temp_note.state === "creating" ) {
			// no previous note existed, create a new one
			new_note = {
				user_id: Meteor.userId(),
				wine_id: $scope.tasting_session.current_wine._id,
				created_at: Date.now(),
				text: $scope.temp_note.text, 
				stars: $scope.temp_note.stars_selected
			}
			method_to_call = "createNote";
		} else if( $scope.temp_note.state === "editing" ) {
			// there was a previous note, update it
			new_note = {
				_id: $scope.temp_note._id,
				user_id: Meteor.userId(),
				wine_id: $scope.tasting_session.current_wine._id,
				created_at: $scope.temp_note.created_at,
				updated_at: Date.now(),
				text: $scope.temp_note.text, 
				stars: $scope.temp_note.stars_selected
			}
			method_to_call = "updateNote";
		}

		$meteor.call( method_to_call, new_note ).then( function( data ) {
			$scope.note_or_review.state = "showing_save_successful";
		}, function( err ) {
			if( err.error === "not-authorized") {
			// if they somehow got logged out before now
				$scope.note_or_review.state = "not_logged_in";
			} else {
			// input data was invalid
				$scope.temp_note.err = err.reason;
			}
		} );
	}

	/**
	 * When a user saves a review, calls the back end method.
	 */
	$scope.saveReview = function() {
		var new_review, method_to_call;
		if( $scope.temp_review.state === "creating" ) {
			// no previous note existed, create a new one
			new_review = {
				user_id: Meteor.userId(),
				user_name: Meteor.user().profile.name,
				wine_id: $scope.tasting_session.current_wine._id,
				created_at: Date.now(),
				text: $scope.temp_review.text, 
				stars: $scope.temp_review.stars_selected
			}
			method_to_call = "createReview";
		} else if( $scope.temp_review.state === "editing" ) {
			// there was a previous note, update it
			new_review = {
				_id: $scope.temp_review._id,
				user_id: Meteor.userId(),
				user_name: Meteor.user().profile.name,
				wine_id: $scope.tasting_session.current_wine._id,
				created_at: $scope.temp_review.created_at,
				updated_at: Date.now(),
				text: $scope.temp_review.text, 
				stars: $scope.temp_review.stars_selected
			}
			method_to_call = "updateReview";
		}

		$meteor.call( method_to_call, new_review ).then( function( data ) {
			$scope.note_or_review.state = "showing_save_successful";
		}, function( err ) {
			if( err.error === "not-authorized") {
			// if they somehow got logged out before now
				$scope.note_or_review.state = "not_logged_in";
			} else {
			// input data was invalid
				$scope.temp_review.err = err.reason;
			}
		} );
	}

	/**
	 * When a user is finished tasting, redirect them 
	 * back to their current winery's home page
	 */
	$scope.finishTasting = function() {
		$scope.tasting_session.reset();
		$location.path( '/winery/' + $stateParams.winery_id );
	}

	$scope.initialize();
}]);
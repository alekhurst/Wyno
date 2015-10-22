angular.module( 'WynoApp' ).controller( 'EditReviewController', [
'$scope',
'$stateParams',
'$state',
'$rootScope',
'$meteor',
function( $scope, $stateParams, $state, $rootScope, $meteor ) {
	$rootScope.body_bg_color = "#F4F4F4"; 
	$scope.temp_review = {};
	$scope.editing_a_review = undefined;
	$scope.submit_deactivated = false;

	// if there's no user logged in, or there was no wine_id
	// provided, just go back
	if(!Meteor.userId() || !$stateParams.wine_id ) {
		$rootScope.goBack();
	}

	// if we're creating a review, initialize some properties
	// to display in the view
	if($stateParams.review_id === 'new') {
		$scope.temp_review = {
			created_at: Date.now()
		}
	} else {
		// if we got here, we're editing a previous review
		$scope.editing_a_review = true;
		$scope.$meteorSubscribe( 'reviews' ).then( function() {
			$scope.temp_review = angular.copy($scope.$meteorCollection( function() {
				return Reviews.find( { _id: $stateParams.review_id } );
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
	 * Get the associated wine to this review for displaying
	 */
	$scope.getAssociatedWine = function() {
		if( !$scope.wines|| !$scope.wineries || !$scope.temp_review ) {
			return;
		}
		
		var data_string = ''; // will contains the winery name & wine name
		var temp_wine = $scope.wines[0];
		var temp_winery = $scope.$meteorObject(Wineries, temp_wine.winery_id, false);
		return temp_winery.name + " " + temp_wine.name;
	}

	/**
	 * When a user is creating a note or review and 
	 * selects a star, this highlights the correct amount
	 */
	$scope.selectRatingStars = function( num_selected ) {
		$scope.temp_review.stars = num_selected;
	}

	/**
	 * Creates a readable date from a timestamp
	 */
	$scope.createReadableDate = function() {
		if( !$scope.temp_review ) {
			return;
		}
		var timestamp = $scope.temp_review.created_at;
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
	 * Calls the delete method on this review
	 */
	$scope.deleteReview = function() {
		$meteor.call( "deleteReview", $scope.temp_review).then( function( data ) {
			$rootScope.goBack();
		}, function( err ) {
			$scope.submission_err = err;
		});
	}

	/**
	 * Saves or updates a review based on how we got to
	 * this view
	 */
	$scope.saveReview = function() {
		if( $scope.submit_deactivated ) {
			return;
		}
		$scope.submit_deactivated  = true;
		var new_review, method_to_call;
		if( $stateParams.review_id === "new" ) {
			// no previous note existed, create a new one
			new_review = {
				user_id: Meteor.userId(),
				user_name: Meteor.user().profile.name,
				wine_id: $stateParams.wine_id,
				created_at: Date.now(),
				text: $scope.temp_review.text, 
				stars: $scope.temp_review.stars
			}
			method_to_call = "createReview";
		} else {
			// there was a previous note, update it
			new_review = {
				_id: $scope.temp_review._id,
				user_id: Meteor.userId(),
				user_name: Meteor.user().profile.name,
				wine_id: $stateParams.wine_id,
				created_at: $scope.temp_review.created_at,
				updated_at: Date.now(),
				text: $scope.temp_review.text, 
				stars: $scope.temp_review.stars
			}
			method_to_call = "updateReview";
		}

		$meteor.call( method_to_call, new_review ).then( function( data ) {
			$rootScope.goBack();
			$scope.submit_deactivated  = false;
		}, function( err ) {
			$scope.submission_err = err.reason;
			$scope.submit_deactivated  = false;
		} );
	}
}]);
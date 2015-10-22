angular.module( 'WynoApp' ).controller( 'NotesController', [
'$scope',
'$stateParams',
'$state',
'$rootScope',
'$meteor',
function( $scope, $stateParams, $state, $rootScope, $meteor ) {
	$rootScope.body_bg_color = "#F4F4F4";

	$scope.$meteorSubscribe( 'notes' ).then( function() {
		$scope.user_notes = $meteor.collection( function() {
			return Notes.find( { user_id: Meteor.userId() } );
		});
	});
	$scope.$meteorSubscribe( 'wines' ).then( function() {
		$scope.wines = $meteor.collection( function() {
			return Wines.find()
		});
	});
	$scope.$meteorSubscribe( 'wineries' ).then( function() {
		$scope.wineries = $meteor.collection( function() {
			return Wineries.find()
		});
	});

	/**
	 * Goes back to the winery_selection view
	 */
	$scope.goBack = function() {
		$state.go('winery_selection');
	}

	$scope.editNote = function(nid, wid) {
		$state.go('edit_note', {note_id: nid, wine_id: wid})
	}

	/**
	 * Gets the associated wine name & winery name of a note's wine. 
	 * @param {string} wine_id - id associated with the wine/winery
	 *    we're looking for 
	 */
	$scope.getAssociatedWineAndWinery = function( wine_id ) {
		if(!$scope.wines || !$scope.wineries) {
			return;
		}
		var data_string = ''; // will contains the winery name & wine name
		var temp_wine = $scope.$meteorObject(Wines, wine_id, false);
		var temp_winery = $scope.$meteorObject(Wineries, temp_wine.winery_id, false);
		return temp_winery.name + " " + temp_wine.name;
	}

	/**
	 * Takes the timestamp from a wine and creates a readable date
	 */
	$scope.createReadableDate = function( timestamp ) {
		var date = new Date( Number( timestamp ) );
		// Get year
		var year = date.getFullYear();
		// Get month
		var month = date.getMonth()
		// get day
		var day = date.getDate();

		return month + "/" + day + "/" + year;
	}

	/**
	 * onload of this controller check if a user is logged in.
	 * If not, send them back
	 */
	if(!Meteor.userId()){
		$scope.goBack();
	}
}]);
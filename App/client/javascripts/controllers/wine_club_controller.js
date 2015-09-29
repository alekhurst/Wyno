angular.module( 'WynoApp' ).controller( 'WineClubController', [
'$scope',
'$stateParams',
'$rootScope',
'$meteor',
function( $scope, $stateParams, $rootScope, $meteor ) {
	$rootScope.body_bg_color = "#F4F4F4";
	$scope.$meteorSubscribe( 'wine_clubs' ).then( function() {
		$scope.wine_clubs = $meteor.collection( function() {
			return WineClubs.find( { winery_id: $stateParams.winery_id } );
		});
	});
} ] );
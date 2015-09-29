angular.module( 'WynoAdmin' ).controller( 'WinerySettingsController', [
'$scope',
'$rootScope',
'$stateParams',
'$meteor',
function( $scope, $rootScope, $stateParams, $meteor ) {
	$scope.temp_winery = {};

	$scope.$meteorSubscribe( 'images' ).then( function() { $scope.images =  $meteor.collectionFS(Images, false, Images) });

	$scope.$meteorSubscribe( 'wineries' ).then( function() {
	    $scope.temp_winery = Wineries.findOne( $stateParams.winery_id );
      if ($scope.temp_winery.logo_id) {
        $scope.$meteorSubscribe('images').then(function() {
            $scope.image = Images.findOne($scope.temp_winery.logo_id);
          }
        )
      }
	});

	$scope.createWinery = function() {
		$scope.temp_winery.created_at = Date.now();
		$scope.temp_winery.updated_at = undefined;
		$meteor.call( 'createWinery', $scope.temp_winery )
	}

	$scope.updateWinery = function() {
		$scope.temp_winery.updated_at = Date.now();
    if ($scope.oldImageId) {
      $meteor.call( 'updateWinery', $scope.temp_winery, $scope.oldImageId );
    } else {
      $meteor.call( 'updateWinery', $scope.temp_winery );
    }
		$rootScope.goHome();
	}

  $scope.uploadFile = function (files) {
    	if (files.length > 0) {
      	$scope.images.save( files[ 0 ] ).then( function( result ) {
          $scope.oldImageId = $scope.temp_winery.logo_id;
      		$scope.temp_winery.logo_id = result[ 0 ]._id._id;
      	});
    	}
  };
}]);

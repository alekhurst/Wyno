/**
 * This controller is used for both tasting_menu and wine_list
 * since all functionality is the same. Tasting menu only wines
 * are returned in the meteor collection query.
 */
angular.module( 'WynoAdmin' ).controller( 'WinesController', [
'$scope',
'$stateParams',
'$location',
'$meteor',
function( $scope, $stateParams, $location, $meteor ) {
	$scope.$meteorSubscribe( 'wines' ).then( function() {
		$scope.wines = $meteor.collection( function() {
			// check if we're in tasting menu
			if( $location.path().split('/')[3] === 'tasting_menu') {
				$scope.page_title = "Tasting Menu";
				return Wines.find( { winery_id: $stateParams.winery_id, in_tasting: true }, { sort: { created_at: 1 } } );
			}
			// if not, were in all wines
			$scope.page_title = "Entire Wine List";
		    return Wines.find( { winery_id: $stateParams.winery_id }, { sort: { created_at: 1 } } )
		});
	});
  	$scope.$meteorSubscribe( 'images' ).then( function() { $scope.images =  $meteor.collectionFS(Images, false, Images) });
	$scope.adding_wine = false;
	$scope.editing_wine = false;
	$scope.temp_wine = {};

	/**
	 * Shows the popup and sets state to adding a new wine.
	 * When save is pressed, the adding state creates a wine 
	 * in the DB as opposed to editing an existing one.
	 */
	$scope.showAddWinePopup = function() {
		$scope.adding_wine = true;
		$scope.temp_wine = {  
            winery_id: $stateParams.winery_id,
            created_at: Date.now(),
            photo_id: "",
            name: "",
            vintage: undefined,
            cases_produced: undefined,
            price:{  
                per_glass: undefined,
                per_bottle: undefined,
                per_case: undefined
            },
            location: "",
            description: "",
            variety: "",
            type: "",
            in_tasting: true,
            modules: {  
                goes_well_with: [],
                richness: 5
            }
        };
	}

	/**
	 * Shows the popup and sets state to editing an existing wine.
	 * When save is pressed, the editing state updates a wine in 
	 * the DB as opposed to creating a new one. 
	 */
	$scope.showEditWinePopup = function( id ) {
		$scope.editing_wine = true;
		angular.extend( $scope.temp_wine, Wines.findOne( id ) );
	}

	/**
	 * Hides the popup and resets the temp wine. Removes adding
	 * or editing state based on which one is currently active
	 */
	$scope.hideWinePopup = function() {
		if( $scope.editing_wine )
			$scope.editing_wine = false;
		else if( $scope.adding_wine )
			$scope.adding_wine = false;
		return;
	}

  	/**
  	 * Image cropping. Shows the image cropping menu in the 
  	 * same place as the previous image.
  	 */
  	$scope.winePhotoImage = '';
  	$scope.winePhotoImageCropped = '';
  	var handleFileSelect = function(evt) {
		if ($scope.temp_wine.photo_id) {
		  	$scope.oldImageId = $scope.temp_wine.photo_id;
		  	$scope.temp_wine.photo_id = '';
		}

		var file = evt.currentTarget.files[0];
		var reader = new FileReader();
		reader.onload = function (evt) {
			$scope.$apply(function($scope) {
			    $scope.winePhotoImage = evt.target.result;
			});
		};
		reader.readAsDataURL(file);
  	};
  	angular.element(document.querySelector('#winePhotoImageInput')).on('change', handleFileSelect);

  	
  	/**
  	 * Begins image upload
  	 */
	$scope.triggerImageUpload = function() {
	    document.querySelector('#winePhotoImageInput').click();
	}

	/**
	 * Gets the thumnail from Images collection
	 * @param {string} photoId
	 */
  	$scope.getImageUrl = function(photoId) {
    	if (photoId) {
      		return Images.findOne(photoId).url({store: 'thumbnail'});
    	}
  	}

  	/**
  	 * Gets the original image from Images collection
  	 * @param {string} photoId
  	 */
  	$scope.getImageUrlOriginal = function(photoId) {
    	if (photoId) {
      		return Images.findOne(photoId).url({store: 'original'});
    	}
  	}

	/**
	 * Adds an empty item to the goes well with module. This will 
	 * be saved whenever the user presses save in the popup.
	 */
	$scope.addItemToGoesWellWith = function() {
		var items = $scope.temp_wine.modules.goes_well_with;
		items.push( "" )
	}

	/**
	 * Removes an empty item to the goes well with module. This
	 * will be saved whenever the user presses save in the popup.
	 * @param {number} index - index of item to remove
	 */
	$scope.removeItemFromGoesWellWith = function( index ) {
		var items = $scope.temp_wine.modules.goes_well_with;
		items.splice( index, 1 );
	}

	/**
	 * Called when user presses save. Determines whether
	 * to create a wine or update an existing one, then calls the
	 * respective server method.
	 */
	$scope.saveWine = function() {
		if( $scope.adding_wine ) {
			$scope.temp_wine.created_at = Date.now();

	      	if ($scope.winePhotoImageCropped) {
	        	$scope.images.save( $scope.winePhotoImageCropped ).then( function( result ) {
		          	$scope.temp_wine.photo_id = result[0]._id._id;
		          	$meteor.call( 'createWine', $scope.temp_wine );
		        });
	      	} else {
	        	$meteor.call( 'createWine', $scope.temp_wine );
	      	}
		} else if( $scope.editing_wine ) {
			$scope.temp_wine.updated_at = Date.now();

      		if ($scope.winePhotoImageCropped) {
        		$scope.images.save( $scope.winePhotoImageCropped ).then( function( result ) {
	          		$scope.temp_wine.photo_id = result[0]._id._id;
	          		$meteor.call( 'updateWine', $scope.temp_wine, $scope.oldImageId );
	          		$scope.oldImageId = null;
	        	});
      		} else {
        		$meteor.call( 'updateWine', $scope.temp_wine );
      		}
		}
	    $scope.winePhotoImage = '';
	    $scope.winePhotoImageCropped = '';
		$scope.hideWinePopup();
	}

	/**
	 * Removes a wine by id from the db
	 * @param {ObjectId} wine_id
	 */
	$scope.removeWine = function( wine_id ) {
		$meteor.call( 'deleteWine', wine_id )
	}
} ] );

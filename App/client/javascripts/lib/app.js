// Instantiate angular app
angular.module( 'WynoApp', ['angular-meteor', 'ui.router']);

// Manually bootstrap angular app on ready based on device
function onReady() {
  angular.bootstrap(document, ['WynoApp']);
}
if (Meteor.isCordova)
  angular.element(document).on('deviceready', onReady);
else
  angular.element(document).ready(onReady);

// Routing
angular.module( 'WynoApp' ).config( ['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
  var app_root = 'client/views/';
  $locationProvider.html5Mode(true);

  $stateProvider
    .state('winery_selection', {
      url: '/',
      templateUrl: app_root + 'winery_selection.ng.html',
      controller: 'WinerySelectionController',
    })
    .state('winery_home', {
        url: '/winery/:winery_id',
        templateUrl: app_root + 'winery_home.ng.html',
        controller: 'WineryHomeController',
    })
    .state('taste', {
        url: '/winery/:winery_id/tasting',
        templateUrl: app_root + 'taste.ng.html',
        controller: 'TasteController',
    })
    .state('specials', {
        url: '/winery/:winery_id/specials',
        templateUrl: app_root + 'specials.ng.html',
        controller: 'SpecialsController',
    })
    .state('wine_club', {
        url: '/winery/:winery_id/wine_club',
        templateUrl: app_root + 'wine_club.ng.html',
        controller: 'WineClubController',
    })
    .state('wine_menu', {
        url: '/winery/:winery_id/wine_menu',
        templateUrl: app_root + 'wine_menu.ng.html',
        controller: 'WineMenuController',
    })
    .state('wine_details_just_browsing', {
        url: '/wine/:wine_id?just_browsing',
        templateUrl: app_root + 'wine_details.ng.html',
        controller: 'WineDetailsController',
    })
    .state('notes', {
        url: '/notes',
        templateUrl: app_root + 'notes.ng.html',
        controller: 'NotesController',
    })
    .state('edit_note', {
        url: '/notes/:note_id/edit',
        templateUrl: app_root + 'edit_note.ng.html',
        controller: 'EditNoteController',
        params: {wine_id: undefined}
    })
    .state('reviews', {
        url: '/reviews',
        templateUrl: app_root + 'reviews.ng.html',
        controller: 'ReviewsController',
    })
    .state('edit_review', {
        url: '/review/:review_id/edit',
        templateUrl: app_root + 'edit_review.ng.html',
        controller: 'EditReviewController',
        params: {wine_id: undefined}
    });

    $urlRouterProvider.otherwise('/');
}]);

// Keep history throughout browsing the app 
angular.module( 'WynoApp' ).run( ['$rootScope', '$location', '$state', function( $rootScope, $location, $state ) {
  var history = [];
  
  $rootScope.$on( '$stateChangeSuccess', function() {
    history.push( $location.$$path );
  });

  $rootScope.user_logged_in = (function() {
      if( Meteor.userId() )
          return true;
      return false;
  })();

  $rootScope.goBack = function () {
    var prevUrl = history.length > 1 ? history.splice(-2)[0] : "/";
    $location.path( prevUrl );
  };

  /**
   * used as hacky solution to show avg rating stars in
   * the view. Hacky way to ng-repeat over a number
   */
  $rootScope.getArrayFromNumber = function( count ) {
    if( !count ) {
      return;
    }
    if( count != parseInt(count) ) {
      count = Math.ceil(count);
    }
    return new Array( count );
  }

  /**
   * Logs the user into facebook
   */
  $rootScope.loginWithFacebook = function() {
    Meteor.loginWithFacebook({requestPermissions: ['email']}, function(err){
      if (err) {
        throw new Meteor.Error("Facebook login failed");
      } else {
        $rootScope.user_logged_in = true;
      }
    });
  };

  /**
   * Logs the user out of facebook
   */
  $rootScope.logout = function() {
    Meteor.logout(function(err){
      if (err) {
        throw new Meteor.Error("Logout failed");
      } else {
        $rootScope.user_logged_in = false;
      }
    })
  }

  /**
   * Gets the full sized image for displaying in the view
   */
  $rootScope.getImageOriginal = function( id ) {
    if ( id && Images.findOne( id ) ) {
      return Images.findOne( id ).url({store: 'original'});
    }
  }

  /**
   * Gets the thumbnail of each wine's image
   * @param {string} id - photo id to query
   */
  $rootScope.getImageThumbnail = function( id ) {
    if ( id && Images.findOne( id ) ) {
      return Images.findOne( id ).url({store: 'thumbnail'});
    }
  }
}])




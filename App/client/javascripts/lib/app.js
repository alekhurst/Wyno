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

    $urlRouterProvider.otherwise('/');
}]);

// Keep history throughout browsing the app 
angular.module( 'WynoApp' ).run( ['$rootScope', '$location', function( $rootScope, $location ) {
  var history = [];
  
  $rootScope.$on( '$stateChangeSuccess', function() {
    history.push( $location.$$path );
  });

  $rootScope.goBack = function () {
    var prevUrl = history.length > 1 ? history.splice(-2)[0] : "/";
    $location.path( prevUrl );
  };

  /**
   * used as hacky solution to show avg rating stars in
   * the view. Hacky way to ng-repeat over a number
   */
  $rootScope.getArrayFromNumber = function( count ) {
    return new Array( count );
  }
}])




angular.module( 'WynoApp' ).config( ['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
  var app_root = 'client/views/';
  $locationProvider.html5Mode({
        enabled:true,
        requireBase: false
    });

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
angular.module( 'WynoAdmin' ).config( [ 
'$stateProvider', 
'$urlRouterProvider', 
'$locationProvider', 
function($stateProvider, $urlRouterProvider, $locationProvider) {
    var app_root = 'client/views/';
    $locationProvider.html5Mode(true);

    $stateProvider
        .state('login', {
            url: '/',
            templateUrl: app_root + 'login.ng.html',
            controller: 'LoginController'
        })
        .state('winery_home', {
            url: '/winery/:winery_id',
            templateUrl: app_root + 'winery_home.ng.html',
            controller: 'WineryHomeController',
            resolve: {
                "currentUser": ["$meteor", function($meteor){
                    return $meteor.requireValidUser(function(user) {
                        if( user.profile.role !== "admin" )
                            return "AUTH_REQUIRED";
                        else
                            return true;
                    });
                }]
            }
        })
        .state('tasting_menu', {
            url: '/winery/:winery_id/tasting_menu',
            templateUrl: app_root + 'wine_list.ng.html',
            controller: 'WinesController',
            resolve: {
                "currentUser": ["$meteor", function($meteor){
                    return $meteor.requireValidUser(function(user) {
                        if( user.profile.role !== "admin" )
                            return "AUTH_REQUIRED";
                        else
                            return true;
                    });
                }]
            }
        })
        .state('wine_list', {
            url: '/winery/:winery_id/wine_list',
            templateUrl: app_root + 'wine_list.ng.html',
            controller: 'WinesController',
            resolve: {
                "currentUser": ["$meteor", function($meteor){
                    return $meteor.requireValidUser(function(user) {
                        if( user.profile.role !== "admin" )
                            return "AUTH_REQUIRED";
                        else
                            return true;
                    });
                }]
            }
        })
        .state('winery_settings', {
            url: '/winery/:winery_id/winery_settings',
            templateUrl: app_root + 'winery_settings.ng.html',
            controller: 'WinerySettingsController',
            resolve: {
                "currentUser": ["$meteor", function($meteor){
                    return $meteor.requireValidUser(function(user) {
                        if( user.profile.role !== "admin" )
                            return "AUTH_REQUIRED";
                        else
                            return true;
                    });
                }]
            }
        })
        .state('specials', {
            url: '/winery/:winery_id/specials',
            templateUrl: app_root + 'specials.ng.html',
            controller: 'SpecialsController',
            resolve: {
                "currentUser": ["$meteor", function($meteor){
                    return $meteor.requireValidUser(function(user) {
                        if( user.profile.role !== "admin" )
                            return "AUTH_REQUIRED";
                        else
                            return true;
                    });
                }]
            }
        })
        .state('wine_clubs', {
            url: '/winery/:winery_id/wine_clubs',
            templateUrl: app_root + 'wine_clubs.ng.html',
            controller: 'WineClubsController',
            resolve: {
                "currentUser": ["$meteor", function($meteor){
                    return $meteor.requireValidUser(function(user) {
                        if( user.profile.role !== "admin" )
                            return "AUTH_REQUIRED";
                        else
                            return true;
                    });
                }]
            }
        })

    $urlRouterProvider.otherwise('/');
} ] );
angular.module( 'WynoAdmin' ).run( [
'$rootScope', 
'$stateParams', 
'$state',
'$meteor', 
function( $rootScope, $stateParams, $state, $meteor ) {
    $rootScope.show_user_options = false;

    /**
     * Takes the user to winery_home
     */
    $rootScope.goHome = function() {
        $state.go( 'winery_home', { winery_id: $stateParams.winery_id } );
    }

    /** 
     * Logs the user out, which in turn routes them back to the
     * login page
     */
    $rootScope.logout = function() {
        $meteor.logout().then( function() {
            $state.go( 'login' );
        });
    }

    /**
     * This catches the error thrown when the $meteor.requireUser() 
     * promise is rejected and redirects the user back to the login page
     */
    $rootScope.$on( "$stateChangeError", function( event, toState, toParams, fromState, fromParams, error ) {
        if ( error === "AUTH_REQUIRED" ) {
            $state.go( 'login' );
        }
    });
}])
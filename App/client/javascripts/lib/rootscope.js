angular.module( 'WynoApp' ).run( ['$rootScope', '$location', '$state', function( $rootScope, $location, $state ) {
  var history = [];
  
  $rootScope.$on( '$stateChangeSuccess', function() {
    history.push( $location.$$path );
  });

  $rootScope.goBack = function () {
    var prevUrl = history.length > 1 ? history.splice(-2)[0] : "/";
    $location.path( prevUrl );
  };

  $rootScope.setBackgroundColor = function( color ) {
    document.querySelector( 'body' ).style.backgroundColor = color;
  }

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
    $rootScope.facebook_loading = true;
    Meteor.loginWithFacebook({requestPermissions: ['email']}, function(err){
      $rootScope.facebook_loading = false;
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
    $rootScope.facebook_loading = true;
    Meteor.logout(function(err){
      $rootScope.facebook_loading = false;
      if (err) {
        throw new Meteor.Error("Logout failed");
      } else {
        $rootScope.user_logged_in = false;
      }
    })
  }

  $rootScope.user_logged_in = (function() {
      if( Meteor.userId() )
          return true;
      return false;
  })();

  /**
   * Gets the full sized image for displaying in the view
   */
  $rootScope.getImageOriginal = function( id ) {
    if ( id && Images.findOne( id ) ) {
      return Images.findOne( id ).url({store: 'original'});
    } else {
      return false;
    }
  }

  /**
   * Gets the thumbnail of each wine's image
   * @param {string} id - photo id to query
   */
  $rootScope.getImageThumbnail = function( id ) {
    if ( id && Images.findOne( id ) ) {
      return Images.findOne( id ).url({store: 'thumbnail'});
    } else {
      return false;
    }
  }
}])
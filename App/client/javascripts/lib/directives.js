angular.module('WynoApp').directive('showLoadingSpinner', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    replace: true,
    transclude: true,
    scope: {
      loading: '=showLoadingSpinner'
    },
    templateUrl: 'client/views/loading.ng.html',
    link: function(scope, element, attrs) {
      scope.timeout = false;
      
      var opts = {
        lines: 13 // The number of lines to draw
      , length: 5 // The length of each line
      , width: 2 // The line thickness
      , radius: 8 // The radius of the inner circle
      , scale: 1 // Scales overall size of the spinner
      , corners: 1 // Corner roundness (0..1)
      , color: '#000' // #rgb or #rrggbb or array of colors
      , opacity: 0.25 // Opacity of the lines
      , rotate: 0 // The rotation offset
      , direction: 1 // 1: clockwise, -1: counterclockwise
      , speed: 1.4 // Rounds per second
      , trail: 60 // Afterglow percentage
      , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
      , zIndex: 2e9 // The z-index (defaults to 2000000000)
      , className: 'spinner' // The CSS class to assign to the spinner
      , top: '50%' // Top position relative to parent
      , left: '50%' // Left position relative to parent
      , shadow: false // Whether to render a shadow
      , hwaccel: false // Whether to use hardware acceleration
      , position: 'absolute' // Element positioning
      }
      var spinner = new Spinner(opts).spin();
      var loadingContainer = element.find('.my-loading-spinner-container')[0];
      loadingContainer.appendChild(spinner.el);

      $timeout(function() {
        scope.timeout = true;
      }, 8000)
    }
  };
}]);

angular.module('WynoApp').directive('imageonload', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      debugger;
    }
  };
});
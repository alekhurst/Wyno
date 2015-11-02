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
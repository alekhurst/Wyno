App.configurePlugin('com.phonegap.plugins.facebookconnect', {
  APP_ID: '767742936685686',
  APP_NAME: 'Wyno'
});

App.info({
  name: 'Wyno',
  description: 'Your personal wine tasting assistant. Wyno is currently in open beta, feel free to give it a whirl!',
  author: 'Alek Hurst',
  version: '0.0.1'
});

App.accessRule('*');

App.setPreference('Orientation', 'portrait');
App.setPreference('StatusBarOverlaysWebView', 'true');
App.setPreference('StatusBarStyle', 'lightcontent');

App.icons({
  'iphone': 'public/images/icon-60.png',
  'iphone_2x': 'public/images/icon-60@2x.png',
  'iphone_3x': 'public/images/icon-60@3x.png'
});

App.launchScreens({
  'iphone_2x': 'public/images/Default@2x.png',
  'iphone5': 'public/images/Default-568@2x.png',
  'iphone6': 'public/images/Default-iPhone6.png',
  'iphone6p_portrait': 'public/images/Default-iPhone6Plus.png'
});


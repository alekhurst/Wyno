App.info({
  name: 'Wyno',
  description: 'Your personal wine tasting assistant',
  author: 'Alek Hurst',
  website: 'http://wyno.io:3000',
  version: '0.0.1'
});

App.icons({
  'iphone': 'public/images/icon-60.png',
  'iphone_2x': 'public/images/icon-60@2x.png',
  'iphone_3x': 'public/images/icon-60@3x.png'
});

App.setPreference('Orientation', 'portrait');

App.launchScreens({
  'iphone_2x': 'public/images/Default@2x.png',
  'iphone5': 'public/images/Default-568@2x.png',
  'iphone6': 'public/images/Default-iPhone6.png',
  'iphone6p_portrait': 'public/images/Default-iPhone6Plus.png'
});
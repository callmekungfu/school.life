App.setPreference('StatusBarOverlaysWebView', 'false');
App.setPreference('StatusBarBackgroundColor', '#000000');
App.setPreference('Orientation', 'portrait');

App.info({
    id: 'com.life.uhs',
    description: 'A desceiption i wrote about the app',
    author: 'Linus j',
    email: 'Xxx@xxx.com',
    website: 'http://xxxx.com'
});

App.configurePlugin('cordova-plugin-googleplus', {
    REVERSED_CLIENT_ID: 'com.googleusercontent.apps.152156454960-bbg141hjift2scva84trap25a4d72s6g'
});

App.configurePlugin('cordova-plugin-googleplayservices');

App.accessRule('http://*.algolianet.com', {
    'minimum-tls-version': 'TLSv1.0',
    'requires-forward-secrecy': false,
});
App.accessRule('http://*.algolia.com', {
    'minimum-tls-version': 'TLSv1.0',
    'requires-forward-secrecy': false,
});

App.accessRule('*');

App.appendToConfig(`<platform name="ios">
    <config-file platform="ios" target="*-Info.plist" parent="NSPhotoLibraryUsageDescription">
      <string>YOUR DESCRIPTION (PHOTOS PERMISSION) HERE</string>
    </config-file>
    <config-file platform="ios" target="*-Info.plist" parent="NSCameraUsageDescription">
      <string>YOUR DESCRIPTION (CAMERA PERMISSION) HERE</string>
    </config-file>
  </platform>`);

/*
NSAppTransportSecurity: Dictionary
 - NSAllowsArbitraryLoads: Boolean = YES
 */
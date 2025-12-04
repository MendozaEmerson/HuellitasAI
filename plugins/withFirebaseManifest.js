const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withFirebaseManifest(config) {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults.manifest;

    // Agregar namespace 'tools' si no existe
    if (!androidManifest.$['xmlns:tools']) {
      androidManifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
    }

    // Modificar la aplicación
    const application = androidManifest.application?.[0];
    if (application && application['meta-data']) {
      application['meta-data'].forEach((meta) => {
        // Resolver conflicto de notification_color
        if (meta.$['android:name'] === 'com.google.firebase.messaging.default_notification_color') {
          meta.$['tools:replace'] = 'android:resource';
          meta.$['android:resource'] = '@color/white';
        }
      });
    }

    return config;
  });
};

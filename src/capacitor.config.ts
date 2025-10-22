import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'com.playserious.standbyplus',
  appName: 'StandBy+',
  webDir: 'build',
  bundledWebRuntime: false,
  ios: {
    contentInset: 'always'
  },
  plugins: {
    StatusBar: {
      style: 'dark',
      backgroundColor: '#000000',
      overlaysWebView: false
    },
    SplashScreen: {
      launchShowDuration: 0,
      backgroundColor: '#000000',
      showSpinner: false
    }
  }
};

export default config;

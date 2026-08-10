import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wudapp.mobile',
  appName: 'Wudapp',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // Development: point to local server on same network
    // url: 'http://192.168.x.x:3001',
  },
  plugins: {
    Camera: { permissions: ['camera'] },
    Microphone: { permissions: ['microphone'] },
  },
};

export default config;

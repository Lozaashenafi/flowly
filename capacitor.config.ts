import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.flowly.app",
  appName: "flowly",
  webDir: "out",
  server: {
    // This allows Next.js routing and CSS paths to work perfectly
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffff", // Match your app theme
      showSpinner: false,
      androidScaleType: "CENTER_CROP",
    },
  },
};

export default config;

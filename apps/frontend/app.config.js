import dotenv from "dotenv";

dotenv.config();

const config = {
  expo: {
    name: "readvocab-frontend",
    slug: "readvocab-frontend",
    extra: {
      apiUrl: process.env.API_URL,
    },
    version: "1.0.0",
    orientation: "portrait",
    entryPoint: "./index.ts",
    icon: "./assets/images/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#FFFFFF",
      },
      softwareKeyboardLayoutMode: "pan",
    },
    web: {
      favicon: "./assets/images/favicon.png",
    },
  },
};

export default config;

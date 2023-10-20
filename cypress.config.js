const { defineConfig } = require("cypress");
const cypressFirebasePlugin = require("cypress-firebase").plugin;
const admin = require("firebase-admin");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      const extendedConfig = cypressFirebasePlugin(on, config, admin, {
        projectId: "weather-app-dp-fc92c",
        databaseURL:
          "https://weather-app-dp-fc92c-default-rtdb.europe-west1.firebasedatabase.app/",
      });

      return extendedConfig;
    },
  },
});

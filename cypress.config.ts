import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "2ec8id",


  e2e: {
    baseUrl: "http://localhost:3000/",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    supportFile: false
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});

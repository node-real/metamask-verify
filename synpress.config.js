const { defineConfig } = require('cypress');
const synpressPlugins = require('@robertw07/synpress/plugins');

module.exports = defineConfig({
  e2e: {
    specPattern: 'tests/e2e/specs',
    supportFile: 'tests/support/index.js',
    videosFolder: 'result/e2e/videos',
    screenshotsFolder: 'result/e2e/screenshots',
    // video: true,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      synpressPlugins(on, config);
      return config
    },
    defaultCommandTimeout: 120000,  // 全局命令超时时间设置为 120 秒
    taskTimeout: 120000            // 任务超时时间设置为 120 秒
  },
});
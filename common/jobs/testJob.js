var cron = require("node-cron");

const testJob = () => {
  cron.schedule("*/2 * * * * *", () => {
    console.log("running a task every two second test job");
  });
};

module.exports = testJob;

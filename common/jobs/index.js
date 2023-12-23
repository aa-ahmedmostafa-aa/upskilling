const dailyEmail = require("./dailyEmail");
const testJob = require("./testJob");

const jobs = () => {
  dailyEmail();
  testJob()

};

module.exports = jobs;

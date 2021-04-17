const { CronJob, CronTime } = require("cron");

var job = new CronJob(
    `1 */1 * * * *`,
    function () {
        console.log(`In ra lúc 12h mỗi ngày!`);
    },
    function () {
        console.log(`Finished!`);
    },
    true,
    'America/Los_Angeles'
);
// Use this if the 4th param is default value(false)
// job.start()
const fs = require("fs");
const path = require("path");

const startTime = Date.now();

function getLogFilePaths() {
  const filename = process.env.LOGFILE
    ? `${startTime}-${process.env.LOGFILE}`
    : `${startTime}-storysquad.log`;
  const foldername = process.env.LOGFOLDER ? process.env.LOGFOLDER : ".";
  const paths = [foldername, filename];
  const result = path.resolve(path.join(...paths));
  return result;
}

if (process.env.WRITELOG) {
  console.log("logging to ", getLogFilePaths());
}

/**
 * write to log file when
 * WRITELOG=1
 *
 * @param entry message
 */
const log = function (entry) {
  const message = `${new Date().toISOString()} - ${entry}\n`;
  if (process.env.WRITELOG === "1") {
    try {
      fs.appendFileSync(getLogFilePaths(), message);
    } catch (err) {
      console.log(message);
    }
  } else {
    console.log(message);
  }
};

module.exports= { log }

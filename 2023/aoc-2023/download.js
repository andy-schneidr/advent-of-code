if (process.argv.length !== 3) {
  console.log("Usage: node download.js <day>");
  process.exit(1);
}
const fs = require("fs");
const path = require("path");
const https = require("https");

const year = 2023;
const day = process.argv[2];
console.log(`Downloading input for day ${day}`);

const SESSION_ID_FILE = path.join(__dirname, ".session");
const INPUT_FILE = path.join(
  __dirname,
  `public/io/useDay${day}/input.in.txt`
);
const AGENT_NAME = "github.com/andy-schneidr/advent-of-code";
const AGENT_VERSION = "2023-11-29";
const CONTACT = "https://github.com/andy-schneidr";
const USER_AGENT = `${AGENT_NAME} ${AGENT_VERSION}; contact @ ${CONTACT}`;

/**
 * @returns {string} - the session cookie
 * @throws {Error} - if the `.session` file does not exist
 * @throws {Error} - if the session cookie is invalid
 */
const getSessionCookie = () => {
  try {
    return fs.readFileSync(SESSION_ID_FILE, "utf8").trim();
  } catch (err) {
    if (err.code === "ENOENT") {
      throw new Error(
        'No session cookie found. Run "npm run session {cookie}" to set it.'
      );
    }
  }
};

const sessionId = getSessionCookie();

/**
 * Performs an HTTPS GET against the given URL. Expects `sessionId` to be
 * populated.
 *
 * @param {string} url - the URL to GET
 * @returns {string} - the response body
 * @throws {Error} - if the request failed
 */
const get = (url) =>
  new Promise((resolve, reject) => {
    const options = {
      headers: {
        Cookie: `session=${sessionId}`,
        "User-Agent": USER_AGENT,
      },
    };
    const req = https.get(url, options, (res) => {
      if (res.statusCode !== 200) {
        const error = new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`);
        error.statusCode = res.statusCode;
        error.statusMessage = res.statusMessage;

        if (res.statusCode === 400) {
          error.statusMessage +=
            " (Has your session cookie expired? Inspect the application of adventofcode.com to update it.)";
        }

        reject(error);
        return;
      }

      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        resolve(data);
      });
    });
    req.on("error", reject);
    req.end();
  });

/**
 * Retrieves the input for the given day from the Advent of Code web site. This
 * requires that `.session` exists and contains the value of the session
 * cookie. Note that this will be rate limited; if it's been less than 10
 * seconds since the last request, the request will be delayed until that time.
 *
 * @param {number} year - the puzzle year
 * @param {number} day - the puzzle day
 * @returns {string} - the puzzle input
 * @throws {Error} - if could not communicate with the AoC web site
 */
const readFromSite = async (year, day) => {
  const input = await get(`https://adventofcode.com/${year}/day/${day}/input`);
  fs.writeFileSync(INPUT_FILE, input, "utf8");
};

readFromSite(year, day);

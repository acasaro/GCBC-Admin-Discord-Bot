const { google } = require("googleapis");
const { loadSavedCredentialsIfExist, getTrackedRoles } = require("../server/firebase");

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  try {
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      "http://localhost"
    );
    const credential = await loadSavedCredentialsIfExist();
    if (!credential) {
      return null;
    }

    auth.setCredentials({ access_token: credential?.googleAccessToken });

    // const auth = await google.auth.getClient({
    //   scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    // });

    const sheets = google.sheets({ version: "v4", auth });

    return sheets;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Test function that gets a google sheet and
 * returns values.
 *
 */
async function getSheet(range) {
  const config = await getTrackedRoles();
  const spreadsheetId = config?.sheet_id;
  if (!spreadsheetId) {
    return null;
  }
  const sheets = await authorize();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Active Clients",
  });

  const rows = res.data.values;
  if (!rows || rows.length === 0) {
    console.log("No data found.");
    return;
  }

  rows.forEach((col) => {
    // Print columns A, B and C, which correspond to indices 0-2.
    console.log(`${col[0]}, ${col[1]}, ${col[2]}`);
  });
  return;
}

/**
 * Updates values in a Spreadsheet.
 * @param {string} range The range of values to update.
 * @param {object} valueInputOption Value update options.
 * @param {(string[])[]} _values A 2d array of values to update.
 * @return {obj} spreadsheet information
 */
async function updateValues(range, valueInputOption, _values) {
  const config = await getTrackedRoles();

  const spreadsheetId = config?.sheet_id;
  if (!spreadsheetId) {
    return null;
  }
  const service = await authorize();
  if (!service) {
    return null;
  }

  let values = _values;
  const data = [
    {
      range,
      values,
    },
  ];
  // Additional ranges to update ...
  const resource = {
    data,
    valueInputOption,
  };
  try {
    const result = await service.spreadsheets.values.batchUpdate({
      spreadsheetId,
      resource,
    });

    console.log("%d cells updated.", result.data.updatedCells);
    return result;
  } catch (err) {
    // TODO (Developer) - Handle exception
    throw err;
  }
}

module.exports = {
  getSheet,
  updateValues,
};

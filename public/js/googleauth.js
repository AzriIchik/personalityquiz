/* exported gapiLoaded */
/* exported gisLoaded */
/* exported handleAuthClick */
/* exported handleSignoutClick */

// TODO(developer): Set to client ID and API key from the Developer Console
const CLIENT_ID = "200954600330-2ass57hs0b8m98ptdm7ocobh8lo37347.apps.googleusercontent.com";
const API_KEY = "AIzaSyB7MHmqFinOjNXkfhMKFg8MwwqcAPmnTKo";

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC =
  "https://sheets.googleapis.com/$discovery/rest?version=v4";

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly https://www.googleapis.com/auth/spreadsheets";

let tokenClient;
let gapiInited = false;
let gisInited = false;

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
  gapi.load("client", initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
  gapiInited = true;
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: "", // defined later
  });
  gisInited = true;
}

/**
 *  Sign in the user upon button click.
 */

window.addEventListener("load", function () {
  document.sendDataToSheet = handleAuthClick;
});

const handleAuthClick = async (sentData) => {

  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw resp;
    }
    await listMajors(sentData);
  };

  if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({ prompt: "consent" });
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({ prompt: "" });
  }
  await listMajors(sentData);
};

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken("");
    document.getElementById("content").innerText = "";
    document.getElementById("authorize_button").innerText = "Authorize";
    document.getElementById("signout_button").style.visibility = "hidden";
  }
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
async function listMajors(sentData) {
  let response;
  try {
    const SPREADSHEET_ID = "1QHee-4mh2a9OF659eA6KxnWiPpuHtea3oYDKQVEGAEE";
    const SHEET_NAME = "Sheet1";
    const RANGE = `${SHEET_NAME}!A:A`;

    response = await gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
      valueInputOption: "RAW",
      resource: {
        values: sentData,
      },
    });
  } catch (err) {
    console.log(err.message);
    return;
  }
}

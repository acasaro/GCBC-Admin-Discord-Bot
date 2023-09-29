const { initializeApp, applicationDefault, cert } = require("firebase-admin/app");
const { getFirestore, Timestamp, FieldValue, Filter } = require("firebase-admin/firestore");

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

async function setTrackedRoles(trackedRoles) {
  try {
    if (trackedRoles.length === 0) return;

    return db.collection("settings").doc("gcbc_settings").set({
      tracked_roles: trackedRoles,
    });
  } catch (error) {
    console.log(error);
  }
}

async function updateGoogleSheetId(sheetId) {
  try {
    return db.collection("settings").doc("gcbc_settings").set(
      {
        sheet_id: sheetId,
      },
      { merge: true }
    );
  } catch (error) {
    console.log(error);
  }
}

async function getTrackedRoles() {
  try {
    const snapshot = await db.collection("settings").doc("gcbc_settings").get();

    return snapshot.data();
  } catch (error) {
    console.log(error);
  }
}

async function loadSavedCredentialsIfExist() {
  try {
    const snapshot = await db.collection("settings").doc("gcbc_settings").get();
    const googleAccessToken = snapshot.data()?.googleAccessToken;
    const googleRefreshToken = snapshot.data()?.googleRefreshToken;
    if (!googleAccessToken || !googleRefreshToken) {
      return null;
    }

    const content = JSON.stringify({
      type: "authorized_user",
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: googleRefreshToken,
    });
    const credentials = JSON.parse(content);

    return credentials;
  } catch (err) {
    return null;
  }
}

async function saveCredentials(googleAccessToken, googleRefreshToken) {
  if (!googleRefreshToken && !googleAccessToken) {
    return console.log("RefreshToken & AccessToken missing and not saved");
  }
  try {
    return db.collection("settings").doc("gcbc_settings").set(
      {
        googleRefreshToken,
        googleAccessToken,
      },
      { merge: true }
    );
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  setTrackedRoles,
  getTrackedRoles,
  loadSavedCredentialsIfExist,
  saveCredentials,
  updateGoogleSheetId,
};

const { initializeApp, applicationDefault, cert } = require("firebase-admin/app");
const { getFirestore, Timestamp, FieldValue, Filter } = require("firebase-admin/firestore");

const serviceAccount = require("./gcbc-admin-bot-e5e546b32477.json");

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

async function getTrackedRoles() {
  try {
    const snapshot = await db.collection("settings").doc("gcbc_settings").get();

    return snapshot.data();
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  setTrackedRoles,
  getTrackedRoles,
};

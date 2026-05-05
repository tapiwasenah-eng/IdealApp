import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));

const app = admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: config.projectId
});

const db = getFirestore(app);

async function run() {
  try {
    console.log("Trying to get user...");
    const snap = await db.collection('users').limit(1).get();
    console.log("Success! Users found: ", snap.size);
  } catch(e) {
    console.log("Error:", e);
  }
}
run();

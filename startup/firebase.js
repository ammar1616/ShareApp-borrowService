var admin = require("firebase-admin");
const { Filter, FieldValue, FieldPath } = require('firebase-admin/firestore');

var serviceAccount = require("./share-7b17f-firebase-adminsdk-vh7sw-9738641bea.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://share-app-196b2.appspot.com',
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { db, bucket, Filter, FieldValue, FieldPath };
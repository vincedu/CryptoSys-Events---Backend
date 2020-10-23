const setupFirebase = () => {
    const admin = require("firebase-admin");

    const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS;

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://eosio-8f13d.firebaseio.com",
    });
};

module.exports = {
    setupFirebase,
};

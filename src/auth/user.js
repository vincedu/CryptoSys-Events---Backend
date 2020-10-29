const admin = require("firebase-admin");

const getUser = (req) => {
    if (req.headers.authorization.startsWith("Bearer ")) {
        // Get the user token from the headers.
        const token = req.headers.authorization.split("Bearer ")[1];
        return new Promise((resolve, reject) => {
            admin
                .auth()
                .verifyIdToken(token)
                .then((decodedToken) => {
                    admin
                        .auth()
                        .getUser(decodedToken.uid)
                        .then(function (userRecord) {
                            resolve(userRecord);
                        })
                        .catch(function (error) {
                            reject(error);
                        });
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }
};

const getUserId = (req) => {
    if (req.headers.authorization.startsWith("Bearer ")) {
        // Get the user token from the headers.
        const token = req.headers.authorization.split("Bearer ")[1];
        if (!token) {
            console.log("token is not provided");
            return;
        }
        return new Promise((resolve, reject) => {
            admin
                .auth()
                .verifyIdToken(token)
                .then((decodedToken) => {
                    resolve(decodedToken.uid);
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }
};

module.exports = {
    getUserId,
    getUser,
};

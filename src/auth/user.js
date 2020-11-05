const admin = require("firebase-admin");

const getUser = (req) => {
    return new Promise((resolve, reject) => {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            // Get the user token from the headers.
            const token = req.headers.authorization.split("Bearer ")[1];
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
        } else {
            reject();
        }
    });
};

const getUserId = (req) => {
    return new Promise((resolve, reject) => {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            // Get the user token from the headers.
            const token = req.headers.authorization.split("Bearer ")[1];
            if (!token) {
                console.log("token is not provided");
                return;
            }

            admin
                .auth()
                .verifyIdToken(token)
                .then((decodedToken) => {
                    resolve(decodedToken.uid);
                })
                .catch(function (error) {
                    reject(error);
                });
        } else {
            reject();
        }
    });
};

module.exports = {
    getUserId,
    getUser,
};

const { RESTDataSource } = require("apollo-datasource-rest");

class UserAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = "https://us-central1-eosio-8f13d.cloudfunctions.net/api/";
    }

    async getUserDataByUserId(userId) {
        const userDataResponse = await this.get(`user/${userId}`);

        if (!userDataResponse.displayName) {
            console.log(`ERROR: Unable get user data for user ${userId}.`);
            return;
        }

        return userDataResponse.displayName;
    }
}

module.exports = { UserAPI };

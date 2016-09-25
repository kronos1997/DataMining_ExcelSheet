var request = require('request')
var mongoClient = require('./mongo-client.js')
var self = null;

// module.exports = function (token) {
//     return new Search(token)
// }

var luisClient = function Constructor(settings) {
    self = this;
    self.data = settings.data;
};

var count = 0;
luisClient.prototype._promiseForLuisEntity = function () {
    if (this.data.length > 0) {
        this._processLuisEntity();
    }
}

luisClient.prototype._processLuisEntity = function () {
    var options = {
        //url: PUT Luis.ai LINK HERE,
        json: true
    };
    console.log(self.data[count].Remarks)
    request(options, function (error, response, returndata) {
        if (error) {
            return error
        }
        if (response.statusCode !== 200) {
            return;
            //return new Error('unexpected status ' + response.statusCode)
        }
        console.log(returndata)
        
        //Filter or handle returndata here and store in an array

        //Recursive function
        if (count + 1 < self.data.length) {
            count++;
            self._processLuisEntity();
        } else {
            // return self.data;
            this.mongoClient = new mongoClient ({
                //url: MONGODB LINK HERE,
                data: self.data
            });
            this.mongoClient._storeData()
        }
    })
}

module.exports = luisClient;
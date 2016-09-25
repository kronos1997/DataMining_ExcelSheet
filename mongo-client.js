var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

var mongoClient = function Constructor(settings) {
    self = this;
    self.url = settings.url;
    self.data = settings.data;
};

mongoClient.prototype._storeData = function () {
    // Use connect method to connect to the Server 
    MongoClient.connect(self.url, function(err, db) {
    //assert.equal(null, err);
    console.log("Connected correctly to server");
    
    insertDocuments(db, function() {
        db.close();
        console.log("Successfully stored data in mongoDB");
    });
    });
}

var insertDocuments = function(db, callback) {
    // Get the documents collection 
    var collection = db.collection(/*Name of collection*/);
    // Insert some documents 
    collection.insertMany(self.data, function(err, result) {
        callback(result);
    });
    }

module.exports = mongoClient;
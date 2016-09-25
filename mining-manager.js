var excelClient = require('./excel-client.js');
var luisClient = require('./luis-client.js');
var mongoClient = require('./mongo-client.js')
var XLSX = require('xlsx');
var workbook = XLSX.readFile('RepairText.xlsx');

var textMiner = function Constructor(settings) {
}

// Public methods
textMiner.prototype.run = function () {
  this._setupExcel();
};

//Private methods
textMiner.prototype._setupExcel = function () {
  this.excelClient = new excelClient ({
    workbook: workbook
  });
  this._fetchDataFromExcel();
};

textMiner.prototype._fetchDataFromExcel = function () {
  this.excelClient._getExcelData().then(function (data) {
    console.log(data);
    this._setupLuis(data);
  }.bind(this)).fail(function (error) {
    console.log(error)
  }).done();
};

textMiner.prototype._setupLuis = function (data) {
  this.luisClient = new luisClient ({
    data: data
  });
  this.luisClient._promiseForLuisEntity();
  // this.luisClient._promiseForLuisEntity().then(function (data) {
  //   console.log(data);
  //   this._setupMongo(data);
  // }.bind(this)).fail(function (error) {
  //   console.log(error)
  // }).done();
};

textMiner.prototype._setupMongo = function (data) {
  this.mongoClient = new mongoClient ({
    url: "mongodb://themrolab:password@ds044679.mlab.com:44679/repair_info",
    data: data
  });
  this.mongoClient._storeData()
  // .then(function () {
  //   //console.log(data);
  // }.bind(this)).fail(function (error) {
  //   console.log(error)
  // }).done();
};

module.exports = textMiner;
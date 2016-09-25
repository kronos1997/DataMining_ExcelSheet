// var XLSX = require('xlsx');
// var workbook = XLSX.readFile('RepairText.xlsx');
// var sheet_name_list = workbook1.SheetNames;
var vow = require('vow');
var workbook;
var sheet_name_list;

var excelClient = function Constructor(settings) {
  workbook = settings.workbook
  sheet_name_list = workbook.SheetNames;
}

excelClient.prototype._getExcelData = function () {
    return new vow.Promise(function(resolve, reject) {
        sheet_name_list.forEach(function(y) {
        var worksheet = workbook.Sheets[y];
        var headers = {};
        var data = [];
        for(z in worksheet) {
            if(z[0] === '!') continue;
            //parse out the column, row, and value
            var tt = 0;
            for (var i = 0; i < z.length; i++) {
                if (!isNaN(z[i])) {
                    tt = i;
                    break;
                }
            };
            var col = z.substring(0,tt);
            var row = parseInt(z.substring(tt));
            var value = worksheet[z].v;

            //store header names
            if(row == 1 && value) {
                headers[col] = value;
                continue;
            }

            if(!data[row]) data[row]={};
            data[row][headers[col]] = value;
        }
        //drop those first two rows which are empty
        data.shift();
        data.shift();
        console.log(data);
        if (data) {
                resolve(data)
            } else {
                reject(data)
            }
        return data;
        })
    });    
}

module.exports = excelClient;
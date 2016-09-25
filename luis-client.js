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
    //console.log(this.data);
    // for(var i = 0; i < this.data.length; i++){
    // for(var i = 0; i < 1; i++){
    //     var options = {
    //         url: "https://api.projectoxford.ai/luis/v1/application?id=5b420997-9bb5-4f1d-9e7c-611ca3bd3303&subscription-key=9684a8f1fbf84c0ab6438369a4bd4941&q="+encodeURIComponent(this.data[i].Remarks),
    //         json: true
    //     };
    //     //var url = "https://api.projectoxford.ai/luis/v1/application?id=5b420997-9bb5-4f1d-9e7c-611ca3bd3303&subscription-key=9684a8f1fbf84c0ab6438369a4bd4941&q="+encodeURIComponent(this.data[i].Remarks)
    //     console.log(this.data[i].Remarks)
    //     request(options, function (error, response, data) {
    //         if (error) {
    //             return error
    //         }
    //         if (response.statusCode !== 200) {
    //             return new Error('unexpected status ' + response.statusCode)
    //         }
    //         // return data
    //     })
    // }
    if (this.data.length > 0) {
        this._processLuisEntity();
    }
}

luisClient.prototype._processLuisEntity = function () {
    var options = {
        url: "https://api.projectoxford.ai/luis/v1/application?id=5b420997-9bb5-4f1d-9e7c-611ca3bd3303&subscription-key=9684a8f1fbf84c0ab6438369a4bd4941&q="+encodeURIComponent(self.data[count].Remarks),
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
        // return data
        // console.log(returndata.compositeEntities[1].children[0].type)
        var process = "";
        var repair = 0;
        var rework = 0;
        var replace = 0;
        var test= 0;
        var inspect = 0;
        var equipment = "";
        var panel = 0;
        var lamp = 0;
        var misc = 0;
        var countP = 0;
        var countE = 0;
        if(returndata.compositeEntities != undefined && returndata.compositeEntities.length != 0){
            // var process = "";
            // var repair = 0;
            // var rework = 0;
            // var replace = 0;
            // var test= 0;
            // var inspect = 0;
            // var equipment = "";
            // var panel = 0;
            // var lamp = 0;
            // var misc = 0;
            // var countP = 0;
            // var countE = 0;
            for(var i=0; i<returndata.compositeEntities.length; i++){
                if (returndata.compositeEntities[i].parentType == "Process"){
                    if(countP == 0){
                        if(returndata.compositeEntities[i].children.length != 0){
                            process += returndata.compositeEntities[i].children[0].type
                            countP++;
                        }
                    }else{
                        if(returndata.compositeEntities[i].children.length != 0){
                            process += ", " + returndata.compositeEntities[i].children[0].type
                        }
                    }
                    if(returndata.compositeEntities[i].children.length != 0){
                        if (returndata.compositeEntities[i].children[0].type == "Repair"){
                            repair++;
                        }else if (returndata.compositeEntities[i].children[0].type == "Rework"){
                            rework++;
                        }else if (returndata.compositeEntities[i].children[0].type == "Replace"){
                            replace++;
                        }else if (returndata.compositeEntities[i].children[0].type == "Test"){
                            test++;
                        }else if (returndata.compositeEntities[i].children[0].type == "Inspect"){
                            inspect++;
                        }
                    }
                }else if (returndata.compositeEntities[i].parentType == "Equipment"){
                    if(countE == 0){
                        if(returndata.compositeEntities[i].children.length != 0){
                            equipment += returndata.compositeEntities[i].children[0].type
                        countE++;
                        }
                    }else{
                        if(returndata.compositeEntities[i].children.length != 0){
                            equipment += ", " + returndata.compositeEntities[i].children[0].type
                        }
                    }
                    if(returndata.compositeEntities[i].children.length != 0){
                        if (returndata.compositeEntities[i].children[0].type == "Panel"){
                            panel++;
                        }else if (returndata.compositeEntities[i].children[0].type == "Lamp"){
                            lamp++;
                        }else if (returndata.compositeEntities[i].children[0].type == "Misc"){
                            misc++;
                        }
                    }
                }
            }
            // self.data[count].RepairProcessDone = process;
            // self.data[count].RepairCount = repair;
            // self.data[count].ReworkCount = rework;
            // self.data[count].ReplaceCount = replace;
            // self.data[count].TestCount = test;
            // self.data[count].InspectCount = inspect;
            // self.data[count].EquipmentRepaired = equipment;
            // self.data[count].PanelCount = panel;
            // self.data[count].LampCount = lamp;
            // self.data[count].MiscCount = misc;
            // console.log(self.data[count])
        }
        self.data[count].RepairProcessDone = process;
        self.data[count].RepairCount = repair;
        self.data[count].ReworkCount = rework;
        self.data[count].ReplaceCount = replace;
        self.data[count].TestCount = test;
        self.data[count].InspectCount = inspect;
        self.data[count].EquipmentRepaired = equipment;
        self.data[count].PanelCount = panel;
        self.data[count].LampCount = lamp;
        self.data[count].MiscCount = misc;
        console.log(self.data[count])

        if (count + 1 < self.data.length) {
            count++;
            self._processLuisEntity();
        } else {
            // return self.data;
            this.mongoClient = new mongoClient ({
                url: "mongodb://themrolab:password@ds044679.mlab.com:44679/repair_info",
                data: self.data
            });
            this.mongoClient._storeData()
        }
    })
}

module.exports = luisClient;
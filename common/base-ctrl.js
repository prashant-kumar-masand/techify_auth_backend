
var ObjectId = require('mongoose').Types.ObjectId;

class Base {

    constructor() {
    }

    getList(domainName, conditions, callback) {
        domain[domainName].aggregate(conditions, (err, objects) => {
            callback(err, objects);
        });
    }

    findRecords(domainName, conidtion, callback) {
        domain[domainName].find(conidtion, (err, result) => {
            callback(err, result);
        });
    }

    findARecord(domainName, conidtion,project, callback) {
        domain[domainName].find(conidtion,project, (err, result) => {
            callback(err, result);
        });
    }

    findAndUpdateRecord(domainName, condition, updateObject, callback) {
        domain[domainName].findOneAndUpdate(condition, {
            $set: updateObject
        }, {
            new: true
        }).exec((err, result) => {
            callback(err, result);
        })
    }

}

module.exports = Base;

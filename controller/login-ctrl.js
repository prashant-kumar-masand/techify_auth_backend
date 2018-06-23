
var Base = require('../common/base-ctrl')
var ObjectId = require('mongoose').Types.ObjectId;


class Login extends Base {

    constructor() {
        super()
    }
    login(req, res) {
        console.log('try to login', req.body)
        res.render('success', { title: 'Success' });
    }


}

module.exports = new Login();

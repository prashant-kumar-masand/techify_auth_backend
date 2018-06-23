
var Base = require('../common/base-ctrl')
var async = require('async');
var ObjectId = require('mongoose').Types.ObjectId;


class Signup extends Base {

    constructor() {
        super()
    }
    signup(req, res) {
        console.log('try to Signup', req.body)
        let reqbody = req.body;
        console.log('creating a new user')

        domain.User.findOne({
            email: reqbody.email
        }, function (err, user) {
            if (err) {
                console.log("Error in find user");
                commonModule.commonResponseHandler(res, err, "error", "310", true)
            }
            if (!user) {
                console.log('creating a new user')
                var newUser = new domain.User({
                    email: reqbody.email,
                    password: commonModule.passwordEncryption(reqbody.password, config.salt),
                    role: reqbody.role,
                    name: reqbody.name

                })
                newUser.save(function (err, newUser) {
                    console.log("new user created", newUser);
                    commonModule.commonResponseHandler(res, newUser, "user created successfully", "200", false)
                })
            } else {
                console.log("super admin already exist")
                commonModule.commonResponseHandler(res, { exist: true }, "error", "310", true)
            }
        })

    }

    login(req, res) {
        var status = commonModule.validateRequestBody(req, res, ['email', 'password'])
        console.log("status" + status)
        if (status) {
            var encryptedPassword = commonModule.passwordEncryption(req.body.password, config.salt);
            async.waterfall([
                (callback) => {
                    this.checkLoginUserExist(req.body.email, encryptedPassword, res, callback)
                },
                (adminObject, callback) => {
                    this.generateAccessToken(adminObject, res, callback)
                }
            ], (err, result) => {
                // console.log("result", result)
                userObject = result.adminObject;
                commonModule.commonResponseHandler(res, result, adminString.login_success_msg, "200", false)
            })
        }
    }
    checkLoginUserExist(email, password, res, callback) {
        domain.User.findOne({
            email: email,
            password: password
        }).lean().exec(function (err, adminObject) {
            if (err) {
                commonModule.commonResponseHandler(res, err, adminString.internal_server_error, "", true)
                return;
            }
            if (adminObject) {
                callback(null, adminObject)

            } else {
                //Invalid Username and password
                commonModule.commonResponseHandler(res, {}, adminString.invalid_username_password_msg, "200", true)
            }
        })
    }
    generateAccessToken(adminObject, res, callback) {
        console.log("Control in generate access token")
        var accessToken = uuid.v1();
        domain.User.findOneAndUpdate({
            _id: adminObject._id
        }, {
                $set: {
                    accessToken: accessToken,
                }
            }, {
                new: true
            },
            function (err, dt1) {
                if (err) {
                    commonModule.commonResponseHandler(res, err, adminString.internal_server_error, "", true)
                    return
                }
                console.log("access token" + accessToken)
                callback(null, {
                    adminObject: adminObject,
                    accessToken: accessToken
                })
            })
    }

    /* 
    auth-token required
    */
    logout(req, res) {
        console.log("Control in the logout API", req.loginUser);
        var bearerHeader = req.headers["auth-token"];
        if (bearerHeader) {
            domain.User.findOneAndUpdate({
                accessToken: bearerHeader
            }, {
                    $set: {
                        accessToken: uuid.v1()
                    }
                }, function (err, adminObject) {
                    if (err) {
                        commonModule.commonResponseHandler(res, err, adminString.internal_server_error,"", true)
                        return;
                    }
                    if (adminObject) {
                        commonModule.commonResponseHandler(res, {}, adminString.logout_success_msg, "200", false)
                    } else {
                        commonModule.commonResponseHandler(res, {}, adminString.unauthorized_msg, "401", true)
                    }
                })
        }
    }


    getUserList(req, res) {
        console.log(userObject)
        if (userObject && userObject.role == '2') {

            this.findARecord('User', { email: userObject.email }, { name: 1, email: 1, role: 1, accessToken:1 }, (err, result) => {
                commonModule.commonResponseHandler(res, result, adminString.user_list_msg, "200", false)
            })
        } else if (userObject && userObject.role == '1') {

            this.findARecord('User', {}, (err, result) => {
                commonModule.commonResponseHandler(res, result, adminString.user_list_msg, "200", false)
            })
        } else {
            console.log('error in fetching the users list')
            commonModule.commonResponseHandler(res, result, adminString.notexists, "310", true)
        }
    }



}

module.exports = new Signup();
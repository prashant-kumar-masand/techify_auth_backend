
var winston = require('winston');


exports.passwordEncryption = function (password, salt) {
    encryptedPassword = crypto.createHmac('sha1', salt).update(password.toString()).digest('hex')
    console.log(encryptedPassword)
    return encryptedPassword
}

var logger = new(winston.Logger)({
    transports: [
        new(winston.transports.Console)({
            handleExceptions: true,
            json: true
        }),
        new(winston.transports.File)({
            filename: 'seedInfo.log',
            json: true
        })
    ],
    exitOnError: false
});

exports.logger = logger;

//Common response handler in application
var commonResponseHandler = function (res, result, message, statusCode, isError) {
    var date = new Date();
    res.status(statusCode||'205')
    res.send({
        error: isError,
        result: result,
        message: message,
        extendedMessage: "",
        timeStamp: date.getTime(),
        statusCode: statusCode||'205'
    });
}

exports.commonResponseHandler = commonResponseHandler;

var validateRequestBody = function (req, res, paramsArray) {
    var status = true;
    for (var i = 0; i < paramsArray.length; i++) {
        if (!req.body[paramsArray[i]] || (req.body[paramsArray[i]] === '')) {
            console.log("Missing param")
            commonResponseHandler(res, {}, adminString.missing_params_msg,'300', true)
            status = false;
            break;
        }
    }
    return status;
}

exports.validateRequestBody = validateRequestBody;

//Admin authentication middleware
exports.adminAuthenticationMiddleware = function (req, res, next) {
    var bearerHeader = req.headers["auth-token"];
    if (!bearerHeader) {
        commonResponseHandler(res, {}, adminString.unauthorized_msg, adminString.unauthorized_code, true)
    } else {
        domain.Admin.findOne({
            accessToken: bearerHeader,
            status: 1
        }).lean().exec(function (err, adminObject) {
            if (err) {
                res.send(err)
            } else if (adminObject == null) {
                commonResponseHandler(res, {}, adminString.unauthorized_msg, adminString.unauthorized_code, true)
            } else {
            
                req.loginUser = adminObject;
                next();
            }
        })
    }
}


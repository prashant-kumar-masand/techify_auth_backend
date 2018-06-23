var express = require('express');
var router = express.Router();
var userCtrl = require('../controller/user-ctrl');
router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin,auth-token, X-Requested-With, Content-Type, Accept");
  console.log('--------------------------------request Details----------------------------------------', req.originalUrl);
  console.log('auth-token', req.headers['auth-token']);
  console.log('authorization', req.headers['authorization']);
  console.log('user-agent', req.headers['user-agent']);
  console.log('-----------------------------------------ENDS------------------------------------------');
  next();
});

/* GET home page. */
router.post('/signup', function(req, res) {
  userCtrl.signup(req,res);
});

router.post('/login', function(req, res) {
 userCtrl.login(req,res);
});

router.post('/logout', function(req, res) {
  userCtrl.logout(req,res);
 });

router.get('/dashboard/home', function(req, res) {
  userCtrl.getUserList(req,res);
});
module.exports = router;

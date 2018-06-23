/**
 * Add domain name of all models to the global object as an object named "domain"
 */
console.log('inside domain')

var domain = {}

domain.User = require('../model/user');

module.exports = domain;

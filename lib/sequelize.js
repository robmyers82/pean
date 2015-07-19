var Sequelize = require('sequelize');

var sequelize = new Sequelize('postgres://user@localhost/db');

module.exports = sequelize;
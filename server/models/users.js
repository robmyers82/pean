var Sequelize = require('sequelize');
var sequelize = require('../../lib/sequelize');

var User = sequelize.define('users', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
  	name: Sequelize.STRING,
  	email: Sequelize.STRING,
  	password: Sequelize.STRING
});

// sequelize.sync().then(function() {
//   return User.create({
//     name: 'Rob',
//     email: 'rob@rob.com',
//     password: 'rob',
//   }, {
//   	fields: ['name', 'email', 'password', 'createdAt', 'updatedAt']
//   });
// }).then(function(jane) {
//   console.log(jane.get({
//     plain: true
//   }))
// });

module.exports = User;
const moment = require('moment');
const paginate = require('handlebars-paginate');

module.exports = {
	checkEqual:  function (arg1, arg2) {
		return arg1 === arg2
	},
	formatDate: function (date, format) {
		return moment(date).format(format);
	},
	paginate: paginate,
}

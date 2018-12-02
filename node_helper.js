const NodeHelper = require("node_helper");
const aoc = require("./helpers/aoc");

module.exports = NodeHelper.create({

	// Override start method.
	start: function() {
		console.log("Starting node helper for: " + this.name);
	},

	socketNotificationReceived: function (notification, payload) {
		if (notification === "FETCH_DATA") {
			this.fetchData(payload);
		}
	},

	fetchData: function(config) {
		const self = this;
		aoc.fetchData(config, function(data) {
			self.sendSocketNotification("DATA_FETCHED", data);
		});
	}
});
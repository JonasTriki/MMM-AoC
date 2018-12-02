const request = require("request");

const AoC = {
	filterData: function(dataJson) {
		const participants = Object.keys(dataJson.members)
			.map(function(key) {
				const participant = dataJson.members[key];
				const days = participant.completion_day_level;
				const fixedDays = {};
				Object.keys(days)
					.forEach(function(day) {
						fixedDays[day] = Object.keys(days[day]).length;
					});

				return {
					name: participant.name,
					score: participant.local_score,
					days: fixedDays
				}
			});
		participants.sort(function(a, b) { return b.score - a.score; });
		console.log(participants);
		return participants;
	},

	fetchData: function({year, leaderboardId, sessionCookie}, cb) {
		const self = this;
		const leaderboardUrl = "https://adventofcode.com/" + year + "/leaderboard/private/view/" + leaderboardId + ".json";

		// Send GET-request to AoC with the sessioncookie set.
		request({url: leaderboardUrl, method: "GET", headers: {"Cookie": "session=" + sessionCookie}}, function(err, resp, body) {
			if (err) {
				console.log("FETCH_DATA_ERROR", err);
				cb(null);
				return;
			}
			cb(self.filterData(JSON.parse(body)));
		});
	}
}

module.exports = AoC;
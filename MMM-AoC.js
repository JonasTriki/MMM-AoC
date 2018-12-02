Module.register("MMM-AoC", {

	defaults: {
		year: 2018, // What AoC year.
		updateInterval: 60000 // How often we would call the API's in milliseconds. (Default 60 seconds)
	},

	getStyles: function () {
		return ["style.css"];
	},

	getTranslations: function() {
		return {
			en: "translations/en.json",
			nb: "translations/nb.json"
		}
	},

	start: function() {

		// Request data every {updateInterval} ms.
		const self = this;
		this.requestData();

		this.timer = setInterval(function() {
			self.requestData();
		}, this.config.updateInterval);
	},

	createStarSpan: function(starClassName) {
		const starSpan = document.createElement("span");
		starSpan.className = "privboard-star-" + starClassName;
		starSpan.innerHTML = "*";
		return starSpan;
	},

	participantRow: function(i) {
		const data = this.fetchedData[i];
		const row = document.createElement("div");
		row.className = "privboard-row";

		// First row position
		const pos = document.createElement("span");
		pos.className = "privboard-position";
		pos.innerHTML = ((i + 1) + ")").padStart(4);
		row.appendChild(pos);

		// Then acc score
		row.innerHTML += ("" + data.score).padStart(5) + " ";

		// Then stars
		const today = (new Date()).getDate();
		for (let day = 0; day < 25; day++) {
			let starClassName = "locked";
			const dayStars = data.days[day + 1];
			if (dayStars === 1) {
				starClassName = "firstonly";
			} else if (dayStars === 2) {
				starClassName = "both";
			} else {

				// Check previous if we have done it
				if (data.days[day] && day < today) {
					starClassName = "unlocked";
				}
			}
			const starSpan = document.createElement("span");
			starSpan.className = "privboard-star-" + starClassName;
			starSpan.innerHTML = "*";
			row.appendChild(starSpan);
		}

		// Then name
		const name = document.createElement("span");
		name.className = "privboard-name";
		name.innerHTML = data.name;
		row.appendChild(name);

		return row;
	},

	getDom: function() {
		const wrapper = document.createElement("div");
		wrapper.className = "wrapper";

		if (this.fetchedData) {

			// Banner image
			const banner = document.createElement("img");
			banner.src = this.getImage("banner");
			banner.className = "banner";
			wrapper.appendChild(banner);

			// Top numbers
			const top = document.createElement("div");
			top.className = "privboard-row";

			const days = document.createElement("div");
			days.className = "privboard-days";

			// Add left padding
			for (let i = 0; i < 10; i++) {
				const padSpan = document.createElement("span");
				padSpan.innerHTML = " ";
				days.appendChild(padSpan);
			}

			const today = (new Date()).getDate();
			for(let day = 1; day <= 25; day++) {
				const lower = day % 10;
				const upper = Math.floor(day / 10);
				const daySpan = document.createElement("span");
				if (today >= day) {
					daySpan.className = "passed";
				}

				daySpan.innerHTML = upper > 0 ? (upper + "<br>" + lower) : lower;
				days.appendChild(daySpan);
			}
			top.append(days);
			wrapper.appendChild(top);

			// Append all participants
			for (let i = 0; i < this.fetchedData.length; i++) {
				wrapper.appendChild(this.participantRow(i));
			}
		} else {
			if (this.fetchedData === undefined) {
				wrapper.innerHTML = this.translate("LOADING");
			} else {
				wrapper.innerHTML = this.translate("FETCH_DATA_ERROR");
			}
		}
		return wrapper;
	},

	getImage: function(name) {
		return "/modules/MMM-AoC/img/" + name + ".png";
	},

	requestData: function() {
		console.log(this.translate("LOADING") + ": " + this.name);
		this.sendSocketNotification("FETCH_DATA", this.config);
	},

	socketNotificationReceived: function(notification, payload) {
		this.fetchedData = notification === "DATA_FETCHED" ? payload : null;
		this.updateDom();
	}
});

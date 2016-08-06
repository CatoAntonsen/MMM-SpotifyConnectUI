'use strict';

/* Magic Mirror
 * Module: SpotifyConnectUI
 *
 * By Cato Antonsen
 * MIT Licensed.
 */

var NodeHelper = require('node_helper');
var http = require('http');

module.exports = NodeHelper.create({
    start: function () {
        this.started = false;
        this.config = null;
		this.spotifyData = null;
		this.spotifyRemoteName = null;
    },

	socketNotificationReceived: function (notification, payload) {
		var self = this;
        console.log("[" + self.name + "] Notification received: " + notification);
        if (notification === 'CONFIG' && this.started === false) {
            this.config = payload;
            this.started = true;

			self.startSpotifyPolling();
		}
    },
	
	startSpotifyPolling: function() {
		var self = this;
		
		// Get name of Spotify Connect
		self.getJson(self.config.Protocol + "://" + self.config.Host + ":" + self.config.Port + self.config.RemoteName)
			.then(function(data) {
				self.spotifyRemoteName = data.remoteName;
				console.log("[" + self.name + "] Remote name is " + self.spotifyRemoteName);
				
				// Loop for getting data from Spotify Connect
				setInterval(function() {
					self.getSpotifyData();
				}, 2500);

			})
			.catch((err) => console.error("[" + self.name + "] " + err));
	},
	
    getSpotifyData: function() {
		var self = this;

		self.getJson(self.config.Protocol + "://" + self.config.Host + ":" + self.config.Port + self.config.StatusApi)
			.then(function(statusData) {
				if (statusData.active) {
					self.getJson(self.config.Protocol + "://" + self.config.Host + ":" + self.config.Port + self.config.MetadataApi)
						.then(function(metaData) {
							var currentSpotifyData = { remoteName: self.spotifyRemoteName, status: statusData, meta: metaData };
							
							if (self.spotifyData == null ||
								currentSpotifyData.status.active != self.spotifyData.status.active ||
								currentSpotifyData.status.playing != self.spotifyData.status.playing ||
								currentSpotifyData.meta.track_uri != self.spotifyData.meta.track_uri)
							{
								self.spotifyData = currentSpotifyData;
								self.refreshSpotifyData(currentSpotifyData);
							}
						})
						.catch((err) => console.error("[" + self.name + "] " + err));
				} else {
					var currentSpotifyData = { remoteName: self.spotifyRemoteName, status: statusData};
					
					if (self.spotifyData == null ||
						currentSpotifyData.status.active != self.spotifyData.status.active ||
						currentSpotifyData.status.playing != self.spotifyData.status.playing) 
					{
						self.spotifyData = currentSpotifyData;
						self.refreshSpotifyData(currentSpotifyData);
					}
				}
			})
			.catch((err) => console.error("[" + self.name + "] " + err));
	},

	refreshSpotifyData: function(data) {
		var self = this;

		if (data.meta != null) {
			var cover_uri = self.config.ImageUrlApi + data.meta.cover_uri;
			var options = {method: 'GET', host: self.config.Host, port: self.config.Port, path: cover_uri};
			var req = http.get(options, function(res) {
				data.meta.cover_uri = res.headers["location"];
				self.sendSocketNotification("SpotifyConnectUI", data);
			});
		} else {
			self.sendSocketNotification("SpotifyConnectUI", data);	
		}
	},
	
	// Borrowed parts from https://www.tomas-dvorak.cz/posts/nodejs-request-without-dependencies/
	getJson:  function(url) {
		return new Promise((resolve, reject) => {
			const request = http.get(url, (response) => {
				if (response.statusCode < 200 || response.statusCode > 299) {
					reject(new Error('Failed to load page, status code: ' + response.statusCode));
				}
				const body = [];
				response.on('data', (chunk) => body.push(chunk));
				response.on('end', () => resolve(JSON.parse(body.join(''))));
			});
			request.on('error', (err) => reject(err))
		})
	},
});
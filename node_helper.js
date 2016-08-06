'use strict';

/* Magic Mirror
 * Module: SpotifyConnectWebUI
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
		this.lastTrack_uri = null;
    },

    getSpotifyMetadata: function() {
		var self = this;

		var url = self.config.Protocol + "://" + self.config.Host + ":" + self.config.Port + self.config.MetadataApi;

		http.get(url, function(res){
			var body = '';

			res.on('data', function(chunk){
				body += chunk;
			});

			res.on('end', function(){
				var data = JSON.parse(body);
				if (data.track_uri != self.lastTrack_uri) {
					self.refreshSpotifyData(data);
				}
			});
		}).on('error', function(e){
				console.log("Got an error: ", e);
		});
	},

	refreshSpotifyData: function(data) {
		var self = this;

		var cover_uri = self.config.ImageUrlApi + data.cover_uri;
		var options = {method: 'GET', host: self.config.Host, port: self.config.Port, path: cover_uri};
		var req = http.get(options, function(res) {
			data.cover_uri = res.headers["location"];
			this.lastTrack_uri = data.track_uri;
			self.sendSocketNotification("SpotifyConnectWebUI", data);
		});
	},

    socketNotificationReceived: function (notification, payload) {
		var self = this;
        console.log("[" + this.name + "] Notification received: " + notification);
        if (notification === 'CONFIG' && this.started === false) {
            this.config = payload;
            this.started = true;

			setInterval(function() {
				self.getSpotifyMetadata();
			}, 2500);
		}
    }
});
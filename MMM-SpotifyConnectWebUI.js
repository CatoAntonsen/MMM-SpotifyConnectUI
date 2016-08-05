/* global Module */

/* Magic Mirror
 * Module: SpotifyConnectWebUI
 *
 * By Cato Antonsen
 * MIT Licensed.
 */
 

Module.register("MMM-SpotifyConnectWebUI",{

	defaults: {
		Protocol: "http",
		Host: "localhost",
		Port: 4000,
		MetadataApi: "/api/info/metadata",
		ImageUrlApi: "/api/info/image_url/"
	},

	start: function() {
		this.spotifyData = null;
		Log.info('Starting module: ' + this.name);
		this.sendSocketNotification('CONFIG', this.config);
	},

	getDom: function() {
		var wrapper = document.createElement("div");
		wrapper.className = "align-right thin bright";

		if (this.spotifyData != null) {
			var img = document.createElement("img");
			img.setAttribute("src", this.spotifyData.cover_uri);
			
			var track = document.createElement("div");
			track.className = "bold";
			var trackName = document.createTextNode(this.spotifyData.track_name);
			track.appendChild(trackName);
			
			var artist = document.createElement("div");
			var artistName = document.createTextNode(this.spotifyData.artist_name);
			artist.appendChild(artistName);
			
			wrapper.appendChild(img);
			wrapper.appendChild(track);
			wrapper.appendChild(artist);
		}

		return wrapper;
	},
	
	socketNotificationReceived: function(notification, payload) {
		if (notification === "SpotifyConnectWebUI"){
			this.spotifyData = payload;
			this.updateDom();
		}
	}
});

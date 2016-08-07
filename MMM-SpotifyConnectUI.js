/* global Module */

/* Magic Mirror
 * Module: SpotifyConnectUI
 *
 * By Cato Antonsen
 * MIT Licensed.
 */
 

Module.register("MMM-SpotifyConnectUI",{

	defaults: {
		Protocol: "http",
		Host: "localhost",
		Port: 4000,
		MetadataApi: "/api/info/metadata",
		StatusApi: "/api/info/status",
		RemoteName: "/api/info/display_name",
		ImageUrlApi: "/api/info/image_url/"
	},

	start: function() {
		this.spotifyData = null;
		Log.info('Starting module: ' + this.name);
		this.sendSocketNotification('CONFIG', this.config);
	},

	getDom: function() {
		var wrapper = document.createElement("div");
		wrapper.className = "spotifyConnectWrapper small"; // align-right thin bright

		if (this.spotifyData != null) {
			if (this.spotifyData.status.active) {
				if (this.spotifyData.status.playing) {
					var img = document.createElement("img");
					img.setAttribute("src", this.spotifyData.meta.cover_uri);
					
					var track = document.createElement("div");
					track.className = "title bright";
					var trackName = document.createTextNode(this.spotifyData.meta.track_name);
					track.appendChild(trackName);
					
					var artist = document.createElement("div");
					artist.className = "time light";
					var artistName = document.createTextNode(this.spotifyData.meta.artist_name);
					artist.appendChild(artistName);
					
					wrapper.appendChild(img);
					wrapper.appendChild(track);
					wrapper.appendChild(artist);
				} else {
					var message = document.createTextNode("PAUSED");
					wrapper.appendChild(message);
				}
			} 
			else {
				var message = document.createTextNode("Connect Spotify to " + this.spotifyData.remoteName);
				wrapper.appendChild(message);
			}
		} 
		
		return wrapper;
	},
	
	getStyles: function() {
		return [
			'custom.css'
		]
	},
	
	socketNotificationReceived: function(notification, payload) {
		if (notification === "SpotifyConnectUI"){
			this.spotifyData = payload;
			this.updateDom(2000);
		}
	}
});

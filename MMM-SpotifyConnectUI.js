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
		wrapper.className = "spotifyWrapper small"; // align-right thin bright

		if (this.spotifyData != null) {
			// Image wrapper
			var imgWrapper = document.createElement("div");
			imgWrapper.className = "spotifyImageWrapper";

			if (this.spotifyData.status.active) {
				// Cover image
				var coverImg = document.createElement("img");
				coverImg.setAttribute("src", this.spotifyData.meta.cover_uri);

				// Show pause-button?
				if (this.spotifyData.status.playing) {
					imgWrapper.appendChild(coverImg);
				} else {
					coverImg.style.opacity = "0.25";
					imgWrapper.appendChild(coverImg);

					var pauseImg = document.createElement("img");
					pauseImg.src = this.file("images/music-pause-button-pair-of-lines.png");
					pauseImg.className = "floating";
					imgWrapper.appendChild(pauseImg);
				}

				// Track name
				var track = document.createElement("div");
				track.className = "title bright";
				var trackName = document.createTextNode(this.spotifyData.meta.track_name);
				track.appendChild(trackName);
				
				// Artist name
				var artist = document.createElement("div");
				artist.className = "time light";
				var artistName = document.createTextNode(this.spotifyData.meta.artist_name);
				artist.appendChild(artistName);
				
				// Add elements
				wrapper.appendChild(imgWrapper);
				wrapper.appendChild(track);
				wrapper.appendChild(artist);
			} 
			else {
				// Image
				var connectImg = document.createElement("img");
				connectImg.src = this.file("images/Spotify_Icon_RGB_Black.png");
				connectImg.className = "spotifyMissingConnectionImage";

				// Message
				var message = document.createElement("div");
				message.className = "spotifyMissingConnectionMessage floating light xsmall dimmed";

				var remoteName = document.createTextNode(this.spotifyData.remoteName);
				remoteName.className = " ";
				message.appendChild(remoteName);

				// Add elements
				imgWrapper.appendChild(connectImg);
				imgWrapper.appendChild(message);
				wrapper.appendChild(imgWrapper);
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

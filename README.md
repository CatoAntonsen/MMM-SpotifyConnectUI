# MagicMirror Module: MMM-SpotifyConnectWeb
The 'MMM-SpotifyConnectWeb' module is for displaying cover, artist and track-information from a version of a Spotify Connect client for made available by Fornoth on GitHub: https://github.com/Fornoth/spotify-connect-web. 

![Screenshot of the module](https://github.com/CatoAntonsen/MMM-SpotifyConnectWebUI/blob/master/Example1.png "Screenshot of the module #2")

The current version of this module is by far finished, just the first working proof-of-concept. 

## Prerequisites: Spotify-Connect-Web
You need to have Spotify-Connect-Web installed and a **Spotify Premium subscription** for this module to work.

Detailed instructions you find [here](https://github.com/Fornoth/spotify-connect-web/blob/0.0.3-alpha/README.md). Notice, he still refers to a 0.02-alpha version in the documentation, but there is a new 0.0.3-version out that I've been using.

I you are too lazy to read it all or you don't want to run it under Docker, I've summarized the steps below.
###Installing Spotify-Connect-Web
    pi@raspberrypi# cd ~
    pi@raspberrypi# wget https://github.com/Fornoth/spotify-connect-web/releases/download/0.0.3-alpha/spotify-connect-web_0.0.3-alpha.tar.gz   
    pi@raspberrypi# tar zxvf spotify-connect-web_0.0.3-alpha.tar.gz

You will find a new folder: ~/spotify-connect-web.

Now you need to register as developer at Spotify (free!) to be able to register and download a '**spotify_appkey.key**'. This file should be placed in the ~/spotify-connect-web folder.

### Running Spotify-Connect-Web
Start a new SSH terminal and run something like this:

    cd ~/spotify-connect-web
    ./spotify-connect-web -n MAGICMIRROR -o plughw:CARD=ALSA,DEV=1 

-n is for the name Spotify Connect will broadcast itself as.
-o Is for the output device. I'm using HDMI. It might or might not work for you. Go Google! ;-)

When it runs successfully, you have to go to http://localhost:4000 on the RPi and to a first time login.

TODO: [Run this as a service](https://discourse.osmc.tv/t/howto-setup-a-spotify-connect-web-server-on-a-raspberry-pi-with-osmc/15818)
#Installation of the module

In your terminal, go to your MagicMirror's Module folder:

    cd ~/MagicMirror/modules

Clone this repository:

    git clone https://github.com/CatoAntonsen/MMM-SpotifyConnectWebUI.git

Configure the module in your config.js file.
## Using the module
To use this module, add it to the modules array in the `config/config.js` file:

    modules: [
    	{
    		module: 'MMM-SpotifyConnectWebUI',
    		position: 'bottom_right',
    		config: {
    			// These are probably no sence changing yourself:
    			Protocol: "http",
    			Host: "localhost",
    			Port: 4000,
    			MetadataApi: "/api/info/metadata",
    			ImageUrlApi: "/api/info/image_url/"
    		}
    	}
    ]

## Configuration options

The following properties can be configured:


<table width="100%">
	<!-- why, markdown... -->
	<thead>
		<tr>
			<th>Option</th>
			<th width="100%">Description</th>
		</tr>
	<thead>
	<tbody>
		<tr>
			<td><code>Protocol</code></td>
			<td>What protocol SCW uses.<br>
				<br><b>Default value:</b> <code>'http'</code>
			</td>
		</tr>
		<tr>
			<td><code>Host</code></td>
			<td>What hostname SCW is available on.<br>
				<br><b>Default value:</b> <code>'localhost'</code>
			</td>
		</tr>
		<tr>
			<td><code>Port</code></td>
			<td>What port SCW uses.<br>
				<br><b>Default value:</b> <code>'4000'</code>
			</td>
		</tr>
		<tr>
			<td><code>MetadataApi</code></td>
			<td>What API SCW uses for getting metadata of current playing song.<br>
				<br><b>Default value:</b> <code>'/api/info/metadata'</code>
			</td>
		</tr>
		<tr>
			<td><code>ImageUrlApi</code></td>
			<td>What API SCW uses for getting the correct cover photo image url.<br>
				<br><b>Default value:</b> <code>'/api/info/image_url/'</code>
			</td>
		</tr>
		
	</tbody>
</table>
##Future enhancements

 - Use API to check status of Spotify Connect (active?)
 - Add custom CSS to move the module to one of the (bottom) corners
 - More configuration options on what information you want to show and how
 - Find a better solution than polling the Spotify Connect webservice constantely


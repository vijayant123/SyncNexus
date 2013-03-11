// main.js functions

var playlist = new handlePlaylist;
var player = new handlePlayer;
var keys = new handleKeys;
var currItemID = -1;

function getVLC(name) {
	if (window.document[name]) {
		return window.document[name];
	}
	if (navigator.appName.indexOf("Microsoft Internet") == -1) {
		if (document.embeds && document.embeds[name])
			return document.embeds[name];
	} else// if (navigator.appName.indexOf("Microsoft Internet")!=-1)
	{
		return document.getElementById(name);
	}
}

function registerVLCEvent(event, handler) {
	var vlc = getVLC("vlc");
	if (vlc) {
		if (vlc.attachEvent) {
			// Microsoft
			vlc.attachEvent(event, handler);
		} else if (vlc.addEventListener) {
			// Mozilla: DOM level 2
			vlc.addEventListener(event, handler, false);
		} else {
			// DOM level 0
			vlc["on" + event] = handler;
		}
	}
}

function formatTime(timeVal) {
	if ( typeof timeVal != 'number')
		return "-:--:--";

	var timeHour = Math.round(timeVal / 1000);
	var timeSec = timeHour % 60;
	if (timeSec < 10)
		timeSec = '0' + timeSec;
	timeHour = (timeHour - timeSec) / 60;
	var timeMin = timeHour % 60;
	if (timeMin < 10)
		timeMin = '0' + timeMin;
	timeHour = (timeHour - timeMin) / 60;
	if (timeHour > 0)
		return timeHour + ":" + timeMin + ":" + timeSec;
	else
		return timeMin + ":" + timeSec;
}

function handlePlaylist() {

	this.processInput = function processInput(targetURL) {
		if (targetURL.length > 0) {
			targetURL = "file:///".concat(targetURL.substring(1, (targetURL.length - 1)));
			playlist.add(targetURL);
		} else
			return false;
	}
	this.add = function add(targetURL) {
		var handle = document.getElementById("playlist");
		var vlc = getVLC("vlc");
		if (vlc) {
			var options = [":rtsp-tcp"];
			var itemID = vlc.playlist.add(targetURL, "", options);
			vlc.playlist.playItem(itemID);
			var itemName = targetURL;
			itemID = random(4);
			currItemID = itemID;
			var html = '<li class="playlistItem" onclick="playlist.togglePlayback(' + itemID + ')" title="' + itemName.substring(8) + '" id="playlistItem_' + itemID + '" ondblclick="playlist.clear(' + itemID + ')">' + itemName.substring(8).substring(itemName.length - 60) + '<br /><br /></li>';
			handle.innerHTML += (html);
		}
	}

	this.togglePlayback = function togglePlayback(itemID) {
		var vlc = getVLC("vlc");
		if (vlc) {
			if (itemID == currItemID)
				if (vlc.playlist.isPlaying)
					vlc.playlist.togglePause();
				else
					vlc.playlist.play();
			else {
				vlc.playlist.playItem($("#playlistItem_" + itemID).index());
				currItemID = itemID;
			}
		}
	}

	this.clear = function clear(itemID) {
		var handle = document.getElementById("playlist");
		var vlc = getVLC("vlc");
		if (vlc) {
			if (vlc.playlist.items.count > 0) {
				vlc.playlist.stop();
				if (itemID == -1) {
					vlc.playlist.items.clear();
					handle.innerHTML = '';
					return true;
				}
				vlc.playlist.items.remove($("#playlistItem_" + itemID).index());
				$("#playlistItem_" + itemID).remove();
			} else
				alert("Playlist is already empty !!!");

		}
	}
}

function handlePlayer() {
	this.speed = function speed(value) {
		var vlc = getVLC("vlc");
		if (vlc) {
			vlc.input.rate *= value;
			$("#speed").text("Speed : " + vlc.input.rate + "x");
		}
	}
	this.audioChannel = function audioChannel(value) {
		var vlc = getVLC("vlc");
		if (vlc) {
			vlc.audio.channel = parseInt(value);
		}
	}
	this.audioTrack = function audioTrack(value) {
		var vlc = getVLC("vlc");
		if (vlc) {
			vlc.audio.track += value;
			$("#track").text("Track # : " + vlc.audio.track + "  " + vlc.audio.description(vlc.audio.track));
		}
	}
	this.crop = function crop(value) {
		var vlc = getVLC("vlc");
		if (vlc) {
			vlc.video.aspectRatio = value;
			$("#crop").text("Aspect Ratio : " + value);
		}
	}
	this.subtitle = function subtitle(value) {
		var vlc = getVLC("vlc");
		if (vlc) {
			vlc.subtitle.track += value;
			$("#subtitle").text("Subtitle # : " + vlc.subtitle.track + " " + vlc.subtitle.description(vlc.subtitle.track));
		}
	}
	this.updateInfo = function updateInfo() {
		var vlc = getVLC("vlc");
		if (vlc) {
			if (vlc.playlist.isPlaying) {
				$("#info").text(formatTime(vlc.input.time) + " / " + formatTime(vlc.input.length));
			} else
				$("#info").text("-:--:-- / -:--:--")
		}
		info = setTimeout(function() {
			player.updateInfo();
		}, 500);
	}
}

window.onload = function() {
	Logger.show();
	log("Logger initialized.");
	var info = setTimeout(function() {
		player.updateInfo();
	}, 500);
	keypress.register_many(keys.combos);
	registerVLCEvent('MediaPlayerPaused', function() {
		if (!($("#hostKey").val().length < 5) && sync.interval > 1000) {
			sync.sendBroadcast();
		}
	});
	registerVLCEvent('MediaPlayerPlaying', function() {
		if (!($("#hostKey").val().length < 5) && sync.interval > 1000) {
			sync.sendBroadcast();
		}
	});
}
function handleKeys() {
	this.combos = [{
		'keys' : 'right',
		'is_exclusive' : true,
		'prevent_default' : true,
		'on_keyup' : function() {
			keys.seek(60000);
		}
	}, {
		'keys' : 'left',
		'is_exclusive' : true,
		'prevent_default' : true,
		'on_keyup' : function() {
			keys.seek(-60000);
		}
	}, {
		'keys' : 'up',
		'is_exclusive' : true,
		'prevent_default' : true,
		'on_keyup' : function() {
			keys.volume(10);
		}
	}, {
		'keys' : 'down',
		'is_exclusive' : true,
		'prevent_default' : true,
		'on_keyup' : function() {
			keys.volume(-10);
		}
	}, {
		'keys' : 'alt right',
		'is_exclusive' : true,
		'prevent_default' : true,
		'on_keyup' : function() {
			keys.seek(10000);
		}
	}, {
		'keys' : 'alt left',
		'is_exclusive' : true,
		'prevent_default' : true,
		'on_keyup' : function() {
			keys.seek(-10000);
		}
	}, {
		'keys' : 'alt up',
		'is_exclusive' : true,
		'prevent_default' : true,
		'on_keyup' : function() {
			keys.volume(5);
		}
	}, {
		'keys' : 'alt down',
		'is_exclusive' : true,
		'prevent_default' : true,
		'on_keyup' : function() {
			keys.volume(-5);
		}
	}, {
		'keys' : 'space',
		'is_exclusive' : true,
		'prevent_default' : true,
		'on_keyup' : function() {
			keys.togglePause();
		}
	}, {
		'keys' : 'm',
		'is_exclusive' : true,
		'prevent_default' : true,
		'on_keyup' : function() {
			keys.toggleMute();
		}
	}, {
		'keys' : 'n',
		'is_exclusive' : true,
		'prevent_default' : true,
		'on_keyup' : function() {
			keys.play(1);
		}
	}, {
		'keys' : 'p',
		'is_exclusive' : true,
		'prevent_default' : true,
		'on_keyup' : function() {
			keys.play(-1);
		}
	}, {
		'keys' : 'f',
		'is_exclusive' : true,
		'prevent_default' : true,
		'on_keyup' : function() {
			keys.toggleFullscreen();
		}
	}, {
		'keys' : 'alt',
		'is_exclusive' : true,
		'prevent_default' : true,
		'on_keyup' : function() {
			return true;
		}
	}];
	this.volume = function volume(value) {
		var vlc = getVLC("vlc");
		if (vlc) {
			vlc.audio.volume += value;
		}
	}
	this.seek = function seek(value) {
		var vlc = getVLC("vlc");
		if (vlc) {
			vlc.input.time += value;
		}
	}
	this.togglePause = function togglePause() {
		var vlc = getVLC("vlc");
		if (vlc) {
			vlc.playlist.togglePause();
		}
	}
	this.toggleMute = function toggleMute() {
		var vlc = getVLC("vlc");
		if (vlc) {
			vlc.audio.toggleMute();
		}
	}
	this.play = function play(value) {
		var vlc = getVLC("vlc");
		if (vlc) {
			if (value == 1)
				vlc.playlist.next();
			else
				vlc.playlist.prev();
		}
	}
	this.toggleFullscreen = function toggleFullscreen() {
		var vlc = getVLC("vlc");
		if (vlc) {
			vlc.video.toggleFullscreen();
		}
	}
}


/**
 * @author Vijayant Saini
 * If you wish to use or try this code
 * mail me at - "vijayant.saini123@yahoo.co.in"
 * just to inform me.
 */

//var iteration;
//var timer;
//var timeInterval;
//var client = 0;
// variable above this are obsolete

var sync = new handleSync;

function requester() {
	url = 'syncGET.php';
	$.ajax({
		type : 'POST', // type of request either Get or Post
		url : url, // Url of the page where to post data and receive response
		// data to be post
		success : function(data) {

			handler(data);
		} //function to be called on successful reply from server
	});
}

function sendRequest(interval) {
	iteration = setInterval(function() {
		requester()
	}, interval);
}

function syncer(interval) {
	if (interval == 0) {
		alert('Please select the sync time.');
		return false;
	}
	alert('Syncing playback every ' + interval / 1000 + ' seconds.')
	iteration = clearInterval(iteration);
	sendRequest(interval);
	timeInterval = interval;
}

function handler(data) {
	var a = data.split(':');
	var targetTime = parseInt(a[0]);
	var target = parseInt(a[1]);
	var time = Math.round((new Date()).getTime() / 1000);
	var timeOnTarget = (targetTime - time) * 1000;
	console.log(timeOnTarget);
	//	alert(timeOnTarget)
	if (timeOnTarget > 0 && timeOnTarget <= timeInterval) {
		timer = setTimeout(function() {
			executioner(target);
			console.log('target' + target);
		}, timeOnTarget);
	}
}

function executioner1(seek) {
	var vlc = getVLC('vlc');
	if (vlc) {
		vlc.input.time = seek;
		timer = clearTimeout(timer);
	}
}

function random(length) {
	chars = '123456789';
	//abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var result = '';
	for (var i = length; i > 0; --i)
		result += chars[Math.round(Math.random() * (chars.length - 1))];
	return result;
}

function setDisplay(divID, flag) {
	var element = document.getElementById(divID);
	if (flag) {
		element.style.display = "";
	} else {
		element.style.display = "none";
	}
}

function browse(url, callback) {
	$.ajax({
		url : url,
		success : function(data, status) {
			log(data);
			callback(data);
			log("Completed loading : " + url + " Status : " + status);
		},
		error : function(a, b, status) {
			log("Error loading : " + status);
		}
	});
}

function handleSync() {
	this.iteration
	this.interval
	this.timestamp
	this.vlcPos
	this.vlcState
	this.targetTime
	this.timeOnTarget
	this.syncIteration
	this.check = function check(key) {
		$("#clientConfirm").val(" Confirming... ");
		a = './server/check.php?key=' + key;
		browse(a, sync.checkConfirm);
	}
	this.checkConfirm = function(data) {
		if (data == 1) {
			$("#clientConfirm").val(" Confirmed ").attr('disabled', 'disabled');
			$("#clientKey").attr('readonly', 'readonly');
			$("#clientFrequency").removeAttr('disabled');
		} else {
			$("#clientConfirm").val(" " + data + " ");
		}
	}
	this.host = function host() {
		$("#hostKey").text("Loading...");
		browse('./server/host.php', sync.makeHost);
	}
	this.makeHost = function makeHost(data) {
		if (data.length < 5) {
			$("#hostKey").text("Some Error Occured. Reload The Page And Try Again.");
			return true;
		}
		$("#hostKey").text(data);
		$('input[onclick="sync.host()"]').attr('disabled', 'disabled');
		$("#hostFrequency").removeAttr('disabled');
	}
	this.setHostFrequency = function setHostFrequency(interval) {
		sync.iteration = clearTimeout(sync.iteration);
		sync.interval = interval;
		if (sync.interval == 0 || sync.interval < 1000) {
			alert('Please select a sync interval.');
			return false;
		}
		sync.startBroadcast();
	}
	this.startBroadcast = function startBroadcast() {
		sync.sendBroadcast();
		sync.iteration = setTimeout(function() {
			sync.sendBroadcast();
			sync.iteration = setTimeout(function() {
				sync.startBroadcast()
			}, sync.interval);
		}, sync.interval);
	}
	this.sendBroadcast = function sendBroadcast() {
		var vlc = getVLC("vlc");
		if (vlc) {
			if (!($("#hostKey").val().length < 5)) {
				sync.vlcState = vlc.input.state;
				if (sync.vlcState != 3 && sync.vlcState != 4) {
					log("VLC is idle. Skipping broadcast.");
					return false;
				}
				sync.vlcPos = parseInt(vlc.input.time) + parseInt(sync.interval);
				sync.timestamp = Math.round(ServerDate.getTime() / 1000) + parseInt(sync.interval / 1000);
				browse('./server/broadcast.php?hostKey=' + $("#hostKey").val() + '&timestamp=' + sync.timestamp + '&vlcPos=' + sync.vlcPos + '&vlcState=' + sync.vlcState, sync.hostBroadcast);
			} else {
				alert("Host Key is WRONG !!!\nReload the page and try again.");
				return false;
			}
		}

	}
	this.hostBroadcast = function hostBroadcast(data) {
		return true;
	}
	this.setClientFrequency = function setClientFrequency(interval) {
		sync.iteration = clearTimeout(sync.iteration);
		sync.interval = interval;
		if (sync.interval == 0 || sync.interval < 1000) {
			alert('Please select a sync interval.');
			return false;
		}
		sync.startSyncHost();
	}
	this.startSyncHost = function startSyncHost() {
		sync.syncHost();
		sync.iteration = setTimeout(function() {
			sync.syncHost();
			sync.iteration = setTimeout(function() {
				sync.startSyncHost()
			}, sync.interval);
		}, sync.interval);
	}
	this.syncHost = function syncHost() {
		var vlc = getVLC("vlc");
		if (vlc) {
			if (!($("#clientKey").val().length < 5)) {
				sync.timestamp = Math.round(ServerDate.getTime() / 1000);
				browse('./server/sync.php?clientKey=' + $("#clientKey").val() + '&timestamp=' + sync.timestamp, sync.syncer);
			} else {
				alert("Client Key is WRONG !!!\nCheck the key and try again.");
				return false;
			}
		}
	}
	this.syncer = function syncer(data) {
		if(data.length < 10){
			return false;
		}
		sync.syncIteration = clearTimeout(sync.syncIteration);
		var a = data.split(':');
		sync.targetTime = parseInt(a[0]);
		sync.vlcPos = parseInt(a[1]);
		sync.vlcState = parseInt(a[2])
		var time = Math.round(ServerDate.getTime() / 1000);
		sync.timeOnTarget = (sync.targetTime - time) * 1000;
		log('TIME-ON-TARGET : ' + sync.timeOnTarget);
		if (sync.timeOnTarget > 0 && sync.timeOnTarget <= sync.interval) {
			sync.syncIteration = setTimeout(function() {
				sync.executioner(sync.vlcPos, sync.vlcState);
			//	log('target : ' + sync.vlcPos);
			}, sync.timeOnTarget);
		}
	}
	this.executioner = function executioner(seek, state) {
		var vlc = getVLC("vlc");
		if (vlc) {
			if (seek - vlc.input.time > 100 || seek - vlc.input.time < -100) {
				vlc.input.time = seek;
				log('Seeking ' + seek);
			}
			if (state == 3) {
				if (!vlc.playlist.isPlaying)
					vlc.playlist.togglePause();
			} else {
				if (vlc.playlist.isPlaying)
					vlc.playlist.togglePause();
			}
		}
	}
}
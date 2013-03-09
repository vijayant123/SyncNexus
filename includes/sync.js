/**
 * @author Vijayant Saini
 * If you wish to use or try this code
 * mail me at - "vijayant.saini123@yahoo.co.in"
 * just to inform me.
 */

var iteration;
var timer;
var timeInterval;
var client = 0;
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

function executioner(seek) {
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
	this.check = function check(key) {
		$("#clientConfirm").val(" Confirming... ");
		a = './server/check.php?key=' + key;
		browse(a, sync.checkConfirm);
	}
	this.checkConfirm = function(data) {
		if (data == 1) {
			$("#clientConfirm").val(" Confirmed ").attr('disabled', 'true');
			$("#clientKey").attr('readonly', 'true');
		} else {
			$("#clientConfirm").val(" " + data + " ");
		}
	}
	this.host = function host() {
		$("#hostID").text("Loading...");
		browse('./server/host.php', sync.makeHost);
	}
	this.makeHost = function makeHost(data) {
		if (data.length < 5) {
			$("#hostID").text("Some Error Occured. Try Again.");
			return true;
		}
		$("#hostID").text(data);
		$('input[onclick="sync.host()"]').attr('disabled', 'true')
	}
}
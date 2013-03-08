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
var host = 0;

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

function randomString(length) {
	chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
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

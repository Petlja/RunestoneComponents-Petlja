function onPlayerStateChange(event) {
	let rb = new RunestoneBase();
	let videoTime = event.target.getCurrentTime();
	let data = {
		event: 'video',
		div_id: event.target.getIframe().id,
	};
	if (event.data == YT.PlayerState.PLAYING) {
		console.log('playing ' + event.target.getIframe().id);
		data.act = 'play:' + videoTime;
	} else if (event.data == YT.PlayerState.ENDED) {
		console.log('ended ' + event.target.getIframe().id);
		data.act = 'complete';
	} else if (event.data == YT.PlayerState.PAUSED) {
		console.log('paused at ' + videoTime);
		data.act = 'pause:' + videoTime;
	}
	rb.logBookEvent(data);
}

window.addEventListener('load',function () {
	var allVideos = document.getElementsByClassName('ytvideo');
	var allVideosCloser = document.getElementsByClassName('ytvideoclose');

	var toggleVideo = function (videoId) {
		var srcValue = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1';
		if ($('#modal-' + videoId).length != 0) {
			if ($('#modal-' + videoId).css('display') == 'none') {
				document.getElementById('YTmodal-' + videoId).innerHTML = "<iframe id='ytplayer' style='height: 90vh; width: 90vw;' src='" + srcValue + "' allowfullscreen></iframe>";
				document.getElementById('modal-' + videoId).setAttribute('style', 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(140, 140, 140, 0.3); z-index: 10000;');
			} else {
				document.getElementById('YTmodal-' + videoId).innerHTML = '';
				document.getElementById('modal-' + videoId).setAttribute('style', 'display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(140, 140, 140, 0.3); z-index: 10000;');
			}
		} else {
			if ($('#modal').css('display') == 'none') {
				document.getElementById('YTmodal').innerHTML = "<iframe id='ytplayer' style='height: 90vh; width: 90vw;' src='" + srcValue + "' allowfullscreen></iframe>";
				document.getElementById('modal').setAttribute('style', 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(140, 140, 140, 0.3); z-index: 10000;');
			} else {
				document.getElementById('YTmodal').innerHTML = '';
				document.getElementById('modal').setAttribute('style', 'display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(140, 140, 140, 0.3); z-index: 10000;');
			}
		}
	};
	if (allVideos.length > 0)
		Array.prototype.slice.call(allVideos).forEach(function (video) {
			var httpRequest = new XMLHttpRequest();
			url = 'https://petlja.org/api/video/validatevideoId/' + video.id;
			httpRequest.open('GET', url);
			httpRequest.onreadystatechange = function () {
				if (this.readyState == 4 && this.status == 200) {
					if (JSON.parse(this.response).errors?.length > 0) {
						var errorDiv = document.createElement('div');
						errorDiv.setAttribute('class', 'video-missing-error');
					errorDiv.innerHTML = 'Овај видео се тренутно не налази на петљином порталу';
					document.getElementById(video.id).parentNode.insertBefore(errorDiv, document.getElementById(video.id));
					}
				}
			};

			httpRequest.send();
			video.addEventListener('click', function () {
				toggleVideo(video.id);
			});
		});

	if (allVideosCloser.length > 0)
		Array.prototype.slice.call(allVideosCloser).forEach(function (video) {
			video.addEventListener('click', function () {
				toggleVideo(video.id.replace('modal-', ''));
			});
		});
});

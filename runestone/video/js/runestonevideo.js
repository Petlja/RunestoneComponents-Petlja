var currentVideoPlaying = [];

window.addEventListener('load',function () {
	var allVideos = document.getElementsByClassName('ytvideo');
	var allVideosCloser = document.getElementsByClassName('ytvideoclose');

	var toggleVideo = function (videoId) {
		var srcValue = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1';
		if ($('#modal-' + videoId).length != 0) {
			if ($('#modal-' + videoId).css('display') == 'none') {
				currentVideoPlaying.push(videoId);
				document.getElementById(videoId).style.display = 'none';
				document.getElementById('YTmodal-' + videoId).innerHTML = "<iframe id='ytplayer' style='height: 500px; width: 780px;' src='" + srcValue + "' allowfullscreen></iframe>";
				document.getElementById('modal-' + videoId).setAttribute('style','background-color: transparent; z-index: 10000;');
			} else {
				document.getElementById(videoId).style.display = '';
				document.getElementById('YTmodal-' + videoId).innerHTML = '';
				document.getElementById('modal-' + videoId).setAttribute('style', 'display: none; background-color: transparent; z-index: 10000;');
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
			video.addEventListener('click', function (e) {
				toggleVideo(video.id);
				e.stopPropagation();
			});
		});
	document.body.addEventListener("click", function(){
		for (var i=0; i<currentVideoPlaying.length;i++)
			toggleVideo(currentVideoPlaying[i]);
		currentVideoPlaying = [];
	})
});

var player;
var socket;
$(function() {
    socket = io();
    socket.on('files', function(files) {
        localStorage.setItem("files", files);
    });
    
	var video = document.getElementById('video');
	video.addEventListener('ended', showYearText, false);

	function showYearText() {
		$("#video").attr("src", "");
		$("#audio").attr("src", "");
		$(".row").css({
			"width": "auto",
			"height": "auto"
		});
		$(".yearText").show();
		$(".videoContainer").hide();
		$(".imageContainer").hide();
		$(".audioContainer").hide();
	}
	socket.on("controls", function(control) {
		var actions = {
			play: function() {
				video.play();
			},
			pause: function() {
				video.pause();
			},
			exit: showYearText
		};
		actions[control.action]();
	})

	socket.on("media", function(media) {

		$(".videoContainer").hide();
		$(".imageContainer").hide();
		$(".audioContainer").hide();
		$("#video").attr("src", "");
		$("#audio").attr("src", "");

		var display = {
			AUDIO: function() {
				$(".yearText").hide();
				$(".audioContainer")
					.show()
					.css({
						"width": "100%",
						"height": "100%",
						"content": "&nbsp;",
						"background": "url('" + media.image + "')",
						"background-size": "auto 100%",
						"background-repeat": "no-repeat",
						"background-position": "center"
					});
				$(".row").css({
					"width": "100%",
					"height": "100%"
				});
				$("#audio").attr("src", (media.url).replace("\\", "\\\\"));
			},

			VIDEO: function() {
				$(".yearText").hide();
				$(".videoContainer")
					.show();
				$(".row").css({
					"width": "100%",
					"height": "100%"
				});
				$("#video").attr("src", (media.url).replace("\\", "\\\\"));
			},

			IMAGE: function() {
				$(".yearText").hide();
				$(".row").css({
					"width": "100%",
					"height": "100%"
				});
				$(".imageContainer")
					.show()
					.css({
						"width": "100%",
						"height": "100%",
						"content": "&nbsp;",
						"background": "url('" + decodeURI(media.url) + "')",
						"background-size": "auto 100%",
						"background-repeat": "no-repeat",
						"background-position": "center"
					});
			}
		};
		display[media.type]();
	});
});
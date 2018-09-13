var express = require('express');
var router = express.Router();
var request = require("request");
var cheerio = require("cheerio");
var socket = require("../controllers/socket");
/* GET users listing. */
router.get('/:video', function(req, res, next) {
	var video = req.params.video;

	request(video, function(err, data, body) {
		debugger;
		$ = cheerio.load(body);
		var videoUrl = $("video").attr("src") || video;
		socket.io().emit("video", videoUrl);
		res.send({
			video: videoUrl
		});
	});
});

router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'Express',
		qr: "qr",
		ip: "ip"
	});
});

module.exports = router;
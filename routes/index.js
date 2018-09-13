var express = require('express');
var socket = require("../controllers/socket");
var Media = require("../controllers/media");
var router = express.Router();

router.get('/', function (req, res, next) {
  res.render('index', {
    yearText: '“Los que estén esperando en Jehová recobrarán el poder”\n     (Isaías 40:31).'
  });
});

router.get('/remoto', function (req, res, next) {
  res.render('remote', {title: 'Control Remoto'});
});
router.get('/getWatchtower', function (req, res, next) {
  Media.getWatchtower(JSON.parse(req.query.thisWeek)).then(function (response) { res.send(response) });
});
router.get('/getCurrentWeek', function (req, res, next) {
  Media.getCurrentWeek().then(function (response) { res.send(response) });
});
router.get('/getSongs', function (req, res, next) {
  Media.getSongs().then(function (response) { res.send(response) });
});
router.get('/getGuides', function (req, res, next) {
  Media.getGuides().then(function (response) { res.send(response) });
});
router.get('/getWeeks', function (req, res, next) {
  Media.getWeeks(req.query.monthUrl).then(function (response) { res.send(response) });
});
router.get('/getMedia', function (req, res, next) {
  Media.getMedia(req.query.weekUrl).then(function (response) { res.send(response) });
});
router.get('/download', function (req, res, next) {
  Media.download(JSON.parse(req.query.mediaObj)).then(function (response) { res.send(response) });
});


module.exports = router;
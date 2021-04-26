var express = require('express');
var socket = require("../controllers/socket");
var Media = require("../controllers/media");
var router = express.Router();

router.get('/', function (req, res, next) {
  res.render('index', {
    yearText: '“Su fuerza dependerá de que mantengan la calma y demuestren confianza”\n     (Isaias. 30:15).'
  });
});

router.get('/health', function (req, res, next) {
  
  res.send({ok:200});
});

router.get('/remoto', function (req, res, next) {
  //res.set('Cache-Control', 'public, max-age=31557600');
  res.render('remote', {title: 'Control Remoto'});
});
router.get('/getWatchtower', function (req, res, next) {
  //res.set('Cache-Control', 'public, max-age=31557600');
  Media.getWatchtower(JSON.parse(req.query.thisWeek)).then(function (response) { res.send(response) });
});
router.get('/getCurrentWeek', function (req, res, next) {
  //res.set('Cache-Control', 'public, max-age=31557600');
  Media.getCurrentWeek().then(function (response) { res.send(response) });
});
router.get('/getSongs', function (req, res, next) {
  //res.set('Cache-Control', 'public, max-age=31557600');
  Media.getSongs().then(function (response) { res.send(response) });
});
router.get('/getGuides', function (req, res, next) {
  //res.set('Cache-Control', 'public, max-age=31557600');
  Media.getGuides().then(function (response) { res.send(response) });
});
router.get('/getWeeks', function (req, res, next) {
  ////res.set('Cache-Control', 'public, max-age=31557600');
  Media.getWeeks(req.query.monthUrl).then(function (response) { res.send(response) });
});
router.get('/getMedia', function (req, res, next) {
  //res.set('Cache-Control', 'public, max-age=31557600');
  Media.getMedia(req.query.weekUrl).then(function (response) { res.send(response) });
});
router.get('/download', function (req, res, next) {
  //res.set('Cache-Control', 'public, max-age=31557600');
  Media.download(JSON.parse(req.query.mediaObj)).then(function (response) { res.send(response) });
});


module.exports = router;
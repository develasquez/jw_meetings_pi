var request = require('request');
var Promise = require('bluebird');
var cheerio = require('cheerio');
var path = require('path');
var fs = require('fs');
var https = require('https');
var _ = require("lodash");
var querystring = require("querystring");



var baseUrl = "https://wol.jw.org";
var guidesUrl = process.env.GUIDESURL;
var songsListUrl = "https://b.jw-cdn.org/apis/mediator/v1/categories/S/VODSJJMeetings?detailed=1&clientType=www";
var apiFinder = "https://data.jw-api.org/mediator/finder?item=sjjm_S_127_r720P.mp4";
var apiMedi = "https://data.jw-api.org/mediator/v1/media-items/S/";
var weekProgramUrl = "https://wol.jw.org/es/wol/dt/r4/lp-s/";



var songsList = [];
var Media = {
	files: [],
	saveFile: function (fileurl, localFilename) {
		return new Promise((resolve, reject) => {
			Media.files.push({
				fileurl: fileurl,
				localFilename: localFilename
			});
			resolve(Media.files);
		});
	},
	download: function (mediaObj) {
		return new Promise((resolve, reject) => {
			var extension = "";
			switch (mediaObj.type) {
				case "AUDIO":
					{
						extension = ".mp3";
					};
					break;
				case "IMAGE":
					{
						extension = ".jpeg";
					};
					break;
				case "VIDEO":
					{
						extension = ".mp4";
					};
					break;
				default:
					{
						extension = "";
					};
					break;
			}
			var dir = path.resolve(__dirname, "../public/media");

			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir);
			}
			var localFilename = path.resolve(`${dir}/${mediaObj.name.replace(/[^a-zA-Z 0-9]+/g, '')}${mediaObj.subOrder || ""}${extension}`);
			var remoteFilename = path.resolve(`/media/${mediaObj.name.replace(/[^a-zA-Z 0-9]+/g, '')}${mediaObj.subOrder || ""}${extension}`);
			console.log(remoteFilename);
			var file = fs.createWriteStream(localFilename);
			var request = https.get(mediaObj.url, function (response) {
				response.pipe(file);
			});

			file.on('finish', function () {
				Media.saveFile(mediaObj.url, JSON.stringify(remoteFilename).replace(/"/g, '')).then(function (files) {
					mediaObj.url = JSON.stringify(remoteFilename).replace(/"/g, '');
					resolve({mediaObj, files});
				})
			});
		});
	},
	getWatchtower: function (thisWeek) {
		console.log(thisWeek);
		return new Promise(function (resolve, reject) {
			var wUrl = `${baseUrl}${thisWeek.wUrl}`;

			request(wUrl, function (err, xhr, bodyArticle) {

				try {
					if (err) {

						resolve({
							url: "",
							name: err || "Media"
						});
						return;
					}
					$$ = cheerio.load(bodyArticle);
					var sources = [];
					$$("figure img").each(function (ind, el) {
						const mediaLink = $$(el).attr("src") || $$(el).attr("href");
						var url = mediaLink.indexOf("http") > -1 ? mediaLink : `${baseUrl}${mediaLink}`;
						sources.push({
							url: url,
							name: thisWeek.wName,
							type: "IMAGE",
							subOrder: ind
						});
					});
					$$("article .pubRefs a").each(function (ind, e) {

						sources.push({
							url: parseInt(($$(e).text()).match(/[0-9]{1,3}/)),
							image: "https://assetsnffrgf-a.akamaihd.net/assets/a/sjjm/univ/wpub/sjjm_univ_lg.jpg",
							name: `Cántico ${($$(e).text()).match(/[0-9]{1,3}/)}`,
							type: "VIDEO"
						});
					})
					resolve(sources);
					return;
				} catch (ex) {
					console.log(ex);
				};
			});
		});
	},
	getCurrentWeek: function () {
		console.log("getCurrentWeek")
		return new Promise(function (resolve, reject) {

			var date = new Date();
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var day = date.getDate();
			request(`${weekProgramUrl}${year}/${month}/${day}`, function (err, xhr, body) {
				try {

					var $ = cheerio.load(body);
					console.log("Titulo",  $("#p1 strong").text());
					resolve({
						name: $("#p1 strong").text(),
						wUrl: $("[class*='pub-w'] .it").attr("href"),
						wName: $("[class*='pub-w'] .it").text()
					});
				} catch (ex) {
					console.log("Can't get current week");
					reject(ex);
				}

			});
		});
	},
	getSongs: function () {
		songsList = [];
		return new Promise(function (resolve, reject) {
			request(songsListUrl, function (err, xhr, body) {
				try {

					
					var songs = JSON.parse(body).category.media;
					
					songs.forEach(function ( e) {

						var number = e.title.replace(/[^0-9]+/g,'');
						var name = 'Canción ' + number;
						console.log()
						const mediaLink = _.find(e.files,(c) => c.label=='720p').progressiveDownloadURL
						songsList.push({
							url: mediaLink,
							name: name,
							number: number,
							type: "VIDEO"
						});
					});
					
					resolve(songsList);
				} catch (ex) {
					console.log("Can't get songs", ex);
					resolve(null);
				}
			});
		});
	},
	getGuides: function () {

		return new Promise(function (resolve, reject) {
			console.log("1 get guides");
			request(guidesUrl, function (err, xhr, body) {
				console.log("2 guides");
				try {
					var $ = cheerio.load(body);
					var guides = [];
					$(".row.card a").each(function (i, e) {
						guides.push({
							url: $(e).attr("href") || "NULL",
							month: $(e).find(".cardTitle .sourceTitle").text() || "",
							image: $(e).find(".thumbnail").attr("src") || "NULL"
						});
					});
					resolve(guides);
				} catch (ex) {
					console.log("Can't get guides");
					resolve(null);
				}
			});
		});
	},
	getWeeks: function (monthUrl) {
		return new Promise(function (resolve, reject) {
			console.log(monthUrl);
			request(encodeURI (monthUrl) , function (err, xhr, body) {
		
				try {
					var $ = cheerio.load(body);
					var weeks = [];
					
					$(".row.card a").each(function (i, e) {
						console.log("Each");
						console.log($(e).find(".cardTitleBlock .cardSingleLine").text().trim());

						if ($(e).find(".cardTitleBlock .cardSingleLine").text().trim().match(/(([0-9]{1,2})+(-|[a-z ]{1,20})+([0-9]{1,2})+(-|[a-z ]{1,20}))/)) {
							console.log("if");
							var week = {
								url: $(e).attr("href") || "NULL",
								week: $(e).find(".cardLine1").text() || "",
								image: $(e).find(".thumbnail").attr("src") || "NULL"
							};
							console.log(week);
							weeks.push(week);
						}
					});
					resolve(weeks);
				} catch (ex) {
					console.log(ex);
					resolve(null);
				}
			});
		});
	},
	getMedia: function (weekUrl) {
		return new Promise(function (resolve, reject) {
			request(weekUrl, function (err, xhr, body) {
				try {
					var $ = cheerio.load(body);
					var urlMedia = [];
					$(".so a:not(.b), .sw a:not(.b)").each(function (order, e) {

						urlMedia.push(new Promise(function (resolveMedia, reject) {
							let mUrl;
							try {
								mUrl = $(e).attr("href").indexOf("http") > -1 ? $(e).attr("href") : `${baseUrl}${$(e).attr("href")}`;

								mUrl = mUrl.replace(apiFinder, apiMedi).replace("&lang=S", "");
								var objUrl = getParams(mUrl);
								if (objUrl.issue) {

									var type = ($(e).attr("data-audio") || "").length > 0 ? "AUDIO" : "VIDEO";
									mUrl = apiMedi + "pub-mwbv_" + objUrl.issue + "_" + objUrl.track + "_" + type
								}
							} catch (ex) {

							}

							request(mUrl, function (err, xhr, bodyArticle) {
								console.log(mUrl)
								try {
									if (err) {

										resolveMedia({
											url: "",
											name: $(e).text() || "Media"
										});
										return;
									}
									var newMedia = null;
									try {
										newMedia = JSON.parse(bodyArticle).media[0];
									} catch (ex) { }

									if (newMedia) {

										resolveMedia({
											url: _.filter(newMedia.files, function (file) {
												return file.progressiveDownloadURL.indexOf("720") > -1 || file.progressiveDownloadURL.indexOf("mp3") > -1
											})[0].progressiveDownloadURL || "NULL",
											image: newMedia.images.lsr.lg,
											duration: newMedia.durationFormattedHHMM,
											name: newMedia.title,
											type: newMedia.type.toUpperCase()
										});
										return;
									} else {
										console.log("else");
										$$ = cheerio.load(bodyArticle);
										var sources = [];
										$$("figure img, [src*='.mp4'], [src*='.mp3']").each(function (ind, el) {
											console.log(ind)
											const mediaLink = $$(el).attr("src") || $$(el).attr("href");
											var url = mediaLink.indexOf("http") > -1 ? mediaLink : `${baseUrl}${mediaLink}`;
											sources.push({
												url: url,
												name: $(e).text() || "Media",
												subOrder: ind,
												type: "IMAGE",
											});
										});
										if (sources.length > 0) {

											resolveMedia(sources);
											return;
										} else {
											if ($(e).text().indexOf("Canción") > -1) {

												resolveMedia({
													url: _.filter(songsList, function (s) {
														return s.number == parseInt(($(e).text()).match(/[0-9]{1,3}/))
													})[0].url,
													image: "https://assetsnffrgf-a.akamaihd.net/assets/a/sjjm/univ/wpub/sjjm_univ_lg.jpg",
													name: $(e).text(),
													type: "VIDEO"
												});
												return;
											}
										}
									}
								} catch (ex) {

								}

								resolveMedia({
									url: "",
									name: $(e).text() || "Media"
								});
								return;
							});
						}));
					});
				} catch (ex) {

				}
				Promise.all(urlMedia).then(function (data) {
					var finalMedia = _.filter(_.flatten(data), function (m) {
						return m.url.length > baseUrl.length;
					});
					resolve(finalMedia);
				});
			});
		});
	}
}

var getParams = function (url) {
	var vars = [],
		hash;
	var hashes = url.slice(url.indexOf("?") + 1).split("&");
	for (var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split("=");
		vars[hash[0]] = hash[1];
	}
	return vars;
}
//Media.getSongs();
module.exports = Media;
var Media = {
	files: [],
	readFile: function(mediaObj) {
		return new Promise((resolve, reject) => {
			try {


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
				var dir = "/media";
				Media.files = localStorage.getItem("files") || [];
				var localFile = [];
				localFile = _.filter(Media.files, function(f) {
					return f.localFilename.indexOf(JSON.stringify(`${dir}/${(mediaObj.name || "") .replace(/[^a-zA-Z 0-9]+/g, '')}${mediaObj.subOrder || ""}${extension}`).replace(/"/g, '')) > -1;
				});

				if (localFile.length > 0) {
					resolve(_.head(localFile))
				} else {
					resolve();
				}
			} catch (ex) {
				reject(ex);
			}
		});
	},
	download: function(mediaObj) {
		return new Promise(function(resolve, reject) {
			$.get(`/download/?mediaObj=${JSON.stringify(mediaObj)}`).done(resolve)
		});
	},
	getWatchtower: function(thisWeek) {
		return new Promise(function(resolve, reject) {
			$.get(`/getWatchtower?thisWeek=${JSON.stringify(thisWeek)}`).done(resolve)
		});
	},
	getCurrentWeek: function() {
		return new Promise(function(resolve, reject) {
			$.get('/getCurrentWeek').done(resolve)
		});
	},
	getSongs: function() {
		return new Promise(function(resolve, reject) {
			$.get('/getSongs').done(resolve)
		});
	},
	getGuides: function() {
		return new Promise(function(resolve, reject) {
			$.get('/getGuides').done(resolve)
		});
	},
	getWeeks: function(monthUrl) {
		return new Promise(function(resolve, reject) {
			$.get(`/getWeeks?monthUrl=${monthUrl}`).done(resolve)

		});
	},
	getMedia: function(weekUrl) {
		return new Promise(function(resolve, reject) {
			$.get(`/getMedia?weekUrl=${weekUrl}`).done(resolve)
		});
	}
};
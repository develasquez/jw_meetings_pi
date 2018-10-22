var player;
var socket;

//var Promise = require("bluebird");
//var _ = require("lodash");
var baseUrl = "https://wol.jw.org";
var currentWeek = "";


var main = {
    init: function () {
        socket = io();
        main.setEvents();

        socket.emit("getDownloads");
        socket.on("setDownloads", function (files) {
            main.getSongs();
            Media.files = files || [];
            localStorage.setItem("files", Media.files)
            main.getWeeks().then(function (weeks) {
                Media.getCurrentWeek().then(function (thisWeek) {
                    main.setCurrentWeek(thisWeek.name);
                    Media.getWatchtower(thisWeek).then(function (media) {
                        main.getWatchtowerMedia(media);
                    });
                }).catch(function (err) {

                    console.log(err);
                });
            });

        });
    },
    setEvents: function () {
        $(".expandWeeks").on("click", function () {
            monomer.showDialog("#popupWeeks");
        });
        window.onresize = function (event) {
            $("#songs").height($(".content").height());
        };
        $(".findSong input").on("keyup", function (evt) {
            $("#songs li").show();
            if ($(this).val().length > 0) {
                $("#songs li:not(:contains('" + $(this).val() + "'))").hide();
            }

        });
        $(".play").on("click", function () {
            $(".play").hide();
            $(".pause").show();
            socket.emit("controls", {
                "action": "play"
            });
        });
        $(".pause").on("click", function () {
            $(".pause").hide();
            $(".play").show();
            socket.emit("controls", {
                "action": "pause"
            });
        });
        $(".close").on("click", function () {

            socket.emit("controls", {
                "action": "exit"
            });
            $(".footer").css({
                "visibility": "hidden",
                "margin-top": "0px"
            });

        });
        $(".fullScreen").on("click", function () {
            socket.emit("fullscreen");
        });
    },
    getWeeks: function () {
        return new Promise(function (resolve, reject) {
            monomer.showLoading();
            Media.getGuides().then(function (data) {
                localStorage.setItem("guides", data);
                var weeks = [];
                $.each(data, function (i, e) {
                    weeks.push(Media.getWeeks(baseUrl + e.url));
                });
                Promise.all(weeks).then(function (weeksData) {
                    weeksData = _.flatten(_.compact(weeksData));
                    localStorage.setItem("weeks", weeksData);
                    main.renderWeeks();
                    monomer.hideLoading();
                    resolve(weeksData);
                })
            });
        });
    },
    renderWeeks: function () {
        $.each(localStorage.getItem("weeks"), _.bind(main.setWeeks, this));
    },
    setWeeks: function (i, e) {
        $(".weeks")
            .append($("<li>")
                .addClass("week")
                .data("week", e)
                .text(e.week)
                .on("click", function () {
                    monomer.hideDialog("#popupWeeks");
                    main.getMedia($(this).data("week"))
                })
            );
    },
    setCurrentWeek: function (currentWeek) {
        var weeks = localStorage.getItem("weeks");
        main.getMedia(_.filter(weeks, function (w) {
            return w.week == currentWeek
        })[0])

    },
    fnDownload: function (evt) {

        var mediaObj = $(evt.currentTarget).data("media");
        if (mediaObj.url.indexOf("http") > -1) {
            $(evt.currentTarget).find(".downloadState").addClass("blink")
            Media.download(mediaObj).then((function (data) {
                $(this).find(".downloadState")
                    .removeClass("icon-cloud")
                    .data("media", data, mediaObj);
                localStorage.setItem("files", data.files);
                socket.emit("files", data.files);
            }).bind(evt.currentTarget));
        } else {
            main.fnRender(evt);
        }
    },
    fnRender: function (evt) {

        var mediaObj = $(evt.currentTarget).data("media");
        $(".miniature").attr("src", mediaObj.image || mediaObj.url.replace("\\", "\\\\"));
        $(".footer").css({
            "visibility": "visible",
            "margin-top": "-76px"
        });
        if ("AUDIOVIDEO".indexOf(mediaObj.type) > -1) {
            $(".pause").show();
            $(".play").hide();
        }
        socket.emit("media", mediaObj);

    },
    getMedia: function (week) {
        monomer.showLoading();
        $(".weekTitle").text(week.week);
        Media.getMedia(baseUrl + week.url).then(function (data) {

            monomer.hideLoading();
            $(".mediaList").html("");
            data = _.uniqBy(data, 'url');
            $.each(data, function (i, e) {

                var mediaFile = e;
                Media.readFile(mediaFile).then(function (file) {
                    if (file) {
                        mediaFile.local = true;
                        mediaFile.url = file.localFilename;
                    }
                    $(".mediaList").append($(listHTML(mediaFile)).data("media", mediaFile).on("click", main.display));
                });

            });
        });
    },
    display: function (e) {
        var mediaFile = $(e.currentTarget).data("media");
        Media.readFile(mediaFile).then(function (file) {
            if (file) {
                mediaFile.local = true;
                mediaFile.url = file.localFilename;
                main.fnRender(e);
            } else {
                main.fnDownload(e);
            }
        }).catch(function (err) {
            console.log(err);
        });
    },
    getWatchtowerMedia: function (data) {
        $(".wTitle").text(currentWeek.wName);
        $(".wMediaList").html("");
        $.each(data, function (i, e) {

            var mediaFile = e;
            Media.readFile(mediaFile).then(function (file) {

                if (file) {
                    mediaFile.local = true;
                    mediaFile.url = file.localFilename;
                }
                $(".wMediaList").append($(listHTML(mediaFile)).data("media", mediaFile).on("click", main.display));

            });
        });

    },
    getSongs: function () {
        Media.getSongs().then(function (data) {
            $("#songs").html();
            $.each(data, function (i, e) {
                var song = e;
                if(!song.name){
                    return;
                }
                Media.readFile(song).then(function (file) {
                    if (file) {
                        song.local = true;
                        song.url = file.localFilename;
                    }
                        $("#songs").append($(songHTML(song)).data("media", song).on("click", main.display));
                   
                })
            });
            $("#songs").height($(".content").height());
        });

    }
};

var songHTML = function (data) {
    return [
        '<li>',
        '<div>',
        '<div class="test_box fab">',
        data.number,
        '</div>',
        '</div>',
        '<div>',
        '<div>',
        '<h3>' + data.name + '</h3>',
        '</div>',
        data.local ? '' :
            '<span class="downloadState button-right icon-cloud icon-1x icon-grey">',
        '</span>',
        '</div>',
        '</li>',
    ].join("\n");
};

var listHTML = function (data) {
    var image = data.image || data.url;

    return [
        '<div class="thumb">',
        '<div class="img" style="background: url(\'' + image + '\') center center / auto 100% no-repeat #000;"> ',
        data.type === 'VIDEO' ? '<div class="microPlay"><img src="/images/play.png" /></div>' : '',
        data.local ? '' : '<span class="downloadState button-right icon-cloud icon-1x icon-grey"></span>',
        '</div>',
        '<div>',
        '<span class="title">' + data.name + '</span>'
    ].join("\n");
};

$(main.init);


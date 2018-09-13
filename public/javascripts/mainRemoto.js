var player;
var socket;

//var Promise = require("bluebird");
//var _ = require("lodash");
var baseUrl = "https://wol.jw.org";
var currentWeek = "";


var main = {
    init: function() {
        socket = io();
        Media.getCurrentWeek().then(function(thisWeek) {
            currentWeek = thisWeek.name;
            main.setCurrentWeek();
            Media.getWatchtower(thisWeek).then(function(media) {
                main.getWatchtowerMedia(media);
            });
        }).catch(function(err){
            
            console.log(err);
        });
        //main.getWeeks();
        main.setEvents();
        main.getSongs();
        setTimeout(function() {
            $("#songs").height($(".content").height());
        }, 1000);
    },
    setEvents: function() {
        $(".expandWeeks").on("click", function() {
            monomer.showDialog("#popupWeeks");
        });
        window.onresize = function(event) {
            $("#songs").height($(".content").height());
        };
        $(".findSong input").on("keyup", function(evt) {
            $("#songs li").show();
            if ($(this).val().length > 0) {
                $("#songs li:not(:contains('" + $(this).val() + "'))").hide();
            }

        });
        $(".play").on("click", function() {
            $(".play").hide();
            $(".pause").show();
            socket.emit("controls", {
                "action": "play"
            }); 
        });
        $(".pause").on("click", function() {
            $(".pause").hide();
            $(".play").show();
            socket.emit("controls", {
                "action": "pause"
            });
        });
        $(".close").on("click", function() {
            
            socket.emit("controls", {
                "action": "exit"
            });
            $(".footer").css({
                "visibility": "hidden",
                "margin-top": "0px"
            });

        });
        $(".fullScreen").on("click",function(){
            socket.emit("fullscreen");
        });
    },
    getWeeks: function() {
        monomer.showLoading();
        Media.getGuides().then(function(data) {

            console.log("Guides Ready")
            if (!localStorage.getItem("guides")) {
                localStorage.setItem("guides", data);
            } else if (localStorage.getItem("guides").length = data.length) {
                if (localStorage.getItem("guides")) {
                    $.each(localStorage.getItem("weeks"), _.bind(main.setWeeks, this));
                    monomer.hideLoading();
                } else {
                    return;
                }
            }
            var weeks = [];
            $.each(data, function(i, e) {
                weeks.push(Media.getWeeks(baseUrl + e.url));
            });

            Promise.all(weeks).then(function(weeksData) {
                weeksData = _.flatten(_.compact(weeksData));
                if (!localStorage.getItem("weeks")) {
                    localStorage.setItem("weeks", weeksData);
                } else if (localStorage.getItem("weeks").length = weeksData.length) {
                    return
                }
                $.each(weeksData, _.bind(main.setWeeks, this));
                monomer.hideLoading();
            })
        });
    },
    setWeeks: function(i, e) {
        $(".weeks")
            .append($("<li>")
                .addClass("week")
                .data("week", e)
                .text(e.week)
                .on("click", function() {
                    monomer.hideDialog("#popupWeeks");
                    main.getMedia($(this).data("week"))
                })
            );
    },
    setCurrentWeek: function() {
        var weeks = localStorage.getItem("weeks");
        main.getMedia(_.filter(weeks, function(w) {
            return w.week == currentWeek
        })[0])

    },
    fnDownload: function(evt) {
        var mediaObj = $(this).data("media");

        if (mediaObj.url.indexOf("http") > -1) {
            $(this).find(".downloadState").addClass("blink")
            Media.download(mediaObj).then((function(data) {
                $(this).find(".downloadState")
                    .removeClass("icon-cloud")
                    .data("media", data,mediaObj);
                    localStorage.setItem("files", data.files);   
                    socket.emit("files",data.files);
            }).bind(evt.currentTarget));
        } else {
            main.fnRender(evt);
        }
    },
    fnRender: function(evt) {

        var mediaObj = $(evt.currentTarget).data("media");
        $(".miniature").attr("src", mediaObj.image || mediaObj.url.replace("\\", "\\\\"));
        $(".footer").css({
            "visibility": "visible",
            "margin-top": "-76px"
        });
        if("AUDIOVIDEO".indexOf(mediaObj.type) > -1){
            $(".pause").show();
            $(".play").hide();
        }
        socket.emit("media", mediaObj);

    },
    getMedia: function(week) {
        monomer.showLoading();
        $(".weekTitle").text(week.week);
        Media.getMedia(baseUrl + week.url).then(function(data) {

            monomer.hideLoading();
            $(".mediaList").html("");
            $.each(data, function(i, e) {

                var mediaFile = e;
                Media.readFile(mediaFile).then(function(file) {

                    if (file) {
                        mediaFile.local = true;
                        mediaFile.url = file.localFilename;
                        $(".mediaList").append($(listHTML(mediaFile)).data("media", mediaFile).on("click", main.fnRender));
                    } else {
                        $(".mediaList").append($(listHTML(mediaFile)).data("media", mediaFile).on("click", main.fnDownload));
                    }
                });
            });
        });
    },
    getWatchtowerMedia: function(data) {
        monomer.showLoading();
        $(".wTitle").text(currentWeek.wName);
        $(".wMediaList").html("");
        $.each(data, function(i, e) {

            var mediaFile = e;
            Media.readFile(mediaFile).then(function(file) {

                if (file) {
                    mediaFile.local = true;
                    mediaFile.url = file.localFilename;
                    $(".wMediaList").append($(listHTML(mediaFile)).data("media", mediaFile).on("click", main.fnRender));
                } else {
                    $(".wMediaList").append($(listHTML(mediaFile)).data("media", mediaFile).on("click", main.fnDownload));
                }
            });
        });

    },
    getSongs: function() {
        Media.getSongs().then(function(data) {
            $.each(data, function(i, e) {
                var song = e;
                Media.readFile(song).then(function(file) {
                    if (file) {
                        song.local = true;
                        song.url = file.localFilename;
                        $("#songs").append($(songHTML(song)).data("media", song).on("click", main.fnRender));
                    } else {
                        $("#songs").append($(songHTML(song)).data("media", song).on("click", main.fnDownload));
                    }
                })
            });

        });

    }
};

var songHTML = function(data) {
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

var listHTML = function(data) {
    var image = data.image || data.url;

    return [
        '<div class="thumb">',
        '<div class="img" style="background: url(\'' + image + '\') center center / auto 100% no-repeat #000;"> ',
        data.local ? '' : '<span class="downloadState button-right icon-cloud icon-1x icon-grey"></span>',
        '</div>',
        '<div>',
        '<span class="title">' + data.name + '</span>'
    ].join("\n");
};


$(main.init);
/**
 * Created by long.jiang on 2017/3/16.
 */
function uesr() {
    getInvoke(constants.URLS.GETCURRENTTENANT, function (res) {
        if (res.succeeded) {
            window.location.href = "user.html";
        }
    });
}

function list() {
    getInvoke(constants.URLS.GETCURRENTTENANT, function (res) {
        if (res.succeeded) {
            window.location.href = "list.html";
        }
    });
}

function showTel() {
    $(".msg-alert").show();
}

function hideTel() {
    $(".msg-alert").hide();
}

$(document).ready(function () {
    setCookie(constants.COOKIES.INDEXURL, window.location.href);
    document.title = getURLQuery("title");
    var templateType = getURLQuery("templateType");
    var bigBackground = getURLQuery("bigBackground") || "images/20180103/bg1.jpg";
    var bigLogo = getURLQuery("bigLogo") || "images/20180103/logo.png";
    var smallLogo = getURLQuery("smallLogo") || "images/20180103/slogan.png";
    var smallBackground = getURLQuery("smallBackground") || "images/fuwu/bg1.png";
    $("body").css("background-image", "url(" + bigBackground + ")");
    if (templateType == "1") {
        $(".mui-content").html($("#tp1Template1").html().format(bigLogo, smallLogo, smallBackground));
    }
    else if (templateType == "2") {
        $(".mui-content").html($("#tp1Template2").html().format(bigLogo, smallLogo, smallBackground));
    }
    else if (templateType == "3") {
        $(".mui-content").html($("#tp1Template3").html().format(bigLogo, smallLogo, smallBackground));
    }
    else if (templateType == "4") {
        $(".mui-content").html($("#tp1Template4").html().format(bigLogo, smallLogo, smallBackground));
    }
    else if (templateType == "5") {
        $(".mui-content").html($("#tp1Template5").html().format(bigLogo, smallLogo, smallBackground));
    }
    else if (templateType == "6") {
        $(".mui-content").html($("#tp1Template6").html().format(bigLogo, smallLogo, smallBackground));
    }
    else {
        $(".mui-content").html($("#tp1Template0").html().format(bigLogo, smallLogo, smallBackground));
    }
    //
    getInvoke2(constants.URLS.GETUNCONFIRMEDCONTRACTCOUNT, function (res) {
        if (res.succeeded) {
            if (res.data > 0) {
                $(".lbUnConfirmedContractCount").show();
            }
        }
    });
});

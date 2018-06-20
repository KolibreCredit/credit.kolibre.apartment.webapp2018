/**
 * Created by long.jiang on 2016/12/14.
 */
var cleaningId = "";
var pictureUrls = [];
var tplPicture = "<li><div style=\"width:120px\"><img src=\"{0}\" style=\"width:100%;height:80px;border-radius:4px\"/></div></li>";

function cancelCleaning() {
    $(".msg-post").show();
    var data = {id: cleaningId};
    postInvoke(constants.URLS.CANCELCLEANING, data, function (res) {
        $(".msg-post").hide();
        if (res.succeeded) {
            mui.toast(constants.msgInfo.cancelCleaning);
            setTimeout(function () {
                window.location.replace("fuwu.html?tabIndex=0");
            }, 1000);
        } else {
            mui.toast(res.message);
        }
    }, function (err) {
        $(".msg-post").hide();
        mui.toast(err.message);
    });
}

$(document).ready(function () {
    cleaningId = getURLQuery("cleaningId");
    getInvoke(constants.URLS.GETTENANTCLEANING.format(cleaningId), function (res) {
        if (res.succeeded && res.data != null) {
            var item = res.data;
            pictureUrls = item.pictures.split(",");
            var itemPictures = [];
            for (var i = 0; i < pictureUrls.length; i++) {
                itemPictures.push(tplPicture.format(pictureUrls[i]));
            }
            var tplView = $("#tplView").html();
            var htmlLeaseInfo = tplView.format(item.cleaningState
                , getCleaningState(item.cleaningState)
                , item.apartmentName
                , item.floor
                , item.roomNumber
                , item.createTime.substring(0, 16)
                , item.cleaningStartTime.substring(0, 16)
                , item.cleaningEndTime.substring(11, 16)
                , getCleaningTypes(item.cleaningType)
                , item.updateTime.substring(0, 16)
                , item.description
                , itemPictures.join(""));
            $("#divLeaseInfo").html(htmlLeaseInfo);
            setTimeout(function () {
                $("#scroller").css("width", "{0}px".format((pictureUrls.length + 1) * 130 + 40));
                myScroll = new IScroll('#wrapper', {
                    preventDefault: false,
                    scrollX: true,
                    scrollY: false,
                    mouseWheel: false
                });
            }, 10);
            if (item.cleaningState != "Succeed") {
                $(".step1").show();
            }
        }
    }, function (err) {
        mui.toast(err.message);
    });
});
/**
 * Created by long.jiang on 2016/12/14.
 */
var repairId = "";
var pictureUrls = [];
var tplPicture = "<li><div style=\"width:120px\"><img src=\"{0}\" style=\"width:100%;height:80px;border-radius:4px\"/></div></li>";

function cancelRepair() {
    $(".msg-post").show();
    var data = {id: repairId};
    postInvoke(constants.URLS.CANCELREPAIR, data, function (res) {
        $(".msg-post").hide();
        if (res.succeeded) {
            mui.toast(constants.msgInfo.cancelCleaning);
            setTimeout(function () {
                window.location.replace("fuwu.html?tabIndex=1");
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
    repairId = getURLQuery("repairId");
    getInvoke(constants.URLS.GETTENANTREPAIR.format(repairId), function (res) {
        if (res.succeeded && res.data != null) {
            var item = res.data;
            pictureUrls = item.pictures.split(",");
            var itemPictures = [];
            for (var i = 0; i < pictureUrls.length; i++) {
                itemPictures.push(tplPicture.format(pictureUrls[i]));
            }
            var tplView = $("#tplView").html();
            var htmlLeaseInfo = tplView.format(item.repairState
                , getCleaningState(item.repairState)
                , item.apartmentName
                , item.floor
                , item.roomNumber
                , item.createTime.substring(0, 16)
                , item.repairStartTime.substring(0, 16)
                , item.repairEndTime.substring(11, 16)
                , getRepairType(item.repairType)
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
            if (item.repairState != "Succeed") {
                $(".step1").show();
            }
        }
    }, function (err) {
        mui.toast(err.message);
    });
});
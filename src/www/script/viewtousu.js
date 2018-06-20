/**
 * Created by long.jiang on 2016/12/14.
 */
var complaintSuggestionId = "";
var pictureUrls = [];
var tplPicture = "<li><div style=\"width:120px\"><img src=\"{0}\" style=\"width:100%;height:80px;border-radius:4px\"/></div></li>";

function cancelComplaintSuggestion() {
    $(".msg-post").show();
    var data = {id: complaintSuggestionId};
    postInvoke(constants.URLS.CANCELCOMPLAINTSUGGESTION, data, function (res) {
        $(".msg-post").hide();
        if (res.succeeded) {
            mui.toast(constants.msgInfo.cancelCleaning);
            setTimeout(function () {
                window.location.replace("fuwu.html?tabIndex=2");
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
    complaintSuggestionId = getURLQuery("complaintSuggestionId");
    getInvoke(constants.URLS.GETTENANTCOMPLAINTSUGGESTION.format(complaintSuggestionId), function (res) {
        if (res.succeeded && res.data != null) {
            var item = res.data;
            pictureUrls = item.pictures.split(",");
            var itemPictures = [];
            for (var i = 0; i < pictureUrls.length; i++) {
                itemPictures.push(tplPicture.format(pictureUrls[i]));
            }
            var tplView = $("#tplView").html();
            var htmlLeaseInfo = tplView.format(item.complaintSuggestionState
                , getCleaningState(item.complaintSuggestionState)
                , item.apartmentName
                , item.floor
                , item.roomNumber
                , item.createTime.substring(0, 16)
                , item.updateTime.substring(0, 16)
                , item.complaintSuggestionContent
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
            if (item.complaintSuggestionState != "Succeed") {
                $(".step1").show();
            }
        }
    }, function (err) {
        mui.toast(err.message);
    });
});
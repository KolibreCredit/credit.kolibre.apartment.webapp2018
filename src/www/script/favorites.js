/**
 * Created by long.jiang on 2018/4/19.
 */
var getRoomSourceFeature = function (roomSourceFeature) {
    var arraySourceFeature = [];
    if (roomSourceFeature.length > 0) {
        for (var i = 0; i < roomSourceFeature.length; i++) {
            if (i < 2) {
                arraySourceFeature.push("<span>{0}</span>".format(roomSourceFeature[i]));
            } else {
                break;
            }
        }
    }
    return arraySourceFeature.join("");
};

function detail2(roomId) {
    window.location.href = "detail2.html?roomId={0}".format(roomId);
}

function cancleCollection(roomId) {
    getInvoke(constants.URLS.CANCLEROOMSOURCECOLLECTION.format(roomId), function (res) {
        if (res.succeeded) {
            mui.toast("取消收藏成功");
            setTimeout(function () {
                getRoomSourceCollectionInfos();
            }, 1000);
        } else {
            mui.toast(res.message);
        }
    });
}

function getRoomSourceCollectionInfos() {
    getInvoke(constants.URLS.GETROOMSOURCECOLLECTIONINFOS, function (res) {
        if (res.succeeded) {
            if (res.data != null) {
                var arrItems = [];
                var tplItem = $("#tplItem0").html();
                var item = null;
                for (var i = 0; i < res.data.length; i++) {
                    item = res.data[i];
                    arrItems.push(tplItem.format((item.pictures == null ? "images/dataErr.png" : item.pictures[0])
                        , item.roomSourceName
                        , (item.retailPrice > 0 ? (item.retailPrice * 0.01) + "元/月" : "敬请期待…")
                        , item.apartmentAddress
                        , getRoomSourceFeature(item.roomSourceFeature)
                        , item.roomId
                        , (item.rentType == "ZhengZu" ? "整租" : "合租") + " / " + item.roomTypeName + " / " + (item.roomTypeSize * 0.0001).toFixed(2) + "㎡"
                        , (item.roomSourceFeature.length > 0 ? "block" : "none")));
                }
                $(".mui-table-view").html(arrItems.join(""));
                $(".list").show();
                $(".errData").hide();
            } else {
                $(".list").hide();
                $(".errData").show();
            }
        } else {
            mui.toast(res.message);
        }
    }, function (err) {
        mui.toast(err.message);
    });
}

$(document).ready(function () {
    getRoomSourceCollectionInfos();
});
//
var roomSourceReservationId = "";
var dataList = null;
var dataHtmls = [];
var item = null;

function viewRoom(roomId) {
    window.location.href = "detail2.html?roomId={0}&reserve=1".format(roomId);
}

function showReservation(reservationId) {
    roomSourceReservationId = reservationId;
    $(".msg-alert").show();
}

function hideReservation() {
    roomSourceReservationId = "";
    $(".msg-alert").hide();
}

function cancelRoomSourceReservation() {
    var data = {
        roomSourceReservationId: roomSourceReservationId
    };
    postInvoke(constants.URLS.CANCELROOMSOURCERESERVATION, data, function (res) {
        if (res.succeeded) {
            mui.toast(constants.msgInfo.cancelRoomSourceReservation);
            hideReservation();
            setTimeout(function () {
                getRoomSourceReservations();
            }, 2000);
        } else {
            mui.toast(err.message);
        }
    }, function (err) {
        mui.toast(err.message);
    });
}

function getReservationState(reservationState) {
    switch (reservationState) {
        case  "Created":
            return "已创建";
        case  "Contacted":
            return "已联系";
        case  "Viewed":
            return "已看房";
        case "Canceled":
            return "已取消";
        default:
            return "--";
    }
}

function getRoomSourceReservations() {
    getInvoke(constants.URLS.GETROOMSOURCERESERVATIONS, function (res) {
        if (res.succeeded) {
            if (res.data.length == 0) {
                $('#divlist').html("");
                $(".nodataDiv").css({"visibility": "visible"});
            } else {
                dataHtmls = [];
                var tpl0 = $("#tpl0").html();
                dataList = res.data;
                for (var i = 0; i < dataList.length; i++) {
                    item = dataList[i];
                    dataHtmls.push(tpl0.format(item.createTime.substring(0, 16)
                        , getReservationState(item.reservationState)
                        , item.reservationState
                        , (item.pictures.length > 0 ? item.pictures[0] : "images/dataErr.png")
                        , item.apartmentName
                        , (item.retailPrice == 0 ? "敬请期待..." : (item.retailPrice * 0.01).toFixed(2) + "元/月")
                        , item.tenantName
                        , replaceStr(item.tenantCellphone, 4)
                        , item.reservationTime.substring(0, 16)
                        , item.roomId
                        , item.roomSourceReservationId));
                }
                $(".nodataDiv").hide();
                $('#divlist').html(dataHtmls.join(""));
            }
        }
    }, function (err) {
        console.log(err.message);
    });
}

$(document).ready(function () {
    getRoomSourceReservations();
});

/**
 * Created by long.jiang on 2016/12/14.
 */

var leaseId = "";
var url = "";
$(document).ready(function () {
    leaseId = getURLQuery("leaseId");
    url = getURLQuery("url");
    getInvoke(constants.URLS.GETLEASEINFO.format(leaseId), function (res) {
        if (res != null) {
            var item = res;
            var tplLeaseInfo = $("#tplLeaseInfo").html();
            var LeaseInfoHtml = tplLeaseInfo.format(
                item.houseInfo.source,
                item.houseInfo.floor,
                item.houseInfo.roomNumber,
                item.leaseStartTime,
                item.leaseExpiryTime);
            $("#divLeaseInfo").html(LeaseInfoHtml);
        }
    }, function (err) {
        mui.toast(err.message);
    });
});

function apply() {
    var data = {
        leaseId: leaseId,
        checkoutTime: $("#lbLeaseDate").html(),
        checkoutReason: $("#lbReason").html(),
        notes: $("#txtMemo").val()
    };
    postInvoke(constants.URLS.APPLYCHECKOUT, data, function (res) {
        if (res.succeeded) {
            $(".msg-alert").show();
        } else {
            mui.toast(res.message);
        }
    }, function (err) {
        mui.toast(err.message);
    });
}

function hideMsg() {
    $(".msg-alert").hide();
    setTimeout(function () {
        window.location.href = url;
    }, 200);
}

/**
 * Created by long.jiang on 2016/12/14.
 */

var contractId = "";

$(document).ready(function () {
    contractId = getURLQuery("contractId");
    getInvoke(constants.URLS.GETCONTRACTDETAILS.format(contractId), function (res) {
        if (res.succeeded) {
            var item = res.data;
            var tplLeaseInfo = $("#tplLeaseInfo").html();
            var LeaseInfoHtml = tplLeaseInfo.format(
                item.roomDetails.apartmentName,
                item.roomDetails.floor,
                item.roomDetails.roomNumber,
                item.rentStartTime.substring(0, 10),
                item.rentEndTime.substring(0, 10));
            $("#divLeaseInfo").html(LeaseInfoHtml);
        }
    }, function (err) {
        mui.toast(err.message);
    });
});

function apply() {
    var data = {
        contractId: contractId,
        checkoutTime: $("#lbLeaseDate").html(),
        checkoutReason: $("#lbReason").html(),
        notes: $("#txtMemo").val()
    };
    postInvoke(constants.URLS.CREATECHECKOUTAPPLY, data, function (res) {
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
        window.location.href = "list.html";
    }, 1000);
}

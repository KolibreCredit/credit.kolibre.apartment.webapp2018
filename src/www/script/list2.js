/**
 * Created by long.jiang on 2016/12/14.
 */
function addHouse() {
    window.location.href = "house.html?ver=" + new Date();
}

function view(leaseId) {
    // window.location.href = "view.html?leaseId={0}&ver={1}".format(leaseId, new Date());
}

function cancel(leaseId) {
    $("#lbLeaseId").html(leaseId);
    $(".msg-alert").show();
}

function apply(leaseId) {
    window.location.href = "lease.html?leaseId={0}&url={1}".format(leaseId, 'list2.html');
}

function cancelCheckout() {
    var data = {
        leaseId: $("#lbLeaseId").html()
    };
    postInvoke(constants.URLS.CANCELCHECKOUT, data, function (res) {
        if (res.succeeded) {
            $(".msg-alert").hide();
            getCheckoutLeases();
        } else {
            mui.toast(res.message);
        }
    }, function (err) {
        mui.toast(err.message);
    });
}

function hideMsg() {
    $(".msg-alert").hide();
}

var getRentalType = function (retType, isStaged) {
    var rentalType = "";
    if (retType == "Monthly") {
        rentalType = "月付";
    }
    else if (retType == "ForceMonthly") {
        if (isStaged) {
            rentalType = "月付";
        }
        else {
            rentalType = "全额付";
        }
    }
    else if (retType == "Quarterly") {
        rentalType = "季付";
    }
    else if (retType == "SixMonthly") {
        rentalType = "半年付";
    }
    else {
        rentalType = "全额付";
    }
    return rentalType;
};

function getCheckoutLeases() {
    getInvoke(constants.URLS.GETCHECKOUTLEASES, function (res) {
        if (res.length > 0) {
            var leasesHtml = "";
            var tplLeases = $("#tplLeases").html();
            var item = null;
            var btnApply = "<button onclick='apply(\"{0}\")' class='btnPay'>申请退租</button>";
            var btnCancel = "<button onclick='cancel(\"{0}\")' class='btnPay'>取消退租</button>";
            for (var i = 0; i < res.length; i++) {
                item = res[i];
                leasesHtml += tplLeases.format(
                    item.leaseId,
                    item.createTime,
                    item.houseInfo.source,
                    item.houseInfo.roomNumber,
                    (item.monthRentalAmount / 100).toFixed(2),
                    getRentalType(item.rentalType, item.isStaged),
                    item.rentalState == 'Created' ? btnApply.format(item.leaseId) : btnCancel.format(item.leaseId),
                    item.rentalState == 'OnCheckout' ? "退租中" : "");
            }
            $("#ulLeases").html(leasesHtml);
        } else {
            $("#divNoDate").show();
        }
    }, function (err) {
        $("#divNoDate").show();
        mui.toast(err.message);
    });
}

$(document).ready(function () {
    getCheckoutLeases();
});

/**
 * Created by long.jiang on 2016/12/14.
 */

var leaseId = "";

function bill() {
    setCookie(constants.COOKIES.LEASEID2, leaseId);
    if (isWeixin()) {
        window.location.href = constants.URLS.WEIXIBILL2;
    } else {
        window.location.href = constants.URLS.BILL2;
    }
}

function apply() {
    setCookie(constants.COOKIES.LEASEID, leaseId);
    getInvoke(constants.URLS.GETCURRENTHOUSEACCOUNTINFO, function (res) {
        if (res.isVerified) {
            window.location.href = "apply2.html";
        } else {
            var data = {
                realName: res.realName,
                idCardNo: res.credentialNo,
                cellphone: res.cellphone
            };
            postInvoke(constants.URLS.THREEFACTORVERIFY, data, function (res1) {
                if (res1.succeeded) {
                    window.location.href = "apply2.html";
                } else {
                    window.location.href = "apply1.html";
                }
            }, function (err) {
                mui.toast(err.message);
            });
        }
    });
}


function getRentalType(resType) {
    var rentalType = "";
    if (resType === "Monthly") {
        rentalType = "月付";
    }
    else if (resType === "ForceMonthly") {
        rentalType = "全额付";
    }
    else if (resType === "Quarterly") {
        rentalType = "季付";
    }
    else if (resType === "SixMonthly") {
        rentalType = "半年付";
    }
    else {
        rentalType = "全额付";
    }
    return rentalType;
}

function getLeaseInfo() {
    getInvoke(constants.URLS.GETLEASEINFO.format(leaseId), function (res) {
        if (res != null) {
            var item = res;
            if (item.hasOrders) {
                $("#lbBill").show();
            } else {
                $("#lbApply").show();
            }
            var tplLeaseInfo = $("#tplLeaseInfo").html();
            var LeaseInfoHtml = tplLeaseInfo.format(
                item.houseInfo.source,
                item.houseInfo.roomNumber,
                item.houseInfo.floor,
                item.houseInfo.decoration,
                item.outerContractNo,
                (item.monthRentalAmount / 100).toFixed(2),
                item.leaseTerm,
                item.leaseOrderDay,
                item.leaseStartTime,
                item.leaseExpiryTime,
                (item.depositAmount / 100).toFixed(2),
                (item.isPaidDeposit ? "已支付" : "未支付"),
                (item.tenementAmount / 100).toFixed(2),
                getRentalType(item.rentalType));
            $("#divLeaseInfo").html(LeaseInfoHtml);
            if (item.rentalState == "Checkout") {
                $("#imgRental").show();
            }
            if (item.isStaged) {
                $(".staged").show();
            }
            if (item.checkoutInfo != null) {
                var checkoutInfo = item.checkoutInfo;
                var tplCheckoutInfo = $("#tplCheckoutInfo").html();
                $("#divCheckoutInfo").html(tplCheckoutInfo.format((checkoutInfo.actualCheckoutTime != null ? checkoutInfo.actualCheckoutTime.substring(0, 10) : checkoutInfo.checkoutTime.substring(0, 10)), checkoutInfo.checkoutReason, checkoutInfo.notes));
            }
        }
    }, function (err) {
        mui.toast(err.message);
    });
}

$(document).ready(function () {
    leaseId = getURLQuery("leaseId");
    getLeaseInfo();
});
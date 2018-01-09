/**
 * Created by long.jiang on 2016/12/14.
 */
var leaseId = "";
function apply() {
    setCookie(constants.COOKIES.LEASEID, leaseId);
    getInvoke(constants.URLS.GETCURRENTTENANT, function (res) {
        if (res.succeeded && res.data.isVerified) {
            window.location.href = "apply2.html";
        } else {
            var data = {
                realName: res.data.realName,
                idCardNo: res.data.credentialNo,
                cellphone: res.data.cellphone
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
    }, function (err) {
        mui.toast(err.message);
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
    leaseId = getURLQuery("contractId");
    getInvoke(constants.URLS.GETCONTRACTROOMTENANTBYCONTRACTID.format(leaseId), function (res) {
        if (res.succeeded && res.data != null) {
            var item = res.data;
            if (item.hasOrders) {
                $("#lbBill").show();
            } else {
                $("#lbApply").show();
            }
            var tplLeaseInfo = $("#tplLeaseInfo").html();
            /* var htmlLeaseInfo = tplLeaseInfo.format(
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
                 getRentalType(item.rentalType));*/
            $("#divLeaseInfo").html(tplLeaseInfo);
        }
    }, function (err) {
        mui.toast(err.message);
    });
}

$(document).ready(function () {
    getLeaseInfo();
});
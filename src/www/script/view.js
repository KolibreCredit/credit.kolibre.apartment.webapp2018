/**
 * Created by long.jiang on 2016/12/14.
 */
var contractId = "";
var confirmed = "";
//
function apply() {
    var data = {contractId: contractId};
    postInvoke(constants.URLS.CREATECONFIRMINFO, data, function (result) {
        if (result.succeeded) {
            var res = result.data;
            setCookie(constants.COOKIES.CONTRACTCONFIRMINFOID, res.contractConfirmInfoId);
            if (!res.verifyResult) {
                window.location.href = "apply1.html";
            } else if (res.contractPictures == null) {
                window.location.href = "apply2.html";
            }
            else if (res.selfiePhoto == null) {
                window.location.href = "apply3.html";
            }
            else if (res.contactInfo == null) {
                window.location.href = "apply4.html";
            } else {
                window.location.href = "apply5.html";
            }
        }
    });
}

function getPayPeriod(payPeriod) {
    var rentalType = "";
    if (payPeriod == 3) {
        rentalType = "季付";
    }
    else if (payPeriod == 6) {
        rentalType = "半年付";
    }
    else if (payPeriod == 12) {
        rentalType = "年付";
    }
    else if (payPeriod == 0) {
        rentalType = "全额付";
    }
    return rentalType;
}

$(document).ready(function () {
    contractId = getURLQuery("contractId");
    confirmed = getURLQuery("confirmed");
    getInvoke(constants.URLS.GETCONTRACTDETAILS.format(contractId), function (res) {
        if (res.succeeded && res.data != null) {
            var item = res.data;
            var tplLeaseInfo = $("#tplLeaseInfo").html();
            var htmlLeaseInfo = tplLeaseInfo.format(
                item.roomDetails.apartmentName,
                item.roomDetails.roomNumber,
                (item.monthlyAmount / 100).toFixed(2),
                (item.propertyManagementAmount / 100).toFixed(2),
                (item.depositAmount / 100).toFixed(2),
                item.term,
                item.rentStartTime.substring(0, 10),
                item.rentEndTime.substring(0, 10),
                getPayPeriod(item.payPeriod));
            $("#divLeaseInfo").html(htmlLeaseInfo);
            if (confirmed != "0") {
                if (item.confirmed) {
                    $(".btnNext").hide();
                } else {
                    $(".btnNext").html("确认租约").show()
                }
            } else {
                $(".btnNext").show();
            }
        }
    }, function (err) {
        mui.toast(err.message);
    });
});
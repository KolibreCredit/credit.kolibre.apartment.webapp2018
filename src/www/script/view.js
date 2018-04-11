/**
 * Created by long.jiang on 2016/12/14.
 */
var contractId = "";
var confirmed = "";
//
function apply() {
    $(".msg-post").show();
    var data = {contractId: contractId};
    postInvoke(constants.URLS.CREATECONFIRMINFO, data, function (res) {
        if (res.succeeded) {
            setCookie(constants.COOKIES.CONTRACTCONFIRMINFOID, res.data.contractConfirmInfoId);
            if (res.data.nextStep == 5) {
                if (res.data.contractMedium == 'Paper') {
                    window.location.href = "apply5.html";
                } else {
                    window.location.href = "apply51.html";
                }
            } else {
                toApplys(res.data.nextStep);
            }
        } else {
            $(".msg-post").hide();
        }
    }, function (err) {
        $(".msg-post").hide();
        mui.toast(err.message);
    });
}

function signUrl(imgUrl) {
    window.location.href = "signImg.html?imgUrl="+imgUrl;
}

$(document).ready(function () {
    contractId = getURLQuery("contractId");
    confirmed = getURLQuery("confirmed");
    getInvoke(constants.URLS.GETCONTRACTDETAILS.format(contractId), function (res) {
        if (res.succeeded && res.data != null) {
            var item = res.data;
            var templateName = "";
            var imageStorageLocation = "";
            if (item.contractMedium == "Digital" && item.digitalContractInfos.length > 0) {
                templateName = item.digitalContractInfos[0].templateName;
                imageStorageLocation = item.digitalContractInfos[0].imageStorageLocation;
            }
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
                getPayPeriod(item.payPeriod),
                imageStorageLocation,
                templateName);
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
            if (item.contractMedium == "Digital" && item.digitalContractInfos.length > 0) {
                $(".digital").show();
            }
        }
    }, function (err) {
        mui.toast(err.message);
    });
});
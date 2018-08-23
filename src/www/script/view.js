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
    window.location.href = "signImg.html?imgUrl=" + imgUrl;
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
            var isStagesMonthRents = false;
            var arrStagesMonthRents = [];
            if (item.stagesMonthRents != null && item.stagesMonthRents.length > 0) {
                isStagesMonthRents = true;
                var tplStagesMonthRents = $("#tplStagesMonthRents").html();
                item.stagesMonthRents.forEach(function (model) {
                    arrStagesMonthRents.push(tplStagesMonthRents.format((model.amount / 100).toFixed(2), model.stagesStartTime + "～" + model.stagesEndTime));
                });
            } else {
                isStagesMonthRents = false;
            }
            var tplLeaseInfo = $("#tplLeaseInfo").html();
            var htmlLeaseInfo = tplLeaseInfo.format(
                item.roomDetails.apartmentName,
                item.roomDetails.roomNumber,
                (isStagesMonthRents ? arrStagesMonthRents.join("") : (item.monthlyAmount / 100).toFixed(2)),
                (item.propertyManagementAmount / 100).toFixed(2),
                (item.depositAmount / 100).toFixed(2),
                item.term,
                item.rentStartTime.substring(0, 10),
                item.rentEndTime.substring(0, 10),
                getPayPeriod(item.payPeriod),
                imageStorageLocation,
                templateName,
                (item.accessCardDepositAmount / 100).toFixed(2));
            $("#divLeaseInfo").html(htmlLeaseInfo);
            setTimeout(function () {
                if (item.customDeposits != null && item.customDeposits.length > 0) {
                    var customDeposit = null;
                    var htmlCustomDeposit = [];
                    var tplCustomDeposit = $("#tplCustomDeposit").html();
                    for (var i = 0; i < item.customDeposits.length; i++) {
                        customDeposit = item.customDeposits[i];
                        htmlCustomDeposit.push(tplCustomDeposit.format(customDeposit.name, (customDeposit.amount / 100).toFixed(2)));
                    }
                    $(".customDeposits").html(htmlCustomDeposit.join("")).show();
                }
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
                if (item.accessCardDepositAmount > 0) {
                    $(".accessCardDepositAmount").show();
                }
                if (isStagesMonthRents) {
                    $(".stagesMonthRents").show();
                } else {
                    $(".monthlyAmount").show();
                }
            }, 0);
        }
    }, function (err) {
        mui.toast(err.message);
    });
});
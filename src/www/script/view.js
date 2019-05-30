/**
 * Created by long.jiang on 2016/12/14.
 */
var contractId = "";

//
function apply() {
    $(".msg-post").show();
    var data = {contractId: contractId};
    postInvoke(constants.URLS.CREATECONFIRMINFO, data, function (res) {
        if (res.succeeded) {
            $(".msg-post").hide();
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

function filterOrderState(orderState) {
    var state = "";
    if (orderState == "Created") {
        state = "待支付";
    }
    else if (orderState == "ApproachingOverdue") {
        state = "快到期";
    }
    else if (orderState == "BeDue") {
        state = "已到期";
    }
    else if (orderState == "Overdue") {
        state = "已逾期";
    }
    else if (orderState == "Canceled") {
        state = "已退租";
    }
    else {
        state = "已完成";
    }
    return state;
}

function orders() {
    window.location.href = "viewOrders.html?contractId={0}".format(contractId);
}

function goods() {
    window.location.href = " goods.html?contractId=" + contractId;
}

function checkout() {
    window.location.href = " checkout.html?contractId=" + contractId;
}

function showMsgAlert() {
    $(".msg-alert").show();
}

function hideMsgAlert() {
    $(".msg-alert").hide();
}

$(document).ready(function () {
    contractId = getURLQuery("contractId");
    getInvoke(constants.URLS.GETCONTRACTDETAILS.format(contractId), function (res) {
        if (res.succeeded && res.data != null) {
            var item = res.data;
            var roomDetails = res.data.roomDetails;
            var orders = res.data.orders;
            //
            $("#divApartmentName").html(roomDetails.apartmentName);
            $("#divRoomNumber").html(roomDetails.roomNumber + "室");
            //
            if (orders.length > 3) {
                $("#divAllOrderInfo").show();
                $("#divOrderInfo").css({"padding-top": "10px"});
            }
            var htmlOrderInfos = [];
            var tplOrderInfo = $("#tplOrderInfo").html();
            var order = null;
            var monthUrl = "";
            for (var i = 0; i < orders.length; i++) {
                if (i < 3) {
                    order = orders[i];
                    monthUrl = "images/months/{0}".format(moment(order.paymentTime).format('MM') + "s.png");
                    htmlOrderInfos.push(tplOrderInfo.format(monthUrl, (order.orderType == "CustomDeposit" ?getOrderTypeName(order.orderTypeName) : getOrderType(order.orderType)),
                        (order.totalAmount / 100).toFixed(2),
                        order.orderState.toLowerCase(),
                        filterOrderState(order.orderState),
                        order.orderStartTime.substring(0, 10),
                        order.orderEndTime.substring(0, 10),
                        order.paymentTime.substring(0, 10)
                    ));
                }
            }
            $("#divOrderInfo").html(htmlOrderInfos.join(""));
            //
            $(".msg-alert").html($("#tplMsgAlert").html().format(item.managerContact));
            var templateName = "";
            var imageStorageLocation = "";
            if (item.confirmed) {
                if (item.contractPictures) {
                    templateName = "查看";
                    imageStorageLocation = item.contractPictures;
                } else {
                    templateName = "查看";
                    if (item.digitalContractInfos.length > 0) {
                        imageStorageLocation = item.digitalContractInfos[0].imageStorageLocation;
                    }
                }
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
            var htmlLeaseInfo = tplLeaseInfo.format((item.rentalMode == "MonthlyRent" ? "月" : "日"), (item.rentalMode == "MonthlyRent" ? "月" : "天"),(isStagesMonthRents ? arrStagesMonthRents.join("") : (item.monthlyAmount / 100).toFixed(2)),
                (item.propertyManagementAmount / 100).toFixed(2),
                (item.depositAmount / 100).toFixed(2),
                (item.accessCardDepositAmount / 100).toFixed(2),
                item.term,
                item.rentStartTime.substring(0, 10),
                item.rentEndTime.substring(0, 10),
                (item.rentalMode == "MonthlyRent" ? getPayPeriod(item.payPeriod) : getPayPeriod2(item.payPeriod)),
                (item.contractPictures ? "纸质合同" : "电子合同"),
                imageStorageLocation,
                templateName, item.contractNotes, item.contractId,(item.rentalMode == "MonthlyRent" ? "" : "/间"),(item.rentalMode == "MonthlyRent" ? "合同" : "订单"));
            $("#divLeaseInfo").html(htmlLeaseInfo);
            setTimeout(function () {
                if (item.rentalMode == "MonthlyRent") {
                    $(".dailyRent").show();
                }
                else {
                    $(".dailyRent").hide();
                }
                if (item.customDeposits != null && item.customDeposits.length > 0) {
                    var customDeposit = null;
                    var htmlCustomDeposit = [];
                    var tplCustomDeposit = $("#tplCustomDeposit").html();
                    for (var i = 0; i < item.customDeposits.length; i++) {
                        customDeposit = item.customDeposits[i];
                        htmlCustomDeposit.push(tplCustomDeposit.format(getOrderTypeName(customDeposit.name),(customDeposit.amount / 100).toFixed(2)));
                    }
                    $(".customDeposits").html(htmlCustomDeposit.join("")).show();
                }
                if (item.confirmed && imageStorageLocation != "") {
                    $(".contractPicture").show();
                }
                if (item.confirmed) {
                    $(".btnNext").eq(1).show();
                } else {
                    $(".btnNext").eq(0).show()
                }
                if (item.accessCardDepositAmount > 0) {
                    $(".accessCardDepositAmount").show();
                }
                if (isStagesMonthRents) {
                    $(".stagesMonthRents").show();
                } else {
                    $(".monthlyAmount").show();
                }
                if (item.contractNotes) {
                    $(".contractNotes").show();
                }
                if (item.propertyDeliveies != null && (item.propertyDeliveies.fileUrl.length > 0 || item.propertyDeliveies.goods.length > 0)) {
                    $(".goods").show();
                }
                //
                if (item.checkoutInfo != null && item.checkoutInfo.checkoutConfirmation != null) {
                    $(".checkout").show();
                }
            }, 10);
        }
    }, function (err) {
        mui.toast(err.message);
    });
});
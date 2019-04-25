/**
 * Created by long.jiang on 2016/12/14.
 */
var goto = "";
var orderId = "";
var item = null;
var deviceId = "";
var contractId = "";

function invoice() {
    window.location.href = "invoice.html?contractId={0}".format(contractId);
}


$(document).ready(function () {
    orderId = getURLQuery("orderId");
    goto = getURLQuery("goto");
    deviceId = getURLQuery("deviceId") || "";
    getInvoke(constants.URLS.GETORDERBYORDERID.format(orderId), function (res) {
        if (res.succeeded && res.data != null) {
            item = res.data;
            var tipUrl = "";
            var tipTitle = "";
            var tipTitle1 = "";
            var tipTitle2 = "";
            if (item.orderState == "Created") {
                tipUrl = "images/20180103/Created.png";
                tipTitle = "待支付";
                tipTitle1 = "实付日";
                tipTitle2 = "待支付";
            }
            else if (item.orderState == "ApproachingOverdue") {
                tipUrl = "images/20180103/kuai.png";
                tipTitle = "快到期";
                tipTitle1 = "实付日";
                tipTitle2 = "待支付";
            }
            else if (item.orderState == "Overdue" || item.orderState == 'BeDue') {
                tipUrl = "images/20180103/Overdue.png";
                tipTitle = (item.orderState == "Overdue" ? "已逾期" : "已到期");
                tipTitle1 = "实付日";
                tipTitle2 = (item.orderState == "Overdue" ? "已逾期" : "已到期");
            }
            else if (item.orderState == "Canceled") {
                tipUrl = "images/20180103/Canceled.png";
                tipTitle = "已取消";
                tipTitle1 = "取消日";
                tipTitle2 = item.checkoutTime.substring(0, 16);
            }
            else {
                tipUrl = "images/20180103/Paid.png";
                tipTitle = "已完成";
                tipTitle1 = "实付时间";
                tipTitle2 = item.actualPaymentTime.substring(0, 16);
                /*if (item.canInvoice) {
                    contractId = item.contractId;
                    $(".divInvoice").show();
                }*/
            }
            if (!item.frozen && item.isCurrent) {
                $(".footer").show();
                $(".divPay").show();
                if (item.canStage) {
                    $(".btnStage").show();
                    $(".btnPay").css({"width": "50%"});
                }
            }
            $("#imgOrderState").attr("src", tipUrl);
            /* document.getElementById("imgOrderState").onload = function () {
                 $(".fang").show();
             };*/
            if (item.orderType == "HouseRental") {
                var tplLeaseInfo = $("#tplLeaseInfo0").html();
                var htmlLeaseInfo = tplLeaseInfo.format(
                    item.apartmentName,
                    item.roomNumber,
                    (item.orderType == "CustomDeposit" ? item.orderTypeName : getOrderType(item.orderType)),
                    (item.totalAmount / 100).toFixed(2),
                    tipTitle,
                    item.orderState.toLowerCase(),
                    (item.repayAmount / 100).toFixed(2),
                    (item.propertyManagementAmount / 100).toFixed(2),
                    (item.penaltyAmount / 100).toFixed(2),
                    (item.serviceCharge / 100).toFixed(2),
                    item.paymentTime.substring(0, 10),
                    tipTitle1,
                    tipTitle2,
                    item.orderStartTime.substring(0, 10),
                    item.orderEndTime.substring(0, 10));
                $("#divLeaseInfo").html(htmlLeaseInfo);
            } else if (item.orderType == "HotWaterFee" || item.orderType == "ColdWaterFee" || item.orderType == "ElectricityFee") {
                var tplLeaseInfo = $("#tplLeaseInfo1").html();
                var htmlLeaseInfo = tplLeaseInfo.format(
                    item.apartmentName,
                    item.roomNumber,
                    (item.orderType == "CustomDeposit" ? item.orderTypeName : getOrderType(item.orderType)),
                    (item.totalAmount / 100).toFixed(2),
                    tipTitle,
                    item.orderState.toLowerCase(),
                    (item.repayAmount / 100).toFixed(2),
                    item.paymentTime.substring(0, 10),
                    tipTitle1,
                    tipTitle2,
                    item.orderStartTime.substring(0, 10),
                    item.orderEndTime.substring(0, 10));
                $("#divLeaseInfo").html(htmlLeaseInfo);
                setTimeout(function () {
                    if (item.utilityExpensenInfo != null) {
                        var tplLeaseInfoItems = $("#tplLeaseInfoItems").html();
                        $(".leaseInfoItems").html(tplLeaseInfoItems.format(
                            (item.utilityExpensenInfo.unitPrice / 100).toFixed(2),
                            item.utilityExpensenInfo.currentTime.substring(0, 10),
                            item.utilityExpensenInfo.lastTime.substring(0, 10),
                            (item.utilityExpensenInfo.totalAmount / 100).toFixed(2),
                            item.utilityExpensenInfo.currentRecord.toFixed(2),
                            item.utilityExpensenInfo.lastRecord.toFixed(2))).show();
                    }
                }, 0);
            } else {
                var tplLeaseInfo = $("#tplLeaseInfo2").html();
                var htmlLeaseInfo = tplLeaseInfo.format(
                    item.apartmentName,
                    item.roomNumber,
                    (item.orderType == "CustomDeposit" ? item.orderTypeName : getOrderType(item.orderType)),
                    (item.totalAmount / 100).toFixed(2),
                    tipTitle,
                    item.orderState.toLowerCase(),
                    (item.repayAmount / 100).toFixed(2),
                    item.paymentTime.substring(0, 10),
                    tipTitle1,
                    tipTitle2,
                    item.orderStartTime.substring(0, 10),
                    item.orderEndTime.substring(0, 10));
                $("#divLeaseInfo").html(htmlLeaseInfo);
            }
            if (item.frozen) {
                setTimeout(function () {
                    var tplFrozen = $("#tplFrozen").html();
                    $(".frozen").html(tplFrozen.format(item.frozenTime.substring(0, 16), item.frozenReason)).show();
                    $(".divFrozen").show();
                }, 0);
            }
        }
    }, function (err) {
        mui.toast(err.message);
    });
});

function createTransaction() {
    if (item.canPay) {
        var isWxMini = window.__wxjs_environment === 'miniprogram';
        if (isWxMini) {
            wx.miniProgram.navigateTo({url: '/pages/bill/wxpay?orderId={0}&goto={1}&deviceId={1}'.format(orderId, goto, deviceId)});
        } else {
            setCookie(constants.COOKIES.DEVICEID, deviceId);
            var redirect_uri = encodeURIComponent(constants.URLS.WEBPAYURL.format(orderId, goto));
            window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + constants.CONFIGS.APPID + "&redirect_uri=" + redirect_uri + "&response_type=code&scope=snsapi_base#wechat_redirect";
        }
    } else {
        $(".msg-alert").show();
    }
}

function createStage() {
    window.location.href = "recognitionface.html?orderId={0}".format(orderId);
}

function confirmList() {
    window.location.href = "list.html";
}

function closeApply() {
    $(".msg-alert").hide();
}
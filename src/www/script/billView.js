/**
 * Created by long.jiang on 2016/12/14.
 */
var orderId = "";
$(document).ready(function () {
    orderId = getURLQuery("orderId");
    getInvoke(constants.URLS.GETORDERBYORDERID.format(orderId), function (res) {
        if (res.succeeded && res.data != null) {
            var item = res.data;
            var tplLeaseInfo = $("#tplLeaseInfo").html();
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
            else if (item.orderState == "Overdue") {
                tipUrl = "images/20180103/Overdue.png";
                tipTitle = "已逾期";
                tipTitle1 = "实付日";
                tipTitle2 = "已逾期";
            }
            else if (item.orderState == "Canceled") {
                tipUrl = "images/20180103/Canceled.png";
                tipTitle = "已退租";
                tipTitle1 = "退租日";
                tipTitle2 = item.checkoutTime.substring(0, 10);
            }
            else {
                tipUrl = "images/20180103/Paid.png";
                tipTitle = "已完成";
                tipTitle1 = "实付时间";
                tipTitle2 = item.actualPaymentTime.substring(0, 16);
            }
            $("#imgOrderState").attr("src", tipUrl);
            document.getElementById("imgOrderState").onload = function () {
                $(".fang").show();
            };
            var htmlLeaseInfo = tplLeaseInfo.format(
                tipTitle,
                (item.totalAmount / 100).toFixed(2),
                getOrderType(item.orderType),
                (item.orderAmount / 100).toFixed(2),
                (item.depositAmount / 100).toFixed(2),
                (item.penaltyAmount / 100).toFixed(2),
                (item.serviceCharge / 100).toFixed(2),
                (item.propertyManagementAmount / 100).toFixed(2),
                item.paymentTime.substring(0, 10),
                tipTitle1,
                tipTitle2,
                item.orderState.toLowerCase());
            $("#divLeaseInfo").html(htmlLeaseInfo);
        }
    }, function (err) {
        mui.toast(err.message);
    });
});
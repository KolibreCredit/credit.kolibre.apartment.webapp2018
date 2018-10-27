/**
 * Created by long.jiang on 2016/12/14.
 */
var contractId = "";

function filterOrderState(orderState) {
    var state = "";
    if (orderState == "Created") {
        state = "待支付";
    }
    else if (orderState == "ApproachingOverdue") {
        state = "快到期";

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

$(document).ready(function () {
    contractId = getURLQuery("contractId");
    getInvoke(constants.URLS.GETCONTRACTDETAILS.format(contractId), function (res) {
        if (res.succeeded && res.data != null) {
            var orders = res.data.orders;
            var htmlOrderInfos = [];
            var tplOrderInfo = $("#tplOrderInfo").html();
            var order = null;
            var monthUrl = "";
            for (var i = 0; i < orders.length; i++) {
                order = orders[i];
                monthUrl = "images/months/{0}".format(moment(order.paymentTime).format('MM') + "s.png");
                htmlOrderInfos.push(tplOrderInfo.format(monthUrl, (order.orderType == "CustomDeposit" ? order.orderTypeName : getOrderType(order.orderType)),
                    (order.totalAmount / 100).toFixed(2),
                    order.orderState.toLowerCase(),
                    filterOrderState(order.orderState),
                    order.orderStartTime.substring(0, 10),
                    order.orderEndTime.substring(0, 10),
                    order.paymentTime.substring(0, 10)
                ));
            }
            $("#divOrderInfo").html(htmlOrderInfos.join(""));
        }
    }, function (err) {
        mui.toast(err.message);
    });
});
var currentTab = 0;

function selectTabToggle(index) {
    if (currentTab != index) {
        currentTab = index;
        $('.selectTable td').removeClass('active');
        $('.selectTable td:eq(' + index + ')').addClass('active');
        getSettlementOrders(index);
    }
}

function getSettlementOrders(index) {
    $('.nodataDiv').hide();
    var orderState = '';
    var nodataSpantext = '';
    if (index == 0) {
        orderState = 'NotSettle';
        nodataSpantext = '亲，暂无待退款信息';
    }
    else {
        orderState = 'Settle';
        nodataSpantext = '亲，暂无已退款信息';
    }
    $('#nodataSpan').html(nodataSpantext);
    getInvoke(constants.URLS.GETSETTLEMENTORDERS.format(orderState), function (res) {
        if (res.data == null || res.data.length == 0) {
            $('.billList').html("");
            $('.nodataDiv').show();
        }
        else {
            var billLists = res.data;
            var tplBill = $('#tplBill').html();
            var billHtmls = "";
            //
            var monthUrl = "";
            var lbTime = "";
            var totalAmount = "";
            var notPaidAmount = "";
            var item = null;
            var settlementTime = "";
            for (var i = 0; i < billLists.length; i++) {
                settlementTime = "";
                item = billLists[i];
                if (orderState == 'NotSettle') {
                    monthUrl = "images/months/{0}".format(moment(item.paymentTime).format('MM') + "s.png");
                    lbTime = '到期日：' + moment(item.orderEndTime).format('YYYY-MM-DD');
                    totalAmount = '¥' + (item.totalAmount / 100).toFixed(2);
                    notPaidAmount = (item.notPaidAmount / 100).toFixed(2);
                    settlementTime = "";
                }
                else {
                    monthUrl = "images/months/{0}".format(moment(item.paymentTime).format('MM') + ".png");
                    lbTime = '到期日：' + moment(item.orderEndTime).format('YYYY-MM-DD');
                    totalAmount = "";
                    notPaidAmount = (item.notPaidAmount / 100).toFixed(2);
                    settlementTime = "退款时间: " + item.settlementTime.substring(0,16);
                }
                billHtmls += tplBill.format(monthUrl, lbTime, item.roomNumber, (item.orderType == "CustomDeposit" ? item.orderTypeName : getOrderType(item.orderType)), item.apartmentName, totalAmount, notPaidAmount,settlementTime,orderState.toLowerCase());
            }
            $(".billList").html(billHtmls);
        }
    });
}

$(document).ready(function () {
    getSettlementOrders(0);
});

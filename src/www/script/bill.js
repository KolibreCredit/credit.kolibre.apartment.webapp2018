var currentTab = 0;

function selectTabToggle(index) {
    if (currentTab != index) {
        currentTab = index;
        $('.selectTable td').removeClass('active');
        $('.selectTable td:eq(' + index + ')').addClass('active');
        findAllLeaseOrder(index);
    }
}

function findAllLeaseOrder(index) {
    $('ul.billList').html('');
    $('.nodataDiv').hide();
    var orderState = '';
    var nodataSpantext = '';
    $('#addHouseBtn').hide();
    if (index == 0) {
        orderState = 'NotPaid';
        nodataSpantext = '亲，本期账单已支付完成';
    }
    else {
        orderState = 'Paid';
        nodataSpantext = '亲，您没有已完成账单';
    }
    $('#nodataSpan').html(nodataSpantext);
    getInvoke(constants.URLS.QUERYALLORDERS.format(orderState), function (res) {
        if (res.data.length == 0) {
            $('.billList').html("");
            $('.nodataDiv').show();
        }
        else {
            var billLists = res.data;
            var tplBill = $('#tplBill').html();
            var billHtmls = "";
            //
            var lbState = "";
            var lbTime = "";
            var lbOrderType = "";
            //
            var btnBillPay = "";
            var lbNotPay = "";
            var totalAmount = "";
            var notPaidAmount = "";
            var free = "";
            var imgRental = "";
            //
            var item = null;
            for (var i = 0; i < billLists.length; i++) {
                item = billLists[i];
                if (item.serviceCharge > 0) {
                    free = "含{0}元手续费".format((item.serviceCharge / 100).toFixed(2));
                }
                if (item.penaltyAmount > 0) {
                    free = "含{0}元违约金".format((item.penaltyAmount / 100).toFixed(2));
                }
                if (item.serviceCharge > 0 && item.penaltyAmount > 0) {
                    free = "含{0}元手续费、{1}元违约金".format((item.serviceCharge / 100).toFixed(2), (item.penaltyAmount / 100).toFixed(2));
                }
                //
                if (item.orderState == 'Created') {
                    lbState = '<span class="state {0}">未支付</span>'.format((item.isCurrent ? "created" : ""));
                    lbTime = '账单到期日：' + moment(item.paymentTime).format('YYYY-MM-DD');
                }
                else if (item.orderState == 'Overdue') {
                    lbState = '<span class="state overdue">已逾期</span>';
                    lbTime = '账单到期日：' + moment(item.paymentTime).format('YYYY-MM-DD');
                }
                else if (item.orderState == 'Canceled') {
                    lbState = '<span class="state">已取消</span>';
                    lbTime = '退租日期：' + moment(item.checkoutTime).format('YYYY-MM-DD');
                    imgRental = '<img src="images/leasetip1.png" style="width:65px;height:67px;position:absolute;bottom:0;right:0">'
                }
                else {
                    lbState = '<span class="state">已完成</span>';
                    lbTime = '实际支付时间：' + moment(item.actualPaymentTime).format('YYYY-MM-DD HH:mm');
                }
                if (item.orderState == "Paid" || item.orderState == "Canceled") {
                    totalAmount = "¥" + (item.totalAmount / 100).toFixed(2);
                    lbNotPay = "";
                    notPaidAmount = "";
                    btnBillPay = "";
                } else {
                    if (item.paidAmount == 0) {
                        totalAmount = "";
                    } else {
                        totalAmount = "¥" + (item.totalAmount / 100).toFixed(2);
                    }
                    notPaidAmount = "¥" + ((item.totalAmount - item.paidAmount) / 100).toFixed(2);
                    lbNotPay = "<span class='tip {0}'>待支付</span>".format((item.isCurrent ? 'active' : 'normal'));
                    btnBillPay = (item.isCurrent ? '<span class="billbtnPay btnActive" onclick="createTransaction(\'' + item.orderId + '\')">立即支付</span>' : '<span class="billbtnNotPay">立即支付</span>');
                }
                lbOrderType = '<img src="{0}" /><span>{1}&nbsp;&nbsp;{2}</span>'.format((item.isCurrent ? 'images/ic_bill_deposit.png' : 'images/ic_bill_normal.png'), getOrderType(item.orderType), totalAmount);
                if (free != "") {
                    free = "<p class='free'>{0}</p>".format(free);
                }
                billHtmls += tplBill.format(lbTime, lbState, lbOrderType, item.orderId, notPaidAmount, lbNotPay, btnBillPay, free, imgRental, 'item');
                free = "";
                imgRental = "";
            }
            $('.billList').html(billHtmls);
        }
    });
}

function createTransaction(orderId) {
    if (isWeixin()) {
        var redirect_uri = encodeURIComponent(constants.URLS.WEBPAYURL.format(orderId));
        window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + constants.CONFIGS.APPID + "&redirect_uri=" + redirect_uri + "&response_type=code&scope=snsapi_base#wechat_redirect";
    } else {
        window.location.href = constants.URLS.WEBPAYURL.format(orderId);
    }
}

function view(orderId) {
    window.location.href = "billView.html?orderId={0}".format(orderId);
}

$(document).ready(function () {
    findAllLeaseOrder(0);
});


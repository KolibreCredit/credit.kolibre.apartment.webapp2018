var openId = "";
var leaseId = "";

function findLeaseOrderByLeaseId() {
    $('ul.billList').html('');
    $('.nodataDiv').hide();
    getInvoke(constants.URLS.FINDLEASEORDERBYLEASEID.format(leaseId), function (res) {
        var billLists = res;
        if (!billLists || billLists.length == 0) {
            $('.billList').html("");
            $('.nodataDiv').show();
        }
        else {
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
                if (item.feeAmount > 0) {
                    free = "含{0}元手续费".format((item.feeAmount / 100).toFixed(2));
                }
                if (item.penaltyAmount > 0) {
                    free = "含{0}元违约金".format((item.penaltyAmount / 100).toFixed(2));
                }
                if (item.feeAmount > 0 && item.penaltyAmount > 0) {
                    free = "含{0}元手续费、{1}元违约金".format((item.feeAmount / 100).toFixed(2), (item.penaltyAmount / 100).toFixed(2));
                }
                //
                if (item.leaseOrderState == 'Created') {
                    lbState = '<span class="state {0}">未支付</span>'.format((item.isCurrent ? "created" : ""));
                    lbTime = '账单到期日：' + moment(item.paymentTime).format('YYYY-MM-DD');
                }
                else if (item.leaseOrderState == 'Overdue') {
                    lbState = '<span class="state overdue">已逾期</span>';
                    lbTime = '账单到期日：' + moment(item.paymentTime).format('YYYY-MM-DD');
                }
                else if (item.leaseOrderState == 'Canceled') {
                    lbState = '<span class="state">已取消</span>';
                    lbTime = '退租日期：' + moment(item.checkoutTime).format('YYYY-MM-DD');
                    imgRental = '<img src="images/leasetip1.png" style="width:65px;height:67px;position:absolute;bottom:0;right:0">'
                }
                else {
                    lbState = '<span class="state">已完成</span>';
                    lbTime = '实际支付时间：' + moment(item.actualPaymentTime).format('YYYY-MM-DD HH:mm');
                }
                if (item.leaseOrderState == "Finished" || item.leaseOrderState == "Canceled") {
                    totalAmount = (item.totalAmount / 100).toFixed(2).replace(/\B(?=(?:\d{3})+\b)/g, ',');
                    lbNotPay = "";
                    notPaidAmount = "";
                    btnBillPay = "";
                } else {
                    if (item.notPaidAmount == item.totalAmount) {
                        totalAmount = "";
                    } else {
                        totalAmount = (item.totalAmount / 100).toFixed(2).replace(/\B(?=(?:\d{3})+\b)/g, ',');
                    }
                    notPaidAmount = (item.notPaidAmount / 100).toFixed(2).replace(/\B(?=(?:\d{3})+\b)/g, ',');
                    lbNotPay = "<span class='tip {0}'>待支付</span>".format((item.isCurrent ? 'active' : 'normal'));
                    btnBillPay = (item.isCurrent ? '<span class="billbtnPay btnActive" onclick="leaseTransactionCreate(\'' + item.leaseOrderId + '\')">立即支付</span>' : '<span class="billbtnNotPay">立即支付</span>');
                }
                if (item.leaseOrderType == 'Deposit') {
                    lbOrderType = '<img src="{0}" /><span>押金 {1}</span>'.format((item.isCurrent ? 'images/ic_bill_deposit.png' : 'images/ic_bill_normal.png'), totalAmount);
                }
                else {
                    lbOrderType = '<img src="{0}" /><span>租金及物业费 {1}</span>'.format((item.isCurrent ? 'images/ic_bill_deposit.png' : 'images/ic_bill_normal.png'), totalAmount);
                }
                if (free != "") {
                    free = "<p class='free'>{0}</p>".format(free);
                }
                billHtmls += tplBill.format(lbTime, lbState, lbOrderType, item.leaseOrderNo, notPaidAmount, lbNotPay, btnBillPay, free, imgRental, 'item');
                free = "";
                imgRental = "";
            }
            $('.billList').html(billHtmls);
        }
    });
}

function leaseTransactionCreate(leaseOrderId) {
    if (isWeixin()) {
        window.location.href = constants.URLS.WEIXINPAY2.format(openId, leaseOrderId);
    } else {
        window.location.href = constants.URLS.WEBPAY.format(leaseOrderId);
    }
}

$(document).ready(function () {
    leaseId = getCookie(constants.COOKIES.LEASEID2);
    openId = getURLQuery("openId");
    findLeaseOrderByLeaseId();
    getInvoke(constants.URLS.WHETHERCONFIRMCONTRACTCHANGE, function (res) {
        if (res.data.operationCode == 1) {
            window.location.href = "verify2.html?url=" + encodeURIComponent(window.location.href);
        }
    });
});
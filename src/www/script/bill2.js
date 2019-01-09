var deviceId = "";
var billLists = null;

function findAllLeaseOrder(deviceId) {
    $('.billList').html('');
    $('.nodataDiv').hide();
    getInvoke(constants.URLS.GETENERGYMETERORDERS.format(deviceId), function (res) {
        if (res.succeeded && res.data.length > 0) {

            billLists = res.data;
            var tplBill = $('#tplBill').html();
            var billHtmls = "";
            //
            var monthUrl = "";
            var lbTime = "";
            var lbState = "";
            var lbStateClass = "";
            var treat = "<span class=\"treat\">{0}</span>";
            var stage = " <span class=\"stage\">{0}</span>";
            var lbTip = "";
            var lbTip2 = "";
            var totalAmount = "";
            var notPaidAmount = "";
            var free = "";
            var btnBillPay = "";
            var btnBillStage = "";
            var item = null;
            for (var i = 0; i < billLists.length; i++) {
                item = billLists[i];
                if (item.serviceCharge > 0) {
                    free = "(含{0}元手续费)".format((item.serviceCharge / 100).toFixed(2));
                }
                if (item.penaltyAmount > 0) {
                    free = "(含{0}元违约金)".format((item.penaltyAmount / 100).toFixed(2));
                }
                if (item.serviceCharge > 0 && item.penaltyAmount > 0) {
                    free = "(含{0}元手续费、{1}元违约金)".format((item.serviceCharge / 100).toFixed(2), (item.penaltyAmount / 100).toFixed(2));
                }
                if (item.orderState == 'Created') {
                    monthUrl = "images/months/{0}".format(moment(item.paymentTime).format('MM') + (item.isCurrent ? "s.png" : ".png"));
                    lbTime = '到期日：' + moment(item.paymentTime).format('YYYY-MM-DD');
                    lbState = (item.isCurrent ? "待支付" : "未支付");
                    lbStateClass = (item.isCurrent ? "Created" : "");
                    if (item.paidAmount == 0) {
                        totalAmount = "";
                        notPaidAmount = (item.totalAmount / 100).toFixed(2);
                    } else {
                        totalAmount = '¥' + (item.totalAmount / 100).toFixed(2);
                        notPaidAmount = ((item.totalAmount - item.paidAmount) / 100).toFixed(2);
                    }
                    lbTip = treat.format("待");
                    lbTip2 = (item.orderModel == "Staging" ? stage.format("分") : "");
                    btnBillPay = (item.isCurrent ? '<span class="billbtnPay btnActive" onclick="createTransaction(\'' + item.orderId + '\')">立即支付</span>' : '<span class="billbtnNotPay">立即支付</span>');
                }
                else if (item.orderState == 'ApproachingOverdue') {
                    monthUrl = "images/months/{0}".format(moment(item.paymentTime).format('MM') + "s.png");
                    lbTime = '到期日：' + moment(item.paymentTime).format('YYYY-MM-DD');
                    lbState = '快到期';
                    lbStateClass = "ApproachingOverdue";
                    if (item.paidAmount == 0) {
                        totalAmount = '';
                        notPaidAmount = (item.totalAmount / 100).toFixed(2);
                    } else {
                        totalAmount = '¥' + (item.totalAmount / 100).toFixed(2);
                        notPaidAmount = ((item.totalAmount - item.paidAmount) / 100).toFixed(2);
                    }
                    lbTip = treat.format("待");
                    lbTip2 = (item.orderModel == "Staging" ? stage.format("分") : "");
                    btnBillPay = '<span class="billbtnPay btnActive" onclick="createTransaction(\'' + item.orderId + '\')">立即支付</span>';
                }
                else if (item.orderState == 'Overdue' || item.orderState == 'BeDue') {
                    monthUrl = "images/months/{0}".format(moment(item.paymentTime).format('MM') + "s.png");
                    lbTime = '到期日：' + moment(item.paymentTime).format('YYYY-MM-DD');
                    lbState = (item.orderState == 'Overdue' ? '已逾期' : '已到期');
                    lbStateClass = "Overdue";
                    if (item.paidAmount == 0) {
                        totalAmount = "";
                        notPaidAmount = (item.totalAmount / 100).toFixed(2);
                    } else {
                        totalAmount = '¥' + (item.totalAmount / 100).toFixed(2);
                        notPaidAmount = ((item.totalAmount - item.paidAmount) / 100).toFixed(2);
                    }
                    lbTip = treat.format("待");
                    lbTip2 = (item.orderModel == "Staging" ? stage.format("分") : "");
                    btnBillPay = '<span class="billbtnPay btnActive" onclick="createTransaction(\'' + item.orderId + '\')">立即支付</span>';
                }
                else if (item.orderState == 'Canceled') {
                    monthUrl = "images/months/{0}".format(moment(item.checkoutTime).format('MM') + ".png");
                    lbTime = '退租日期：' + moment(item.checkoutTime).format('YYYY-MM-DD');
                    lbState = '已取消';
                    lbStateClass = "Canceled";
                    //
                    totalAmount = "";
                    notPaidAmount = (item.totalAmount / 100).toFixed(2);
                    lbTip = "";
                    lbTip2 = "";
                    //
                    btnBillPay = "";
                    btnBillStage = "";
                }
                else {
                    monthUrl = "images/months/{0}".format(moment(item.actualPaymentTime).format('MM') + "s.png");
                    lbTime = '支付时间：' + moment(item.actualPaymentTime).format('YYYY-MM-DD HH:mm');
                    lbState = '已支付';
                    lbStateClass = "paid";
                    //
                    totalAmount = "";
                    notPaidAmount = (item.totalAmount / 100).toFixed(2);
                    //
                    lbTip = "";
                    lbTip2 = (item.orderModel == "Staging" ? stage.format("分") : "");
                    btnBillPay = "";
                    btnBillStage = "";
                }
                if (item.canStage) {
                    btnBillStage = (item.isCurrent ? '<span class="billbtnStage" onclick="createStage(\'' + item.orderId + '\')">申请分期</span>' : '<span class="billbtnNotStage">申请分期</span>');
                } else {
                    btnBillStage = "";
                }
                billHtmls += tplBill.format(item.orderId, monthUrl, lbTime, lbState, lbStateClass.toLowerCase(), item.roomNumber, (item.orderType == "CustomDeposit" ? item.orderTypeName : getOrderType(item.orderType)), item.apartmentName, totalAmount, notPaidAmount, free, lbTip, lbTip2, btnBillStage + btnBillPay);
                free = "";
            }
            $('.billList').html(billHtmls);
        }
        else {
            $('.nodataDiv').css({"display": "flex"});
        }
    });
}

function createTransaction(orderId) {
    var isWxMini = window.__wxjs_environment === 'miniprogram';
    if (isWxMini) {
        wx.miniProgram.navigateTo({url: '/pages/bill/wxpay?orderId={0}&goto={1}&deviceId={2}'.format(orderId, "bill2", deviceId)});
    } else {
        setCookie(constants.COOKIES.DEVICEID, deviceId);
        var redirect_uri = encodeURIComponent(constants.URLS.WEBPAYURL.format(orderId, "bill2"));
        window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + constants.CONFIGS.APPID + "&redirect_uri=" + redirect_uri + "&response_type=code&scope=snsapi_base#wechat_redirect";
    }
}

function createStage(orderId) {
    window.location.href = "recognitionface.html?orderId={0}".format(orderId);
}

function view(orderId) {
    window.location.href = "billView.html?orderId={0}&goto=bill2&deviceId={1}".format(orderId,deviceId);
}

function confirmList() {
    window.location.href = "list.html";
}

function closeApply() {
    $(".msg-alert").hide();
}

$(document).ready(function () {
    deviceId = getURLQuery("deviceId");
    findAllLeaseOrder(deviceId);
});

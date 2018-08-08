/**
 * Created by long.jiang on 2017/6/21.
 */
var waitTimer = null;
var isTransaction = true;
var transactionId = "";
var amount = "";
//
var queryTransaction = function () {
    if (transactionId != "" && isTransaction) {
        isTransaction = false;
        getInvoke(constants.URLS.GETTRANSACTION.format(transactionId), function (res) {
            isTransaction = true;
            if (res.data.transactionState == "Succeed") {
                clearInterval(waitTimer);
                var isWxMini = window.__wxjs_environment === 'miniprogram';
                if (isWxMini) {
                    wx.miniProgram.navigateTo({url: '/pages/bill/bill'});
                } else {
                    window.location.href = "bill.html";
                }
            }
        });
    }
};

$(document).ready(function () {
    transactionId = getURLQuery("transactionId");
    amount = getURLQuery("amount");
    paymentTime = getURLQuery("paymentTime");
    $("#lbTotalAmount").html((amount / 100).toFixed(2));
    $("#lbPaymentTime").html(paymentTime);
    var pay = {
        transactionId: transactionId
    };
    postInvoke(constants.URLS.ORDERPAYMENT, pay, function (res) {
        if (res.succeeded) {
            $(".spinner").hide();
            $("#imgPay").attr("src", res.data.qrCode).show();
            waitTimer = setInterval(function () {
                queryTransaction();
            }, 2000);
        } else {
            mui.toast(res.message);
        }
    });
});
/**
 * Created by long.jiang on 2017/6/21.
 */
var waitTimer = null;
var transactionId = "";
var amount = "";
var goto = "";
//
var queryTransaction = function () {
    if (transactionId != "") {
        getInvoke(constants.URLS.GETTRANSACTION.format(transactionId), function (res) {
            if (res.data.transactionState == "Succeed") {
                clearInterval(waitTimer);
                if (goto.toUpperCase() == "MINIBILL") {
                    wx.miniProgram.navigateTo({url: '/pages/bill/bill'});
                }
                else if (goto.toUpperCase() == "WATERELECTRICITY") {
                    setCookie(constants.COOKIES.DEPOSIT, "");
                    window.location.href = "waterElectricity.html";
                }
                else if (goto.toUpperCase() == "BILL2") {
                    var deviceId = getCookie(constants.COOKIES.DEVICEID);
                    window.location.href = "bill2.html?deviceId={0}".format(deviceId);
                }
                else {
                    window.location.href = "bill.html";
                }
            }
        });
    }
};

$(document).ready(function () {
    goto = getURLQuery("goto") || "";
    transactionId = getURLQuery("transactionId");
    amount = getURLQuery("amount");
    paymentTime = getURLQuery("paymentTime");
    $("#lbTotalAmount").html((amount / 100).toFixed(2));
    $("#lbPaymentTime").html(paymentTime);
    var pay = {transactionId: transactionId};
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
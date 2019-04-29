/**
 * Created by long.jiang on 2017/6/21.
 */
var totalAmount = 0;
var amount = "";
var paymentTime = "";
//
var transactionId = "";
var orderModel = "";
var isTransaction = true;
var goto = "";
//
var validateAmount = function () {
    amount = $("#txtNotPaidAmount").val().replace(",", "");
    if (amount == "") {
        mui.toast("支付金额不能为空!");
        return false;
    }
    amount = parseInt((parseFloat(amount) * 100).toFixed());
    if (amount > totalAmount || amount == "0") {
        mui.toast("支付金额输入错误!");
        return false;
    }
    return true;
};

var createTransaction = function (transactionMethod, callSuccess) {
    if (!isTransaction) {
        mui.toast(constants.msgInfo.transaction);
        return false;
    }
    if (isTransaction && validateAmount()) {
        isTransaction = false;
        var data = {
            orderId: orderId,
            orderModel: orderModel,
            amount: amount,
            transactionCategory: "In",
            transactionMethod: transactionMethod,
            paymentSource: "Fengniaowu"
        };
        $("#lbTitle").html("正在提交...");
        $(".msg-post").show();
        postInvoke(constants.URLS.CREATETRANSACTION, data, function (res) {
            $(".msg-post").hide();
            if (res.succeeded) {
                callSuccess(res);
            } else {
                isTransaction = true;
                mui.toast(res.message);
            }
        }, function (err) {
            isTransaction = true;
            $(".msg-post").hide();
        });
    }
};

function zhifubao() {
    createTransaction("AliPay", function (res) {
        isTransaction = true;
        transactionId = res.data.transactionId;
        window.location.href = "precreate.html?transactionId={0}&amount={1}&paymentTime={2}&goto={3}".format(transactionId, amount, paymentTime.substring(0, 10), goto);
    });
}

//创建交易流水
var weixinpay = function () {
    createTransaction("WeiXin", function (res) {
        transactionId = res.data.transactionId;
        var code = getURLQuery("code");
        var user = {
            appId: constants.CONFIGS.APPID,
            code: code
        };
        postInvoke(constants.URLS.GETWECHATOPENID, user, function (res1) {
            if (res1.succeeded) {
                var pay = {
                    openId: res1.data,
                    transactionId: transactionId
                };
                postInvoke(constants.URLS.ORDERPAYMENT, pay, function (res2) {
                    if (res2.succeeded) {
                        WeixinJSBridge.invoke('getBrandWCPayRequest', {
                            "appId": res2.data.appId,
                            "timeStamp": res2.data.timeStamp,
                            "nonceStr": res2.data.nonceStr,
                            "package": res2.data.package,
                            "signType": res2.data.signType,
                            "paySign": res2.data.paySign
                        });
                        setInterval(function () {
                            queryTransaction();
                        }, 2000);
                    } else {
                        mui.toast(res2.message);
                    }
                });
            } else {
                mui.toast(res1.message);
            }
        });
    });
};

function weixin() {
    if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', weixinpay(), false);
        }
        else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', weixinpay());
            document.attachEvent('onWeixinJSBridgeReady', weixinpay());
        }
    }
    else {
        weixinpay();
    }
}

var queryTransaction = function () {
    if (transactionId != "") {
        getInvoke(constants.URLS.GETTRANSACTION.format(transactionId), function (res) {
            if (res.succeeded) {
                if (res.data.transactionState === "Succeed") {
                    isTransaction = true;
                    if (goto.toUpperCase() == "WATERELECTRICITY") {
                        window.location.href = "waterElectricity.html";
                    } else if (goto.toUpperCase() == "BILL2") {
                        var deviceId = getCookie(constants.COOKIES.DEVICEID);
                        window.location.href = "bill2.html?deviceId={0}".format(deviceId);
                    } else {
                        window.location.href = "bill.html";
                    }
                }
            }
        });
    }
};

var queryOrderbyOrderId = function () {
    $("#lbTitle").html(" 正在加载...");
    $(".msg-post").show();
    orderId = getURLQuery("orderId");
    getInvoke(constants.URLS.GETORDERBYORDERIDV2.format(orderId), function (res) {
        $(".msg-post").hide();
        if (res.succeeded) {
            paymentTime = res.data.paymentTime;
            totalAmount = res.data.totalAmount;
            orderModel = res.data.orderModel;
            $("#lbTotalAmount").html((res.data.totalAmount * 0.01).toFixed(2));
            $("#lbNotPaidAmount").html((res.data.repayAmount * 0.01).toFixed(2));
            $("#txtNotPaidAmount").val((res.data.repayAmount * 0.01).toFixed(2));
            if (res.serviceCharge > 0) {
                $("#lbFree").html((res.data.serviceCharge * 0.01).toFixed(2));
                $("#divFee").show();
            }
            if (res.penaltyAmount > 0) {
                $("#lbPenalty").html((res.data.penaltyAmount * 0.01).toFixed(2));
                $("#divPenalty").show();
            }
            if (res.paidAmount > 0) {
                $("#lbPaidAmount").html((res.data.paidAmount * 0.01).toFixed(2));
                $("#divPaidAmount").show();
            }
            $("#txtNotPaidAmount").focus();
        }
    }, function (err) {
        $(".msg-post").hide();
    });
};

$(document).ready(function () {
    goto = getURLQuery("goto");
    queryOrderbyOrderId();
});
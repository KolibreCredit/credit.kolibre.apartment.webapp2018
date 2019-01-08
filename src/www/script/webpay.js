/**
 * Created by long.jiang on 2017/6/21.
 */
var deposits = [];
var totalAmount = 0;
var amount = "";
var paymentTime = "";
//
var transactionId = "";
var orderModel = "";
var isTransaction = true;
var isPost = true;
var lastIndex = -1;
var isDeposit = false;
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

var validateAmount2 = function () {
    amount = $("#txtNotPaidAmount2").val().replace(",", "");
    if (amount == "") {
        mui.toast("充值金额不能为空!");
        return false;
    }
    amount = parseInt((parseFloat(amount) * 100).toFixed());
    if (amount == "0") {
        mui.toast("充值金额输入错误!");
        return false;
    }
    return true;
};

var createTransaction = function (transactionMethod, callSuccess) {
    if (isPost && validateAmount()) {
        var data = {
            orderId: orderId,
            orderModel: orderModel,
            amount: amount,
            transactionCategory: "In",
            transactionMethod: transactionMethod,
            paymentSource: "Fengniaowu"
        };
        isPost = false;
        isDeposit = false;
        $("#lbTitle").html(" 正在提交...");
        $(".msg-post").show();
        postInvoke(constants.URLS.CREATETRANSACTION, data, function (res) {
            isPost = true;
            $(".msg-post").hide();
            if (res.succeeded) {
                callSuccess(res);
            } else {
                mui.toast(res.message);
            }
        }, function (err) {
            isPost = true;
            $(".msg-post").hide();
        });
    }
};

var createTransaction2 = function (transactionMethod, callSuccess) {
    if (isPost && validateAmount2()) {
        var data = {
            deviceId: deposits[3],
            amount: amount,
            transactionMethod: transactionMethod
        };
        isPost = false;
        isDeposit = true;
        $("#lbTitle").html(" 正在提交...");
        $(".msg-post").show();
        postInvoke(constants.URLS.TENANTENERGYMETERRECHAGE, data, function (res) {
            isPost = true;
            $(".msg-post").hide();
            if (res.succeeded) {
                callSuccess(res);
            } else {
                mui.toast(res.message);
            }
        }, function (err) {
            isPost = true;
            $(".msg-post").hide();
        });
    }
};

function zhifubao() {
    createTransaction("AliPay", function (res) {
        transactionId = res.data.transactionId;
        window.location.href = "precreate.html?transactionId={0}&amount={1}&paymentTime={2}&deposit=0".format(transactionId, amount, paymentTime.substring(0, 10));
    });
}

function zhifubao2() {
    createTransaction2("AliPay", function (res) {
        transactionId = res.data.transactionId;
        window.location.href = "precreate.html?transactionId={0}&amount={1}&paymentTime={2}&deposit=1".format(transactionId, amount, paymentTime.substring(0, 10));
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

var weixinpay2 = function () {
    createTransaction2("WeiXin", function (res) {
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

function weixin2() {
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
        weixinpay2();
    }
}

var queryTransaction = function () {
    if (transactionId != "" && isTransaction) {
        isTransaction = false;
        getInvoke(constants.URLS.GETTRANSACTION.format(transactionId), function (res) {
            isTransaction = true;
            if (res.succeeded) {
                if (res.data.transactionState === "Succeed") {
                    if (isDeposit) {
                        setCookie(constants.COOKIES.DEPOSIT, "");
                        window.location.href = "waterElectricity.html";
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

var itemAmounts = [30, 50, 100, 200, 500, 100];

function itemSelect(index) {
    if (lastIndex != index) {
        lastIndex = index;
        $('.item').removeClass('active').eq(lastIndex).addClass('active');
        $("#txtNotPaidAmount2").val(itemAmounts[lastIndex]);
    }
}

$(document).ready(function () {
    if (getURLQuery("orderId").toUpperCase() == "X-KC-DEPOSIT") {
        document.title = "充值";
        $(".category").eq(1).show();
        deposits = decodeURI(getCookie(constants.COOKIES.DEPOSIT)).split("$");
        $("#lbApartmentName").html(deposits[0]);
        $("#lbRoomNumber").html(deposits[1]);
        $("#lbDeviceType").html(deposits[2]);
    } else {
        $(".category").eq(0).show();
        queryOrderbyOrderId();
    }
});
/**
 * Created by long.jiang on 2017/6/21.
 */
var deviceId = "";
var amount = "";
var paymentTime = new Date().format("yyyy-MM-dd");
//
var transactionId = "";
var isTransaction = true;
var isPost = true;
var lastIndex = -1;
//
var validateAmount = function () {
    amount = $("#txtNotPaidAmount").val().replace(",", "");
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
            deviceId: deviceId,
            amount: amount,
            transactionMethod: transactionMethod
        };
        isPost = false;
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
        window.location.href = "precreate.html?transactionId={0}&amount={1}&paymentTime={2}&goto=waterElectricity".format(transactionId, amount, paymentTime.substring(0, 10));
    });
}

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
    if (transactionId != "" && isTransaction) {
        isTransaction = false;
        getInvoke(constants.URLS.GETTRANSACTION.format(transactionId), function (res) {
            isTransaction = true;
            if (res.succeeded) {
                if (res.data.transactionState === "Succeed") {
                    setCookie(constants.COOKIES.DEPOSIT, "");
                    window.location.href = "waterElectricity.html";
                }
            }
        });
    }
};

var itemAmounts = [30, 50, 100, 200, 500, 1000];
function itemSelect(index) {
    if (lastIndex != index) {
        lastIndex = index;
        $('.item').removeClass('active').eq(lastIndex).addClass('active');
        $("#txtNotPaidAmount").val(itemAmounts[lastIndex]);
    }
}

$(document).ready(function () {
    var deposits = decodeURI(getCookie(constants.COOKIES.DEPOSIT)).split("$");
    $("#lbApartmentName").html(deposits[0]);
    $("#lbRoomNumber").html(deposits[1]);
    $("#lbDeviceType").html(deposits[2]);
    deviceId = deposits[3];
});
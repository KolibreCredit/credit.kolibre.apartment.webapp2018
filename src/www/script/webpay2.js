/**
 * Created by long.jiang on 2017/6/21.
 */
var deviceId = "";
var amount = "";
var paymentTime = new Date().format("yyyy-MM-dd");
//
var transactionId = "";
var isTransaction = true;
var lastIndex = -1;
var op = "";
//
var validateAmount = function () {
    if (op == "deposit") {
        amount = $("#txtNotPaidAmount").val().replace(",", "");
        if (amount == "") {
            mui.toast("充值金额不能为空!");
            return false;
        }
        if (parseFloat(amount) == 0) {
            mui.toast("充值金额输入不能为零!");
            return false;
        }
        if (parseFloat(amount) < 0) {
            mui.toast("支付金额不能小于零!");
            return false;
        }
        if (parseFloat(amount) > 100000) {
            mui.toast("支付金额不能大于10万!");
            return false;
        }
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
            deviceId: deviceId,
            amount: parseFloat(amount) * 100,
            transactionMethod: transactionMethod
        };
        $("#lbTitle").html(" 正在提交...");
        $(".msg-post").show();
        var apiUrl = (op == "waterElectricityPay" ? constants.URLS.ENERGYMETERUSAGEPAYMENT : constants.URLS.TENANTENERGYMETERRECHAGE);
        postInvoke(apiUrl, data, function (res) {
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
        window.location.href = "precreate.html?transactionId={0}&amount={1}&paymentTime={2}&goto=waterElectricity".format(transactionId, parseFloat(amount) * 100, paymentTime.substring(0, 10));
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
    if (transactionId != "") {
        getInvoke(constants.URLS.GETTRANSACTION.format(transactionId), function (res) {
            if (res.succeeded) {
                if (res.data.transactionState === "Succeed") {
                    isTransaction = true;
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
    if (deposits[0] == "waterElectricityPay") {
        op = deposits[0];
        deviceId = deposits[1];
        amount = deposits[2];
        $("#lbAmount").html(amount);
        $("#lbAmount1").html(amount);
        $(".pay").show();
    } else {
        $("#lbApartmentName").html(deposits[0]);
        $("#lbRoomNumber").html(deposits[1]);
        $("#lbDeviceType").html(deposits[2]);
        deviceId = deposits[3];
        $(".deposit").show();
    }
});
//
var getDeviceType = function (deviceType) {
    switch (deviceType) {
        case "elemeter":
            return "elemeter.png";
        case  "coldwatermeter":
            return "coldwatermeter.png";
        default:
            return "hotwatermeter.png";
    }
};

//
var getDeviceTypeDesc = function (deviceType) {
    switch (deviceType) {
        case "elemeter":
            return "电表";
        case  "coldwatermeter":
            return "冷水表";
        default:
            return "热水表";
    }
};

var getMeterState = function (meterState) {
    switch (meterState) {
        case "Offline":
            return "离线"
        case "SwitchOff":
            return "断电"
        case "LowEnergy":
            return "低电量"
        default:
            return "";
    }
};

function bill2(deviceId) {
    window.location.href = "bill2.html?deviceId={0}".format(deviceId);
}

function billTip(curTip) {
    var top = $(curTip).offset().top;
    var left = $(curTip).offset().left;
    $("#divBillTip").find("img").css({"left": (left - 26) + "px"});
    $("#divBillTip").css({"top": (top - 90) + "px"}).show();
    setTimeout(function () {
        $("#divBillTip").hide();
    }, 2000);
}

var billLists = null;

function findAllTenantEnergyMeters() {
    getInvoke(constants.URLS.GETTENANTENERGYMETERS, function (res) {
        if (res.succeeded && res.data.length > 0) {
            billLists = res.data;
            var tplApartmentItem = $("#tplApartmentItem").html();
            var tplBillItem = $('#tplBillItem').html();
            var billHtmls = "";
            //
            var item = null;
            var subItem = null;
            var itemBtnPay = "";
            var btnPay = "<span onclick=\"createTransaction('{0}')\" class=\"billbtnPay\">支付账单</span>";
            var btnDeposit = "<span onclick=\"deposit('{0}','{1}','{2}','{3}')\" class=\"billbtnDeposit\">余额充值</span>";
            var title11 = "", title12 = "", title13 = "";
            var title21 = "", title22 = "", title23 = "", title24 = "", title25 = "none", title26 = "";
            for (var i = 0; i < billLists.length; i++) {
                item = billLists[i];
                billHtmls += tplApartmentItem.format(item.apartmentName, item.roomNumber);
                for (var j = 0; j < item.roomDevices.length; j++) {
                    subItem = item.roomDevices[j];
                    if (subItem.chargeModel == "PrePayment") {
                        if (subItem.hasUnpaidOrder) {
                            itemBtnPay = btnPay.format(subItem.orderId);
                        } else {
                            itemBtnPay = btnDeposit.format(item.apartmentName, item.roomNumber, getDeviceTypeDesc(subItem.deviceType), subItem.deviceId);
                        }
                        title11 = getDeviceTypeDesc(subItem.deviceType) + "读数";
                        title12 = (subItem.meterState == "Offline" ? "暂无" : subItem.meterReading);
                        title13 = (subItem.deviceType == "elemeter" ? "度" : "吨");
                        //
                        title21 = "可用余额";
                        title22 = (subItem.balance / 100).toFixed(2);
                        title23 = "元";
                        title24 = (subItem.balance < 0 ? "#FF8C14" : "#000000");
                        title25 = "none";
                        title26 = "block";

                    } else {
                        title11 = "本期用量";
                        title12 = (subItem.meterState == "Offline" ? "暂无" : subItem.currentUsage);
                        title13 = (subItem.meterState == "Offline" ? "" : (subItem.deviceType == "elemeter" ? "度" : "吨"));

                        if (subItem.hasUnpaidOrder) {
                            itemBtnPay = btnPay.format(subItem.orderId);
                            title21 = "账单金额";
                            title22 = (subItem.orderAmount / 100).toFixed(2);
                            title23 = "元";
                            title24 = (subItem.orderAmount < 0 ? "#FF8C14" : "#000000");
                            title25 = "inline";
                            title26 = "block"
                        } else {
                            title21 = ""
                            title22 = "";
                            title23 = "";
                            title24 = "#000000";
                            title25 = "none"
                            title26 = "none"
                        }
                    }
                    //
                    billHtmls += tplBillItem.format(getDeviceType(subItem.deviceType)
                        , getDeviceTypeDesc(subItem.deviceType)
                        , (subItem.chargeModel == 'PrePayment' ? "预付费" : "后付费")
                        , (subItem.hasUnpaidOrder ? "inline" : "none")
                        , getMeterState(subItem.meterState), title11, title12, title13, title21, title22, title23, title24, title25, title26, subItem.deviceId, itemBtnPay, (j == item.roomDevices.length - 1 ? "none" : "block"));
                    itemBtnPay = "";
                }
            }
            $('.billList').html(billHtmls).show();
            $('.nodataDiv').hide();
        }
        else {
            $('.billList').html("").hide();
            $('.nodataDiv').css({"display": "flex"});
        }
    }, function (err) {
        mui.toast(err.message);
    });
}

function deposit(apartmentName, roomNumber, deviceType, deviceId) {
    var isWxMini = window.__wxjs_environment === 'miniprogram';
    if (isWxMini) {
        wx.miniProgram.navigateTo({url: '/pages/bill/wxpay2?apartmentName={0}&roomNumber={1}&deviceType={2}&deviceId={3}'.format(encodeURI(apartmentName), encodeURI(roomNumber), encodeURI(deviceType), encodeURI(deviceId))});
    } else {
        setCookie(constants.COOKIES.DEPOSIT, encodeURI(apartmentName + "$" + roomNumber + "$" + deviceType + "$" + deviceId));
        var redirect_uri = encodeURIComponent(constants.URLS.WEBPAYURL2);
        window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + constants.CONFIGS.APPID + "&redirect_uri=" + redirect_uri + "&response_type=code&scope=snsapi_base#wechat_redirect";
    }
}

function createTransaction(orderId) {
    var isWxMini = window.__wxjs_environment === 'miniprogram';
    if (isWxMini) {
        wx.miniProgram.navigateTo({url: '/pages/bill/wxpay?orderId={0}&goto={1}'.format(orderId, "waterElectricity")});
    } else {
        var redirect_uri = encodeURIComponent(constants.URLS.WEBPAYURL.format(orderId, "waterElectricity"));
        window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + constants.CONFIGS.APPID + "&redirect_uri=" + redirect_uri + "&response_type=code&scope=snsapi_base#wechat_redirect";
    }
}

$(document).ready(function () {
    findAllTenantEnergyMeters();
});

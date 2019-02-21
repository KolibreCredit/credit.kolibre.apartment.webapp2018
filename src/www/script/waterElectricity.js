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

var lastIndex = -1;
var billLists = null;
var tplApartmentItem = "";
var tplBillItem = "";
var btnPay = "<span onclick=\"createTransaction('{0}')\" class=\"billbtnPay\">支付账单</span>";
var btnDeposit = "<span onclick=\"deposit('{0}','{1}','{2}','{3}')\" class=\"billbtnDeposit\">余额充值</span>";
var swiper = null;

//
function hideApartments() {
    $(".apartments").hide();
}

//
function itemApartment(index) {
    $(".itemApartment").removeClass("active").eq(index).addClass('active');
    filterTenantEnergyMeters(index);
    $(".apartments").hide();
}

function filterRoomDevices(index) {
    var itemBtnPay = "";
    var online1 = "none", online2 = "none";
    var title11 = "", title12 = "", title13 = "";
    var title21 = "", title22 = "", title23 = "";
    var item = billLists[lastIndex];
    var subItem = item.roomDevices[index];
    if (subItem.chargeModel == "PrePayment") {
        if (subItem.hasUnpaidOrder) {
            itemBtnPay = btnPay.format(subItem.orderId);
        } else {
            itemBtnPay = btnDeposit.format(item.apartmentName, item.roomNumber, getDeviceTypeDesc(subItem.deviceType), subItem.deviceId);
        }
        if (subItem.online) {
            online1 = "block";
            title11 = getDeviceTypeDesc(subItem.deviceType) + "读数";
            title12 = (subItem.meterState == "Offline" ? "暂无" : subItem.meterReading);
            title13 = (subItem.deviceType == "elemeter" ? "度" : "吨");
        } else {
            online2 = "block";
        }
        title21 = "可用余额";
        title22 = (subItem.balance / 100).toFixed(2);
        title23 = "元";
    } else {
        if (subItem.online) {
            online1 = "block";
            title11 = "本期用量";
            title12 = (subItem.meterState == "Offline" ? "暂无" : subItem.currentUsage);
            title13 = (subItem.meterState == "Offline" ? "" : (subItem.deviceType == "elemeter" ? "度" : "吨"));
        } else {
            online2 = "block";
        }
        title21 = "账单金额";
        title22 = (subItem.orderAmount / 100).toFixed(2);
        title23 = "元";
        if (subItem.hasUnpaidOrder) {
            itemBtnPay = btnPay.format(subItem.orderId);
        }
    }
    //
    var billHtmls = tplBillItem.format(getDeviceTypeDesc(subItem.deviceType)
        , (subItem.chargeModel == 'PrePayment' ? "预付费" : "后付费")
        , subItem.chargeModel
        , getMeterState(subItem.meterState)
        , online1, online2, title11, title12, title13, (subItem.hasUnpaidOrder ? "inline" : "none")
        , title21, title22, title23
        , (subItem.chargeModel == 'PrePayment' ? "none" : "inline")
        , subItem.deviceId, itemBtnPay);

    $("#divCurDevice").html(billHtmls);
}

//
function filterTenantEnergyMeters(index) {
    if (lastIndex != index) {
        lastIndex = index;
        var item = billLists[index];
        var deviceCount = item.roomDevices.length;
        $("#lbApartmentName").html(item.apartmentName);
        $("#lbRoomNumber").html(item.roomNumber + '室');
        var itemDevice = null;
        var devicesHtmls = "";
        var tplItemDevices = "<div class='swiper-slide'><img src='images/20190219/{0}'/></div>";
        for (var j = 0; j < deviceCount; j++) {
            itemDevice = item.roomDevices[j];
            if (itemDevice.deviceType == "elemeter") {
                devicesHtmls += tplItemDevices.format(itemDevice.online ? "elemeter_active.png" : "elemeter.png");
            }
            else if (itemDevice.deviceType == "coldwatermeter") {
                devicesHtmls += tplItemDevices.format(itemDevice.online ? "coldwatermeter_active.png" : "coldwatermeter.png");
            }
            else {
                devicesHtmls += tplItemDevices.format(itemDevice.online ? "hotwatermeter_active.png" : "hotwatermeter.png");
            }
        }
        $(".swiper-wrapper").html(devicesHtmls);
        filterRoomDevices(0);
        $('.billList').show();
        setTimeout(function () {
            if (deviceCount > 5) {
                $(".swiper-pagination").show();
                swiper = new Swiper('.swiper-container', {
                    pagination: {
                        el: '.swiper-pagination',
                        dynamicBullets: true
                    },
                    observer: true,
                    on: {
                        transitionEnd: function () {
                            filterRoomDevices(this.realIndex);
                        }
                    }
                });
            }
            else if (deviceCount > 1 && deviceCount < 6) {
                $(".swiper-pagination").show();
                swiper = new Swiper('.swiper-container', {
                    pagination: {el: '.swiper-pagination'},
                    observer: true,
                    on: {
                        transitionEnd: function () {
                            filterRoomDevices(this.realIndex);
                        }
                    }
                });
            } else {
                swiper = new Swiper('.swiper-container', {
                    observer: true
                });
                $(".swiper-pagination").hide();
            }
        }, 10);
    }
}

function findAllTenantEnergyMeters() {
    getInvoke(constants.URLS.GETTENANTENERGYMETERS, function (res) {
        if (res.succeeded && res.data.length > 0) {
            tplApartmentItem = $("#tplApartmentItem").html();
            tplBillItem = $('#tplBillItem').html();
            billLists = res.data;
            filterTenantEnergyMeters(0);
            if (billLists.length > 1) {
                $(".moreApartments").show();
                var tplItemApartment = $("#tplItemApartment").html();
                var item = null;
                var apartmentHtmls = "";
                for (var i = 0; i < billLists.length; i++) {
                    item = billLists[i];
                    apartmentHtmls += tplItemApartment.format(item.apartmentName, item.roomNumber, i);
                }
                $("#divApartments").html(apartmentHtmls);
                $(".itemApartment").eq(0).addClass('active');
                $(".curApartment").bind("click", function () {
                    $(".apartments").show();
                });
            }
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

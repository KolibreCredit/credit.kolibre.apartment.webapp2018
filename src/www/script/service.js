/**
 * Created by long.jiang on 2016/8/31.
 */
String.prototype.format = function (args) {
    if (arguments.length > 0) {
        var result = this;
        var reg = null;
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                reg = new RegExp("({" + key + "})", "g");
                result = result.replace(reg, args[key]);
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] == undefined) {
                    arguments[i] = "";
                }
                reg = new RegExp("({)" + i + "(})", "g");
                result = result.replace(reg, arguments[i]);
            }
        }
        return result;
    }
    else {
        return this;
    }
};

String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
};

//author: meizz
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

Date.prototype.add = function (part, value) {
    value = value * 1;
    if (isNaN(value)) {
        value = 0;
    }
    switch (part) {
        case "y":
            return this.setFullYear(this.getFullYear() + value);
        case "m":
            return this.setMonth(this.getMonth() + value);
        case "d":
            return this.setDate(this.getDate() + value);
        case "h":
            return this.setHours(this.getHours() + value);
        case "n":
            return this.setMinutes(this.getMinutes() + value);
        case "s":
            return this.setSeconds(this.getSeconds() + value);
    }
};

function StringBuffer() {
    this.__strings__ = [];
};
StringBuffer.prototype.Append = function (str) {
    this.__strings__.push(str);
    return this;
};
//格式化字符串
StringBuffer.prototype.AppendFormat = function (str) {
    for (var i = 1; i < arguments.length; i++) {
        var parent = "\\{" + (i - 1) + "\\}";
        var reg = new RegExp(parent, "g")
        str = str.replace(reg, arguments[i]);
    }

    this.__strings__.push(str);
    return this;
}
StringBuffer.prototype.ToString = function () {
    return this.__strings__.join('');
};
StringBuffer.prototype.clear = function () {
    this.__strings__ = [];
}
StringBuffer.prototype.size = function () {
    return this.__strings__.length;
}

function validPhone(value) {
    if (value && !/^\d{0,13}$/g.test(value)) {
        return value.replace(/[^0-9]/ig, '');
    }
    return value;
}

function formatPhone(obj) {
    var value = validPhone(obj.value);
    value = value.replace(/\s*/g, "");
    var result = [];
    for (var i = 0; i < value.length; i++) {
        if (i == 3 || i == 7) {
            result.push(" " + value.charAt(i));
        } else {
            result.push(value.charAt(i));
        }
    }
    obj.value = result.join("");
}

function phoneFormat(cellphone) {
    var value = validPhone(cellphone);
    value = value.replace(/\s*/g, "");
    var result = [];
    for (var i = 0; i < value.length; i++) {
        if (i == 3 || i == 7) {
            result.push(" " + value.charAt(i));
        } else {
            result.push(value.charAt(i));
        }
    }
    return result.join("");
}

String.prototype.trimPhone = function () {
    var result = [];
    for (var i = 0; i < this.length; i++) {
        if (this.charAt(i) != " ") {
            result.push(this.charAt(i));
        }
    }
    return result.join("");
}

function replaceStr(str, start) {
    var res = '';
    var end = str.length;
    if (str.length > 10) {
        end = str.length - 3;
    }
    for (var i = 0; i < str.length; i++) {
        if (i >= start && i < end) {
            res += '*';
        }
        else {
            res += str[i];
        }
    }
    return res;
}

function getURLQuery(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURI(r[2]);
    } else {
        return "";
    }
}

function setCookie(key, auth) {
    document.cookie = key + '=' + auth + ';path=/;domain=.fengniaowu.com';
}

function getCookie(key) {
    var auth = '';
    var reg = new RegExp('(^| )' + key + '=([^;]*)(;|$)');
    var arrCookies = document.cookie.match(reg);
    if (arrCookies != null) {
        auth = arrCookies[2];
    }
    return auth;
}

function setToken(newToken) {
    if (newToken) {
        setCookie(constants.COOKIES.XKCSID, newToken);
    }
}

function getToken() {
    return getCookie(constants.COOKIES.XKCSID);
}

function clearToken() {
    setCookie(constants.COOKIES.XKCSID, '');
}

function isWeixin() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/micromessenger/i) == 'micromessenger') {
        return true;
    }
    return false;
}

function bill() {
    window.location.replace(constants.URLS.BILL);
}

function toApplys(nextStep) {
    window.location.href = constants.CONFIGS.APPLYS[nextStep];
}

function postInvoke(url, data, callSuccess, callError) {
    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        url: url,
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        beforeSend: function (request) {
            request.setRequestHeader(constants.COOKIES.XKCSID, getToken());
        },
        success: function (res) {
            if (res.code == 130078401) {
                var rurl = encodeURIComponent(window.location.href);
                window.location.href = constants.CONFIGS.LOGIN.replace('##rurl##', rurl);
            }
            else if (res.code == 130078500) {
                callSuccess({
                    succeeded: false,
                    message: "服务繁忙，请稍后！"
                });
            }
            else {
                callSuccess(res);
            }
        },
        error: function () {
            if (!callError({message: "服务繁忙，请稍后"})) {
                return false;
            }
        }
    });
}

function getInvoke(url, callSuccess, callError) {
    $.ajax({
        type: 'GET',
        url: url,
        dataType: "json",
        contentType: "application/json",
        beforeSend: function (request) {
            request.setRequestHeader(constants.COOKIES.XKCSID, getToken());
        },
        success: function (res) {
            if (res.code == 130078401) {
                var rurl = encodeURIComponent(window.location.href);
                window.location.href = constants.CONFIGS.LOGIN.replace('##rurl##', rurl);
            }
            else if (res.code == 130078500) {
                callSuccess({
                    succeeded: false,
                    message: "服务繁忙，请稍后！"
                });
            }
            else {
                callSuccess(res);
            }
        },
        error: function () {
            if (!callError({message: "服务繁忙，请稍后"})) {
                return false;
            }
        }
    });
}

function getInvoke2(url, callSuccess, callError) {
    $.ajax({
        type: 'GET',
        url: url,
        dataType: "json",
        contentType: "application/json",
        beforeSend: function (request) {
            request.setRequestHeader(constants.COOKIES.XKCSID, getToken());
        },
        success: function (res) {
            callSuccess(res);
        },
        error: function () {
            if (!callError({message: "服务繁忙，请稍后"})) {
                return false;
            }
        }
    });
}

function signInvoke(signUrl, callSuccess) {
    $.ajax({
        type: 'get',
        url: signUrl,
        contentType: 'application/json',
        success: function (res) {
            callSuccess(res);
        },
        error: function () {
            alert('获取认证异常');
        }
    });
}

var getOrderType = function (orderType) {
    switch (orderType) {
        case "HouseRental":
            return "房租金";
        case "HouseDeposit":
            return "房租押金";
        case "AccessCardDeposit":
            return "门禁卡押金";
        case "ParkDeposit":
            return "停车费押金";
        case "OtherDeposit":
            return "其他押金";
        case "TenementFee":
            return "物业费";
        case "HotWaterFee":
            return "热水费";
        case "ColdWaterFee":
            return "冷水费";
        case "ElectricityFee":
            return "电费";
        case "ParkFee":
            return "停车费";
        case "LaundryFee":
            return "洗衣费";
        case "CleaningFee":
            return "保洁费";
        case "BroadBandFee":
            return "宽带费";
        case  "GasFee":
            return "燃气费";
        case  "TelevisionFee":
            return "电视费";
        case "ServiceFee":
            return "服务费";
        case "OtherFee":
            return "其他费用";
        case "Reservation":
            return "预定金";
    }
};

var getPayPeriod = function (payPeriod) {
    var rentalType = "";
    if (payPeriod == 3) {
        rentalType = "季付";
    }
    else if (payPeriod == 6) {
        rentalType = "半年付";
    }
    else if (payPeriod == 12) {
        rentalType = "年付";
    }
    else if (payPeriod == 0) {
        rentalType = "全额付";
    }
    else if (payPeriod == 1) {
        rentalType = "月付";
    }
    return rentalType;
};

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

function clearToken() {
    setCookie(constants.COOKIES.AUTH, '');
}

function getAuth() {
    return getCookie(constants.COOKIES.AUTH);
}

function setAuth(newAuth) {
    if (newAuth) {
        setCookie(constants.COOKIES.AUTH, newAuth);
    }
}

function islogin() {
    var auth = getAuth();
    return (auth != '');
}

function isWeixin() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/micromessenger/i) == 'micromessenger') {
        return true;
    }
    return false;
}

function logSendCaptcha(op, cellphone, businessType) {
    getInvoke(constants.URLS.LOG.format(op, cellphone, businessType), function (res) {
        console.log(res);
    })
}

function postInvoke(url, data, callSuccess, callError) {
    var auth = getAuth();
    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        url: url,
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        beforeSend: function (request) {
            request.setRequestHeader(constants.COOKIES.AUTH, auth);
        },
        success: function (res, status, xhr) {
            callSuccess(res, status, xhr);
        },
        error: function (res) {
            if (res.status == 401) {
                var rurl = encodeURIComponent(window.location.href);
                if (getCookie(constants.COOKIES.TAG) == 'yuju') {
                    window.location.href = COMMONPATH.PAGE.LOGINV2.replace('##rurl##', rurl);
                }
                else if (getCookie(constants.COOKIES.TAG) == 'boke') {
                    window.location.href = COMMONPATH.PAGE.LOGINV2.replace('##rurl##', rurl);
                }
                else if (getCookie(constants.COOKIES.TAG) == 'kangdou') {
                    window.location.href = COMMONPATH.PAGE.LOGINV2.replace('##rurl##', rurl);
                }
                else if (getCookie(constants.COOKIES.TAG) == 'mozu') {
                    window.location.href = COMMONPATH.PAGE.LOGINV2.replace('##rurl##', rurl);
                }
                else {
                    window.location.href = COMMONPATH.PAGE.LOGIN.replace('##rurl##', rurl);
                }
            }
            else if (res.status == 400) {
                if (!callError({message: JSON.parse(res.responseText).message})) {
                    return false;
                }
            }
            else if (res.status == 0 || res.status == -1) {
                if (!callError({message: "网络链接异常，请稍后"})) {
                    return false;
                }
            } else if (res.status >= 500 && res.status <= 505) {
                if (!callError({message: "服务繁忙,请稍后"})) {
                    return false;
                }
            }
            else {
                if (!callError({message: "系统升级,请稍后" + res.status})) {
                    return false;
                }
            }
        }
    });
}

function getInvoke(url, callSuccess, callError) {
    var auth = getAuth();
    $.ajax({
        type: 'GET',
        url: url,
        dataType: "json",
        contentType: "application/json",
        beforeSend: function (request) {
            request.setRequestHeader(constants.COOKIES.AUTH, auth);
        },
        success: function (res, status, xhr) {
            callSuccess(res, status, xhr);
        },
        error: function (res) {
            if (res.status == 401) {
                var rurl = encodeURIComponent(window.location.href);
                if (getCookie(constants.COOKIES.TAG) == 'yuju') {
                    window.location.href = COMMONPATH.PAGE.LOGINV2.replace('##rurl##', rurl);
                }
                else if (getCookie(constants.COOKIES.TAG) == 'boke') {
                    window.location.href = COMMONPATH.PAGE.LOGINV2.replace('##rurl##', rurl);
                }
                else if (getCookie(constants.COOKIES.TAG) == 'kangdou') {
                    window.location.href = COMMONPATH.PAGE.LOGINV2.replace('##rurl##', rurl);
                }
                else if (getCookie(constants.COOKIES.TAG) == 'mozu') {
                    window.location.href = COMMONPATH.PAGE.LOGINV2.replace('##rurl##', rurl);
                }
                else {
                    window.location.href = COMMONPATH.PAGE.LOGIN.replace('##rurl##', rurl);
                }
            }
            else if (res.status == 400) {
                if (!callError({message: JSON.parse(res.responseText).message})) {
                    return false;
                }
            }
            else if (res.status == 0 || res.status == -1) {
                if (!callError({message: "网络链接异常，请稍后"})) {
                    return false;
                }
            } else if (res.status >= 500 && res.status <= 505) {
                if (!callError({message: "服务繁忙,请稍后"})) {
                    return false;
                }
            }
            else {
                if (!callError({message: "系统升级,请稍后" + res.status})) {
                    return false;
                }
            }
        }
    });
}
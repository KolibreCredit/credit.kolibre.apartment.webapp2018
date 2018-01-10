/**
 * Created by long.jiang on 2016/12/12.
 */
function tablogin(tabIndex) {
    if (tabIndex === 0) {
        $("#div0").show();
        $("#div1").hide();
        $("#lb0").css({"border-bottom": "2px solid #ff8c14", "color": "#ff8c14"});
        $("#lb1").css({"border-bottom": "2px solid #ffffff", "color": "#999999"});
    } else {
        $("#div0").hide();
        $("#div1").show();
        $("#lb0").css({"border-bottom": "2px solid #ffffff", "color": "#999999"});
        $("#lb1").css({"border-bottom": "2px solid #ff8c14", "color": "#ff8c14"});
    }
}

var waitTimer = null;
var waitCount = 60;
var isSendCaptcha = true;
var url = "";

function sendWaitTimer() {
    if (waitCount > 0) {
        $('#btnSendCaptcha').text(waitCount + 'S');
        waitCount = waitCount - 1;
    } else {
        clearInterval(waitTimer);
        $('#btnSendCaptcha').text('获取验证码');
        waitCount = 60;
        isSendCaptcha = true;
    }
}

function sendCaptcha() {
    if (isSendCaptcha) {
        var cellphone = $("#txtPhone2").val();
        if (cellphone == '') {
            mui.toast(constants.msgInfo.phone);
            return false;
        }
        if (!constants.REGEX.CELLPHONE.test(cellphone)) {
            mui.toast(constants.msgInfo.phoneerr);
            return false;
        }
        var businessType = "TenantLogin";
        var data = {
            cellphone: cellphone,
            businessType: businessType
        };
        isSendCaptcha = false;
        waitTimer = setInterval(function () {
            sendWaitTimer();
        }, 1000);
        postInvoke(constants.URLS.SEND, data, function (res) {
            if (res.succeeded) {
                mui.toast(constants.msgInfo.send);
            } else {
                waitCount = 0;
                mui.toast(res.message);
            }
        }, function (res) {
            waitCount = 0;
            mui.toast(res.message);
        });
    }
}

function showloading() {
    $(".msg-post").show();
}

function hideloading() {
    $(".msg-post").hide();
}

function loginByCaptcha() {
    var cellphone = $("#txtPhone2").val();
    if (cellphone == '') {
        mui.toast(constants.msgInfo.phone);
        return false;
    }
    if (!constants.REGEX.CELLPHONE.test(cellphone)) {
        mui.toast(constants.msgInfo.phoneerr);
        return false;
    }
    var captcha = $("#txtCaptcha").val();
    if (captcha == '') {
        mui.toast(constants.msgInfo.captcha);
        return false;
    }
    if (!constants.REGEX.CHECKCODE.test(captcha)) {
        mui.toast(constants.msgInfo.captchaerr);
        return false;
    }
    var verify = {
        cellphone: cellphone,
        businessType: "TenantLogin",
        validateCode: captcha
    };
    showloading();
    postInvoke(constants.URLS.VERIFY, verify, function (res) {
        hideloading();
        if (res.succeeded) {
            postInvoke(constants.URLS.LOGINAUTHCODE, {authCode: res.data.authCode}, function (res1) {
                if (res1.succeeded) {
                    if (res.data.loginState == "Succeed") {
                        setToken(res1.headers["x-KC-SID"]);
                        mui.toast(constants.msgInfo.loginSuccess);
                        retlogin();
                        // whetherConfirmContractChange();
                    }
                    else {
                        enumLoginState(res.data.loginState);
                    }
                } else {
                    mui.toast(res1.message);
                }
            }, function (err) {
                mui.toast(err.message);
            });
        } else {
            mui.toast(res.message);
        }
    }, function (err) {
        hideloading();
        mui.toast(err.message);
    });
}

function loginByPassword() {
    var cellphone = $("#txtPhone").val();
    if (cellphone == '') {
        mui.toast(constants.msgInfo.phone);
        return false;
    }
    if (!constants.REGEX.CELLPHONE.test(cellphone)) {
        mui.toast(constants.msgInfo.phoneerr);
        return false;
    }
    var password = $("#txtPassword").val();
    if (password == '') {
        mui.toast(constants.msgInfo.password);
        return false;
    }
    if (!constants.REGEX.PASSWORD.test(password)) {
        mui.toast(constants.msgInfo.passworderr);
        return false;
    }
    showloading();
    var data = {
        loginInfoAccount: cellphone,
        password: password
    };
    postInvoke(constants.URLS.LOGINBYPASSWORD, data, function (res) {
        hideloading();
        if (res.succeeded) {
            if (res.data.loginState == "Succeed") {
                setToken(res.headers["x-KC-SID"]);
                mui.toast(constants.msgInfo.loginSuccess);
                retlogin();
                // whetherConfirmContractChange();
            } else {
                enumLoginState(res.data.loginState);
            }
        } else {
            mui.toast(res.message);
        }
    }, function (res) {
        hideloading();
        mui.toast(res.message);
    });
}

var enumLoginState = function (loginState) {
    if (loginState == "PasswordError") {
        mui.toast(constants.msgInfo.loginErr1);
    }
    else if (loginState == "PasswordNotExist") {
        mui.toast(constants.msgInfo.loginErr2);
    }
    else if (loginState == "Locked") {
        mui.toast(constants.msgInfo.loginErr3);
    }
    else {
        mui.toast(constants.msgInfo.loginErr4);
    }
};

function whetherConfirmContractChange() {
    getInvoke(constants.URLS.WHETHERCONFIRMCONTRACTCHANGE, function (res) {
        if (res.data.operationCode == 1) {
            window.location.href = "verify.html?url=" + url;
        } else if (res.data.operationCode == 2) {
            window.location.href = "contractChange.html?url=" + url;
        } else {
            retlogin();
        }
    }, function () {
        retlogin();
    });
}

function retlogin() {
    setTimeout(function () {
        if (url != '') {
            if (url.indexOf("user.html") > -1) {
                window.location.href = "user.html";
            } else {
                window.location.href = decodeURIComponent(url);
            }
        } else {
            window.location.href = "index.html";
        }
    }, 1000);
}

$(document).ready(function () {
    url = getURLQuery("url");
});
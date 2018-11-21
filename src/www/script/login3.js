/**
 * Created by long.jiang on 2016/12/12.
 */
var url = "";

function showloading() {
    $(".msg-post").show();
}

function hideloading() {
    $(".msg-post").hide();
}

function loginByPassword() {
    var cellphone = $("#txtPhone").val().trimPhone();
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
                if (!res.data.tenantResponse.hasInfo) {
                    window.location.href = "verify.html?url={0}".format(url);
                }
                else if (!res.data.tenantResponse.confirmed) {
                    if (res.data.tenantResponse.canUpdate) {
                        window.location.href = "confirmTenant.html?url={0}".format(url);
                    } else {
                        window.location.href = "confirmTenant1.html?url={0}".format(url);
                    }
                } else {
                    retlogin();
                }
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

function retlogin() {
    setTimeout(function () {
        if (url != '') {
            window.location.replace(decodeURIComponent(url));
        } else {
            window.location.replace("index.html");
        }
    }, 1000);
}

function loginByCaptcha() {
    window.location.replace("login.html?url={0}".format(url));
}

$(document).ready(function () {
    url = getURLQuery("url");
});
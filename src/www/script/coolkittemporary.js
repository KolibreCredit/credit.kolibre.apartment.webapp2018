var deviceId = "";

function hideAlert() {
    setTimeout(function () {
        $("#divAlert").hide();
    }, 2000);
    setTimeout(function () {
        window.location.href = "coolkitgateLock.html";
    }, 2500);
}

function temporary() {
    var realName = $("#txtRealName").val();
    if (realName == '') {
        mui.toast(constants.msgInfo.realName);
        return false;
    }
    var cellphone = $("#txtCellphone").val();
    if (cellphone == '') {
        mui.toast(constants.msgInfo.phone);
        return false;
    }
    if (!constants.REGEX.CELLPHONE.test(cellphone)) {
        mui.toast(constants.msgInfo.phoneerr);
        return false;
    }
    $("#divAlert .msg-loading").show();
    $("#divAlert .msg-res").hide();
    $("#divAlert").show();
    getInvoke(constants.URLS.COOLKITSENDTEMPORARYPASSWORD.format(deviceId, realName, cellphone), function (res) {
        $("#divAlert .msg-loading").hide();
        if (res.succeeded) {
            $("#divAlert .icon").attr("src", "images/coolkit/succee.png");
            $("#divAlert .message1").html(language.getLangValue("10046", "授权成功"));
            $("#divAlert .message2").html(language.getLangValue("10047", "临时开锁密码已发送至用户手机"));
        } else {
            $("#divAlert .icon").attr("src", "images/coolkit/error.png");
            $("#divAlert .message1").html(language.getLangValue("10048", "授权失败"));
            $("#divAlert .message2").html(res.message);
        }
        $("#divAlert .msg-res").show();
        hideAlert();
    }, function (err) {
        $("#divAlert .msg-loading").hide();
        $("#divAlert .icon").attr("src", "images/coolkit/error.png");
        $("#divAlert .message1").html(language.getLangValue("10048", "授权失败"));
        $("#divAlert .message2").html(err.message);
        $("#divAlert .msg-res").show();
        hideAlert();
    });
}

$(document).ready(function () {
    deviceId = getURLQuery("deviceId");
    //
    language.init();
});
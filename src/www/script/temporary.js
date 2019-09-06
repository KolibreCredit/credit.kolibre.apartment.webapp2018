var deviceId = "";
var realName = "";
var cellphone = "";
var uesrInfo = null;
var coolkit = "";

function hideAlert() {
    $("#divAlert").hide();
    setTimeout(function () {
        window.location.href = "gateLock.html?coolkit=" + coolkit;
    }, 1000);
}

function temporary(index) {
    if (index == 1) {
        realName = uesrInfo.realName;
        cellphone = uesrInfo.cellphone;
    } else {
        realName = $("#txtRealName").val();
        if (realName == '') {
            mui.toast(constants.msgInfo.realName);
            return false;
        }
        cellphone = $("#txtCellphone").val();
        if (cellphone == '') {
            mui.toast("手机号为空!");
            return false;
        }
        if (!constants.REGEX.CELLPHONE.test(cellphone)) {
            mui.toast("手机号码格式错误");
            return false;
        }
    }
    $("#divAlert .msg-loading").show();
    $("#divAlert .msg-res").hide();
    $("#divAlert").show();
    setTimeout(function () {
        var apiUrl = (coolkit == "coolkit" ? constants.URLS.GETLOCKTEMPORARYPASSWORD : constants.URLS.GETLOCKTEMPORARYPASSWORD);
        getInvoke(apiUrl.format(deviceId, realName, cellphone), function (res) {
            $("#divAlert .msg-loading").hide();
            if (res.succeeded) {
                $("#divAlert .icon").attr("src", "images/20181224/tip4.png");
                $("#divAlert .message1").html("授权成功");
                $("#divAlert .message2").html((index == 1 ? "临时开锁密码已发送至用户手机" : "临时开锁密码已发送至用户手机"));
            } else {
                $("#divAlert .icon").attr("src", "images/20181224/tip3.png");
                $("#divAlert .message1").html("授权失败");
                $("#divAlert .message2").html(res.message);
            }
            $("#divAlert .msg-res").show();
        }, function (err) {
            $("#divAlert .msg-loading").hide();
            $("#divAlert .icon").attr("src", "images/20181224/tip3.png");
            $("#divAlert .message1").html("授权失败");
            $("#divAlert .message2").html(err.message);
            $("#divAlert .msg-res").show();
        });
    }, 1000);
}

$(document).ready(function () {
    coolkit = getCookie(constants.COOKIES.COOLKIT);
    deviceId = getURLQuery("deviceId");
    getInvoke(constants.URLS.GETCURRENTTENANT, function (res) {
        if (res.succeeded) {
            uesrInfo = res.data;
        }
    });
});
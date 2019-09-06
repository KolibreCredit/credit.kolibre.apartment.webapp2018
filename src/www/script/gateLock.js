var myLockDevices = null;
var mySwiper = null;
var deviceId = "";
var coolkit = "";

function showRemoteOpenLock() {
    $("#divAlert0").show();
}

function hideRemoteOpenLock() {
    $("#divAlert0").hide();
}

function remoteOpenLock() {
    $("#divAlert0").hide();
    $("#divLine").show();
    setTimeout(function () {
        var data = {
            deviceId: deviceId
        };
        postInvoke(constants.URLS.REMOTEOPENLOCK, data, function (res) {
            $("#divLine").hide();
            if (res.succeeded) {
                $("#imgOnline").attr("src", "images/20181224/Lock.png");
            }
            mui.toast(res.data);
        }, function (err) {
            $("#divLine").hide();
            mui.toast(err.message);
        });
    }, 1000);
}

function showAddLockPassword() {
    $("#divAlert1 .msg-res").hide();
    $("#divAlert1 .msg-loading").hide();
    $("#divAlert1 .msg-body").show();
    $("#divAlert1").show();
}

function hideAddLockPassword() {
    $("#divAlert1").hide();
}

function addLockPassword() {
    $("#divAlert1 .msg-body").hide();
    $("#divAlert1 .msg-res").hide();
    $("#divAlert1 .msg-loading").show();
    setTimeout(function () {
        var data = {
            deviceId: deviceId
        };
        postInvoke(constants.URLS.ADDLOCKPASSWORD, data, function (res) {
            $("#divAlert1 .msg-loading").hide();
            if (res.succeeded) {
                $("#divAlert1 .icon").attr("src", "images/20181224/tip4.png");
                $("#divAlert1 .message1").html("获取成功");
                $("#divAlert1 .message2").html("门锁密码已发送到您手机，请注意查收");
            } else {
                $("#divAlert1 .icon").attr("src", "images/20181224/tip3.png");
                $("#divAlert1 .message1").html("获取失败");
                $("#divAlert1 .message2").html("获取门锁密码失败，请稍后再试～");
            }
            $("#divAlert1 .msg-res").show();
        }, function (err) {
            $("#divAlert1 .msg-loading").hide();
            $("#divAlert1 .icon").attr("src", "images/20181224/tip3.png");
            $("#divAlert1 .message1").html("获取失败");
            $("#divAlert1 .message2").html("获取门锁密码失败，请稍后再试～");
            $("#divAlert1 .msg-res").show();
            mui.toast(err.message);
        });
    }, 1000);
}

function showSetLockPassword() {
    $("#divAlert3").show();
}

function hideSetLockPassword() {
    $("#divAlert3").hide();
}

function setLockPassword() {
    var password = "";
    var inputs = $("#divPassword>input");
    inputs.each(function () {
        password = password + $(this).val();
    });
    if (password == "") {
        mui.toast(constants.msgInfo.password);
        return false;
    }
    var arrPass = ["000000", "111111", "222222", "333333", "444444", "555555", "666666", "777777", "888888", "999999", "012345", "123456", "234567", "345678", "456789", "987654", "876543", "765432", "654321", "543210", "123123", "112233"];
    if (arrPass.indexOf(password) != -1) {
        mui.toast(constants.msgInfo.passwordsimple);
        return false;
    }
    var data = {
        deviceId: deviceId,
        password: password
    };
    postInvoke(constants.URLS.SETLOCKPASSWORD, data, function (res) {
        if (res.succeeded) {
            $("#divAlert3 ").hide();
            setTimeout(function () {
                $("#divAlert4").show();
            }, 200);
        } else {
            mui.toast(res.message);
        }
    }, function (err) {
        mui.toast(err.message);
    });
}

function temporary() {
    window.location.href = "temporary.html?deviceId={0}".format(deviceId);
}

function lockOpenRecords() {
    window.location.href = "lockOpenRecords.html?deviceId={0}".format(deviceId);
}

function lockPasswords() {
    window.location.href = "lockPasswords.html?deviceId={0}".format(deviceId);
}

var selectLockDevice = function (index) {
    var selectItem = myLockDevices[index];
    deviceId = selectItem.deviceId;
    $("#imgOnline").attr("src", (selectItem.online ? "images/20181224/Lock1.png" : "images/20181224/Lock0.png"));
    if (selectItem.canRemoteOpen) {
        $("#divRemoteOpenLock").show();
    } else {
        $("#divRemoteOpenLock").hide();
    }
    if (selectItem.supplier == "Coolkit") {
        $(".category .coolkit").show();
    } else {
        $(".category .coolkit").hide();
    }
    if (coolkit == "coolkit") {
        $("#divAddLockPassword").hide();
    } else {
        $("#divAddLockPassword").show();
    }
};

function shouContactUs() {
    $("#divAlert2").show();
}

function hideContactUs() {
    $("#divAlert2").hide();
}

function validateNum() {
    var value = event.target.value;
    if (/^\d{1}$/.test(value)) {
        return true;
    } else {
        event.target.value = value.substring(0, 1);
    }
}

$(document).ready(function () {
    coolkit = getURLQuery("coolkit") || "other";
    if (coolkit == "coolkit") {
        $('#divContactUs').css({"display": "inline"});
    } else {
        $('#divContactUs').css({"display": "none"});
    }
    setCookie(constants.COOKIES.COOLKIT, coolkit);
    var apiUrl = (coolkit == "coolkit" ? constants.URLS.GETCOOLKITLOCKS : constants.URLS.GETTENANTLOCKDEVICES);
    getInvoke(apiUrl, function (res) {
        if (res.succeeded && res.data.length > 0) {
            $(".gateLock").show();
            var item = null;
            var lockItems = [];
            var tplLockItem = $("#tplLockItem").html();
            myLockDevices = res.data;
            selectLockDevice(0);
            for (var i = 0; i < myLockDevices.length; i++) {
                item = myLockDevices[i];
                lockItems.push(tplLockItem.format(item.apartmentName, item.roomNumber, item.power));
            }
            $(".swiper-wrapper").html(lockItems.join(""));
            mySwiper = new Swiper('.swiper-container', {
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true
                },
                on: {
                    slideChange: function () {
                        selectLockDevice(mySwiper.activeIndex);
                    }
                }
            });
            $('.nodataDiv').hide();
        } else {
            $(".gateLock").hide();
            $('.nodataDiv').css({"display": "flex"});
        }
    }, function (err) {
        mui.toast(err.message);
    });
});
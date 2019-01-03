var myLockDevices = null;
var mySwiper = null;
var deviceId = "";

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

function temporary() {
    window.location.href = "temporary.html?deviceId={0}".format(deviceId);
}

function lockOpenRecords() {
    window.location.href = "lockOpenRecords.html?deviceId={0}".format(deviceId);
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
};

$(document).ready(function () {
    $('.nodataDiv').hide();
    getInvoke(constants.URLS.GETTENANTLOCKDEVICES, function (res) {
        if (res.succeeded && res.data.length > 0) {
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
        } else {
            $('.nodataDiv').css({"display": "flex"});
        }
    }, function (err) {
        mui.toast(err.message);
    });
});
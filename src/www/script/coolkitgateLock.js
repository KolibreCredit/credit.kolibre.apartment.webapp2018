var myLockDevices = null;
var mySwiper = null;
var deviceId = "";

function showSetLockPassword() {
    $("#divAlert3").show();
    $(".ipt-real-nick").val("");
    $('.ipt-active-nick').css('width', $(".ipt-fake-box input").eq(0).width() + 1 + 'px');
    $('.ipt-active-nick').css('left', '0px');
}

function hideSetLockPassword() {
    $("#divErrInfo").hide();
    $("#divAlert3").hide();
    var inputs = $(".ipts-box-nick input");
    inputs.each(function () {
        $(this).val("");
    });
}

function setLockPassword() {
    var password = "";
    var inputs = $(".ipts-box-nick input");
    inputs.each(function () {
        password = password + $(this).val();
    });
    if (password == "" || password.length != 6) {
        //mui.toast(constants.msgInfo.password);
        $("#divErrInfo").show().html(constants.msgInfo.password);
        return false;
    }
    if (!/^\d{6}$/.test(password)) {
        //mui.toast(constants.msgInfo.password6);
        $("#divErrInfo").show().html(constants.msgInfo.password6);
        return false;
    }
    var arrPass = ["000000", "111111", "222222", "333333", "444444", "555555", "666666", "777777", "888888", "999999", "012345", "123456", "234567", "345678", "456789", "987654", "876543", "765432", "654321", "543210", "123123", "112233"];
    if (arrPass.indexOf(password) != -1) {
        //mui.toast(constants.msgInfo.passwordsimple);
        $("#divErrInfo").show().html(constants.msgInfo.passwordsimple);
        return false;
    }
    var data = {
        deviceId: deviceId,
        password: password
    };
    postInvoke(constants.URLS.SETLOCKPASSWORD, data, function (res) {
        if (res.succeeded) {
            hideSetLockPassword();
            setTimeout(function () {
                $("#divAlert4").show();
            }, 1000);
            setTimeout(function () {
                $("#divAlert4").hide();
            }, 3000);
        } else {
            //mui.toast(res.message);
            $("#divErrInfo").show().html(res.message);
        }
    }, function (err) {
        //mui.toast(err.message);
        $("#divErrInfo").show().html(err.message);
    });
}

function temporary() {
    window.location.href = "coolkittemporary.html?deviceId={0}".format(deviceId);
}

function lockOpenRecords() {
    window.location.href = "coolkitlockOpenRecords.html?deviceId={0}".format(deviceId);
}

function lockPasswords() {
    window.location.href = "coolkitlockPasswords.html?deviceId={0}".format(deviceId);
}

var selectLockDevice = function (index) {
    var selectItem = myLockDevices[index];
    deviceId = selectItem.deviceId;
    $("#imgOnline").attr("src", (selectItem.online ? "images/coolkit/Lock1.png" : "images/coolkit/Lock0.png"));
    if (selectItem.canRemoteOpen) {
        $("#divRemoteOpenLock").show();
    } else {
        $("#divRemoteOpenLock").hide();
    }
};

function shouContactUs() {
    //$("#divAlert2").show();
    mui('#divContactUs').popover('show');
}

function hideContactUs() {
    //$("#divAlert2").hide();
    mui('#divContactUs').popover('hide');
}


function loginOut() {
    clearToken();
    window.location.replace("coolkit.html");
}

$(document).ready(function () {
    if (language.langValue == "cn") {
        $(".category").eq(0).show()
    } else {
        $(".category").eq(1).show()
    }
    getInvoke(constants.URLS.GETCOOLKITLOCKS, function (res) {
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
            if (lockItems.length == 1) {
                $(".swiper-pagination").hide();
            }
            $('.nodataDiv').hide();
        } else {
            $(".gateLock").hide();
            $('.nodataDiv').css({"display": "flex"});
        }
    }, function (err) {
        mui.toast(err.message);
    });
    //
    language.init();
});
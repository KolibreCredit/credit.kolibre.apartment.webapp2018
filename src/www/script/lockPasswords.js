var deviceId = "";
var passwordId = "";

function showDeletePassword(id) {
    passwordId = id;
    $("#divAlert").show();
}

function hideDeletePassword() {
    $("#divAlert").hide();
}

function deletePassword() {
    var data = {
        deviceId: deviceId,
        passwordId: passwordId
    };
    postInvoke(constants.URLS.DELETEPASSWORD, data, function (res) {
        if (res.succeeded) {
            setTimeout(function () {
                hideDeletePassword();
                getLockPasswords();
            }, 1000);
        } else {
            mui.toast(res.message);
        }
    }, function (err) {
        mui.toast(err.message);
    });
}

function getLockPasswords() {
    var apiUrl = constants.URLS.GETLOCKPASSWORDS;
    getInvoke(apiUrl.format(deviceId, 0, 200), function (res) {
        if (res.succeeded && res.data.length > 0) {
            var doorOpenRecords = res.data;
            var openRecords = [];
            var tplOpenRecord = $("#tplOpenRecord").html();
            var canDelete = "<span onclick=\"showDeletePassword('{0}')\">删除</span>";
            var deleting = "<span>删除中...</span>";
            ;
            var btnDelete = "";
            for (var i = 0; i < doorOpenRecords.length; i++) {
                item = doorOpenRecords[i];
                if (item.canDelete) {
                    btnDelete = canDelete.format(item.passwordId);
                }
                if (item.passwordState == "Deleting") {
                    btnDelete = deleting;
                }
                openRecords.push(tplOpenRecord.format("images/date.png",
                    item.passwordName,
                    btnDelete,
                    (item.passwordCategory == "Permanent" ? "永久有效" : ""),
                    (item.passwordCategory == "Permanent" ? "" : item.passwordBeginTime.substring(0, 16) + "～"),
                    (item.passwordCategory == "Permanent" ? item.createTime.substring(0, 16) : item.passwordEndTime.substring(0, 16))
                ));
                btnDelete = "";
            }
            $("#divOpenRecord").html(openRecords.join(""));
        } else {
            $('.nodataDiv').css({"display": "flex"});
        }
    }, function (err) {
        mui.toast(err.message);
    });
}

$(document).ready(function () {
    deviceId = getURLQuery("deviceId");
    getLockPasswords();
});
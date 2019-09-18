var deviceId = "";
var passwordId = "";

function showDeletePassword(passwordId) {
    this.passwordId = passwordId;
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
    getInvoke(constants.URLS.GETLOCKPASSWORDS.format(deviceId, 0, 200), function (res) {
        if (res.succeeded && res.data.length > 0) {
            var doorOpenRecords = res.data;
            var openRecords = [];
            var tplOpenRecord = $("#tplOpenRecord").html();
            var canDelete = "<img class='del' passwordId='{0}' src='images/coolkit/del.png'/>";
            var deleting = "<span>" + language.getLangValue("10044", "删除中") + "...</span>";
            var btnDelete = "";
            for (var i = 0; i < doorOpenRecords.length; i++) {
                item = doorOpenRecords[i];
                if (item.canDelete) {
                    btnDelete = canDelete.format(item.passwordId);
                }
                if (item.passwordState == "Deleting") {
                    btnDelete = deleting;
                }
                openRecords.push(tplOpenRecord.format("images/coolkit/m1.png",
                    item.passwordName,
                    btnDelete,
                    (item.passwordType == "TenantTempPassword" ? (item.shouquanrenXingming + " " + item.shouquanrenShoujihao) : ""),
                    (item.passwordCategory == "Permanent" ? language.getLangValue("10043", "永久有效") : item.passwordBeginTime.substring(2, 16) + "～"),
                    (item.passwordCategory == "Permanent" ? "" : "<label style='margin-left:0px'>" + item.passwordEndTime.substring(2, 16) + "</label>"),
                    (item.passwordCategory == "Permanent" ? "<span>" + item.createTime.substring(0, 16) + "</span>" : "")
                ));
                btnDelete = "";
            }
            $("#divOpenRecord .openRecord").html(openRecords.join(""));
            mui('#divOpenRecord').pullRefresh().endPulldownToRefresh();
            mui("#divOpenRecord").on("tap", ".del", function () {
                showDeletePassword($(this).attr("passwordId"));
            });
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
    //
    mui.init({
        pullRefresh: {
            container: '#divOpenRecord',
            down: {
                callback: getLockPasswords,
                contentinit: language.getLangValue("10092", '下拉可以刷新'),
                contentdown: language.getLangValue("10092", '下拉可以刷新'),
                contentover: language.getLangValue("10093", '释放立即刷新'),
                contentrefresh: language.getLangValue("10094", '正在刷新...')
            }
        }
    });
    language.init();
});
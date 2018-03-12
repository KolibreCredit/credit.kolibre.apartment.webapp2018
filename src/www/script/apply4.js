/**
 * Created by long.jiang on 2017/1/9.
 */
var accountCellphone = "";
var accountName = "";
//
var ispostData = true;

function apply() {
    if (!ispostData) {
        mui.toast(constants.msgInfo.postData);
        return false;
    }
    var realName = $("#txtRealName").val();
    if (!realName) {
        mui.toast(constants.msgInfo.linkRealName);
        return false;
    }
    if (accountName == realName) {
        mui.toast(constants.msgInfo.accountName.format(accountName));
        return false;
    }
    var cellphone = $("#txtCellphone").val();
    if (cellphone == '') {
        mui.toast(constants.msgInfo.linkCellphone);
        return false;
    }
    if (!constants.REGEX.CELLPHONE.test(cellphone)) {
        mui.toast(constants.msgInfo.phoneerr);
        return false;
    }
    if (accountCellphone == cellphone) {
        mui.toast(constants.msgInfo.accountCellphone.format(accountCellphone));
        return false;
    }
    var relationship = $("#txtRelation").val();
    if (relationship == '') {
        mui.toast(constants.msgInfo.linkRelationship);
        return false;
    }
    ispostData = false;
    $(".msg-post").show();
    var contractConfirmInfoId = getCookie(constants.COOKIES.CONTRACTCONFIRMINFOID);
    var data = {
        contractConfirmInfoId: contractConfirmInfoId,
        contactInfo: [{
            realName: realName,
            cellphone: cellphone,
            relationship: relationship
        }]
    };
    postInvoke(constants.URLS.UPDATECONTACTINFO, data, function (res) {
        if (res.succeeded) {
            mui.toast(constants.msgInfo.contactInfo);
            setTimeout(function () {
                window.location.href = "apply5.html";
            },2000);
        } else {
            ispostData = true;
            $(".msg-post").hide();
            mui.toast(res.message);
        }
    }, function (err) {
        ispostData = true;
        $(".msg-post").hide();
        mui.toast(err.message);
    });
}
//
$(document).ready(function () {
    getInvoke(constants.URLS.GETCURRENTTENANT, function (res) {
        if (res.succeeded) {
            accountCellphone = res.data.cellphone;
            accountName = res.data.realName;
        }
    });
});
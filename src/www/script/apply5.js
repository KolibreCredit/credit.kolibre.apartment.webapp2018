/**
 * Created by long.jiang on 2017/1/9.
 */
var ispostData = true;
var waitCount = 0;
var accountCellphone = "";
var accountName = "";
//
var contractConfirmInfoId = "";
var contractConfirmInfo = null;

var showMsg = function (icon, tip) {
    $(".msg-post").hide();
    $(".msg-icon").addClass(icon);
    $(".msg-tip").html(tip);
    $(".msg-content").show();
    setTimeout(function () {
        bill();
    }, 2000);
};

var showfail = function (message) {
    ispostData = false;
    showMsg("fail", "合同确认失败\<br/>联系客服:\<br/>400-921-5508<br/>{0}".format(message));
};

function getConfirmContractResult(confirmContractProcessId) {
    getInvoke(constants.URLS.GETCONFIRMCONTRACTRESULT.format(confirmContractProcessId), function (res) {
        if (res.succeeded) {
            if (res.data.confirmContractResult == "Success") {
                ispostData = false;
                showMsg("success", "申请月付成功");
            }
            else if (res.data.confirmContractResult == "Processing") {
                if (waitCount < 20) {
                    waitCount = waitCount + 1;
                    getConfirmContractResult(confirmContractProcessId);
                } else {
                    showfail(res.message);
                }
            } else {
                showfail(res.message);
            }
        } else {
            setTimeout(function () {
                getConfirmContractResult(confirmContractProcessId);
            }, 1000);
        }
    }, function (res) {
        showfail(res.message);
    });
}

function confirmcCntract() {
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
    if ($("#chkAgreement").attr("src").indexOf('check1.png') === -1) {
        mui.toast(constants.msgInfo.agreement3);
        return false;
    }
    ispostData = false;
    //
    $(".msg-post").show();
    postInvoke(constants.URLS.CONFIRMCONTRACT, contractConfirmInfo, function (res) {
        if (res.succeeded) {
            waitCount = 20;
            getConfirmContractResult(res.data.confirmContractProcessId);
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

$(document).ready(function () {
    contractConfirmInfoId = getCookie(constants.COOKIES.CONTRACTCONFIRMINFOID);
    getInvoke(constants.URLS.GETCONTRACTCONFIRMINFO.format(contractConfirmInfoId), function (res) {
        if (res.succeeded) {
            contractConfirmInfo = res.data;
            accountCellphone = contractConfirmInfo.cellphone;
            accountName = contractConfirmInfo.realName;
            $("#txtRealName").val(contractConfirmInfo.contactInfo.realName);
            $("#txtCellphone").val(contractConfirmInfo.contactInfo.cellphone);
            $("#txtRelation").val(contractConfirmInfo.contactInfo.relationship);
            //
            new Swiper('#swipercontainer1', {
                slidesPerView: 1.4,
                spaceBetween: 10,
                freeMode: true
            });
            new Swiper('#swipercontainer2', {
                slidesPerView: 2,
                spaceBetween: 10,
                freeMode: true
            });
        }
    });
});
/**
 * Created by long.jiang on 2017/1/9.
 */
var ispostData = true;
var waitCount = 0;
var waitCount2 = 0;
var accountCellphone = "";
var accountName = "";

var showMsg = function (icon, tip) {
    $(".msg-post").hide();
    $(".msg-icon").addClass(icon);
    $(".msg-tip").html(tip);
    $(".msg-content").show();
    setTimeout(function () {
        window.location.href = constants.URLS.WEIXIBILL;
    }, 2000);
};

var showfail = function (message) {
    ispostData = false;
    showMsg("fail", "申请月付失败\<br/>联系客服:\<br/>400-921-5508<br/>{0}".format(message));
};

var retryResult = function (apartmentReportId) {
    waitCount2 = waitCount2 + 1;
    setTimeout(function () {
        getCreditAuditResult(apartmentReportId);
    }, 3000);
};

function getCreditAuditResult(apartmentReportId) {
    getInvoke(constants.URLS.GETCREDITAUDITRESULT.format(apartmentReportId), function (res) {
        if (res.succeeded) {
            if (res.data.auditResult === "Pass") {
                ispostData = false;
                showMsg("success", "申请月付成功");
            }
            else if (res.data.auditResult === "Observing") {
                ispostData = false;
                showMsg("success", "申请月付成功");
            }
            else if (res.data.auditResult === "Refuse") {
                showfail(res.message);
            } else {
                if (waitCount2 < 20) {
                    retryResult(apartmentReportId);
                } else {
                    showfail(res.message);
                }
            }
        } else {
            if (waitCount2 < 20) {
                retryResult(apartmentReportId);
            } else {
                showfail(res.message);
            }
        }
    }, function (res) {
        showfail(res.message);
    });
}

function createApartmentReport(apartmentReport) {
    postInvoke(constants.URLS.CREATEAPARTMENTREPORT, apartmentReport, function (res) {
        if (res.succeeded) {
            setCookie(constants.COOKIES.YUEFU, "");
            if (res.data.productMark == 2) {
                setTimeout(function () {
                    showMsg("success", "已生成账单");
                }, 2000);
            }
            else {
                getCreditAuditResult(res.data.apartmentReportId);
            }
        } else {
            waitCount = waitCount + 1;
            if (waitCount < 3) {
                setTimeout(function () {
                    createApartmentReport(apartmentReport);
                }, 2000);
            } else {
                showfail(res.message);
            }
        }
    }, function (res) {
        showfail(res.message);
    });
}

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
    if ($("#chkAgreement").attr("src").indexOf('check1.png') === -1) {
        mui.toast(constants.msgInfo.agreement3);
        return false;
    }
    ispostData = false;
    //
    $(".msg-post").show();
    postInvoke(constants.URLS.CREATEDIGITALCONTRACT, {
        leaseId: getCookie(constants.COOKIES.LEASEID),
        contractTypeName: ['BJBLoan', 'BJBAuth']
    }, function (res) {
        console.log(res);
    });
    //
    var accountExtensionInfoId = getCookie(constants.COOKIES.ACCOUNTEXTENSIONINFOID);
    var data = {
        accountExtensionInfoId: accountExtensionInfoId,
        contacts: [{
            realName: realName,
            cellphone: cellphone,
            relationship: relationship
        }]
    };
    postInvoke(constants.URLS.ADDCONTACTINFO, data, function (res) {
        if (res.succeeded) {
            var leaseId = getCookie(constants.COOKIES.LEASEID);
            var reportId = getCookie(constants.COOKIES.REPORTID);
            var batchId = getCookie(constants.COOKIES.BATCHID);
            var yuefu = (getCookie(constants.COOKIES.YUEFU) == "true" ? true : false);
            var apartmentReport = {
                accountExtensionInfoId: accountExtensionInfoId,
                leaseId: leaseId,
                reportId: reportId,
                batchId: batchId,
                yueFu: yuefu
            };
            createApartmentReport(apartmentReport);
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

function agreement(curImg) {
    if (curImg.src.indexOf("check1.png") != -1) {
        curImg.src = "images/check0.png";
    } else {
        curImg.src = "images/check1.png";
    }
}

$(document).ready(function () {
    getInvoke(constants.URLS.GETCURRENTHOUSEACCOUNTINFO, function (res) {
        accountCellphone = res.cellphone;
        accountName = res.realName;
    });
});
/**
 * Created by long.jiang on 2017/1/9.
 */
var ispostData = true;
var waitCount = 0;
//
var contractConfirmInfoId = "";
var contractConfirmInfo = null;
var imgIndex = -1;

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
                showMsg("success", "合同确认成功");
            }
            else if (res.data.confirmContractResult == "Processing") {
                if (waitCount < 20) {
                    waitCount = waitCount + 1;
                    setTimeout(function () {
                        getConfirmContractResult(confirmContractProcessId);
                    }, 1000);
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

function showNext() {
    $(".step0").hide();
    $(".step1").show();
    new Swiper('#swipercontainer1', {
        slidesPerView: 1.2,
        spaceBetween: 10,
        freeMode: true
    });
}

var realName = "";
var cellphone = "";
var relationship = "";

//
function confirmcCntract0() {
    realName = $("#txtRealName").val();
    if (!realName) {
        mui.toast(constants.msgInfo.linkRealName);
        return false;
    }
    if (realName == contractConfirmInfo.realName) {
        mui.toast(constants.msgInfo.accountName.format(realName));
        return false;
    }
    cellphone = $("#txtCellphone").val();
    if (cellphone == '') {
        mui.toast(constants.msgInfo.linkCellphone);
        return false;
    }
    if (!constants.REGEX.CELLPHONE.test(cellphone)) {
        mui.toast(constants.msgInfo.phoneerr);
        return false;
    }
    if (cellphone == contractConfirmInfo.cellphone) {
        mui.toast(constants.msgInfo.accountCellphone.format(cellphone));
        return false;
    }
    relationship = $("#txtRelation").val();
    if (relationship == '') {
        mui.toast(constants.msgInfo.linkRelationship);
        return false;
    }
    contractConfirmInfo.contactInfo = [{
        realName: realName,
        cellphone: cellphone,
        relationship: relationship
    }];
    $(".step0").show();
    $(".step1").hide();
}

function confirmcCntract1() {
    if (!ispostData) {
        mui.toast(constants.msgInfo.postData);
        return false;
    }
    ispostData = false;
    $(".msg-post").show();
    postInvoke(constants.URLS.CONFIRMCONTRACT, contractConfirmInfo, function (res) {
        if (res.succeeded) {
            waitCount = 1;
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

//
function chooseImage(index) {
    imgIndex = index;
    document.getElementById("imgChoose").click();
}

var kinds = ["IDCardFace", "IDCardBack", "Selfie"];

function V2UploadImages(serverId) {
    var data = {
        serverId: serverId,
        kind: kinds[imgIndex],
        index: imgIndex
    };
    postInvoke(constants.URLS.UPLOADIMAGESWEIXIN, data, function (res) {
        if (res.succeeded) {
            if (res.data.index == 0) {
                contractConfirmInfo.credentialFacePhoto = res.data.url;
                $("#imgCredentialFacePhoto").attr("src", contractConfirmInfo.credentialFacePhoto);
            }
            else if (res.data.index == 1) {
                contractConfirmInfo.credentialBackPhoto = res.data.url;
                $("#imgCredentialBackPhoto").attr("src", contractConfirmInfo.credentialBackPhoto);
            }
            else {
                contractConfirmInfo.selfiePhoto = res.data.url;
                $("#imgSelfiePhoto").attr("src", contractConfirmInfo.selfiePhoto);
            }
        }
    });
}

var contractRenderHtmlTemplate = function (contractId) {
    postInvoke(constants.URLS.RENDERHTMLTEMPLATE, {contractId: contractId}, function (res) {
        $("#divRenderHtmlTemplate").html(res.data);
    });
};

$(document).ready(function () {
    contractConfirmInfoId = getCookie(constants.COOKIES.CONTRACTCONFIRMINFOID);
    getInvoke(constants.URLS.GETCONTRACTCONFIRMINFO.format(contractConfirmInfoId), function (res) {
        if (res.succeeded) {
            contractConfirmInfo = res.data;
            contractRenderHtmlTemplate(contractConfirmInfo.contractId);
            $("#lbRealName").text(contractConfirmInfo.realName);
            $("#lbCellphone").text(contractConfirmInfo.cellphone);
            $("#lbCredentialNo").text(contractConfirmInfo.credentialNo);
            //
            $("#txtRealName").val(contractConfirmInfo.contactInfo[0].realName);
            $("#txtCellphone").val(contractConfirmInfo.contactInfo[0].cellphone);
            $("#txtRelation").val(contractConfirmInfo.contactInfo[0].relationship);
            //
            $("#imgCredentialFacePhoto").attr("src", contractConfirmInfo.credentialFacePhoto);
            $("#lbCredentialFacePhoto").text((contractConfirmInfo.credentialType == "IDCard" ? "身份证正面" : "护照个人信息页"));
            //
            $("#imgCredentialBackPhoto").attr("src", contractConfirmInfo.credentialBackPhoto);
            $("#lbCredentialBackPhoto").text((contractConfirmInfo.credentialType == "IDCard" ? "身份证背面" : "护照签证信息页"));
            //
            if (contractConfirmInfo.selfiePhoto != null) {
                $("#imgSelfiePhoto").attr("src", contractConfirmInfo.selfiePhoto);
            } else {
                $("#imgSelfiePhoto").attr("src", (contractConfirmInfo.credentialType == "IDCard" ? "images/sfz3-2.png" : "images/hz3-2.png"));
            }
        }
    });
    //
    var signUrl = constants.URLS.SIGNATURE.format(encodeURIComponent(window.location.href.split("?")[0]));
    signInvoke(signUrl, function (res) {
        wx.config({
            debug: false,
            appId: res.data.appId,
            timestamp: res.data.timestamp,
            nonceStr: res.data.nonceStr,
            signature: res.data.signature,
            jsApiList: ['checkJsApi', 'chooseImage', 'uploadImage']
        });
        //
        document.querySelector('#imgChoose').onclick = function () {
            wx.chooseImage({
                count: 1,
                sizeType: ['original'],
                sourceType: ['album', 'camera'],
                success: function (res) {
                    wx.uploadImage({
                        localId: res.localIds[0],
                        isShowProgressTips: 1,
                        success: function (res1) {
                            V2UploadImages(res1.serverId);
                        }
                    });
                }
            });
        };
    });
});
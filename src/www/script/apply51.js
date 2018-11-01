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
                if (res.data.canStage) {
                    window.location.href = "contractResults.html?contractId={0}".format(res.data.contractId);
                } else {
                    showMsg("success", "合同确认成功");
                }
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

function agreement() {
    window.location.href = "agreement.html?hasPaper=0";
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
            $(".picture").eq(res.data.index).css({"border": "2px solid #fcfcfc"});
            $(".camera").eq(res.data.index).hide();
            $(".choose").eq(res.data.index).show();
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
            if (contractConfirmInfo.credentialType == "IDCard") {
                $("#lbCredentialFacePhoto").text("身份证头像面");
                $("#lbCredentialBackPhoto").text("身份证国徽面");
            } else if (contractConfirmInfo.credentialType == "Passport") {
                $("#lbCredentialFacePhoto").text("护照头像信息页");
                $("#lbCredentialBackPhoto").text("护照居留许可页");
            } else if (contractConfirmInfo.credentialType == "TaiwanPermit") {
                $("#lbCredentialFacePhoto").text("台胞证正面");
                $("#lbCredentialBackPhoto").text("台胞证反面");
            } else if (contractConfirmInfo.credentialType == "HongKongMacao") {
                $("#lbCredentialFacePhoto").text("港澳通行证正面");
                $("#lbCredentialBackPhoto").text("港澳通行证反面");
            } else {
                $("#lbCredentialFacePhoto").text("其他证件正面");
                $("#lbCredentialBackPhoto").text("其他证件反面");
            }
            //
            if (contractConfirmInfo.credentialFacePhoto != null) {
                $("#imgCredentialFacePhoto").attr("src", contractConfirmInfo.credentialFacePhoto);
            } else {
                $(".picture").eq(0).css({"border": "2px dotted #fd8b14"});
                $(".camera").eq(0).show();
                $(".choose").eq(0).hide();
                if (contractConfirmInfo.credentialType == "IDCard") {
                    $("#imgCredentialFacePhoto").attr("src", "images/photo/sfz1.png");
                } else if (contractConfirmInfo.credentialType == "Passport") {
                    $("#imgCredentialFacePhoto").attr("src", "images/photo/hz1.png");
                } else {
                    $("#imgCredentialFacePhoto").attr("src", "images/photo/other1.png");
                }
            }
            //
            if (contractConfirmInfo.credentialBackPhoto != null) {
                $("#imgCredentialBackPhoto").attr("src", contractConfirmInfo.credentialBackPhoto);
            }
            else {
                $(".picture").eq(1).css({"border": "2px dotted #fd8b14"});
                $(".camera").eq(1).show();
                $(".choose").eq(1).hide();
                if (contractConfirmInfo.credentialType == "IDCard") {
                    $("#imgCredentialBackPhoto").attr("src", "images/photo/sfz2.png");
                } else if (contractConfirmInfo.credentialType == "Passport") {
                    $("#imgCredentialBackPhoto").attr("src", "images/photo/hz2.png");
                } else {
                    $("#imgCredentialBackPhoto").attr("src", "images/photo/other2.png");
                }
            }
            //
            if (contractConfirmInfo.selfiePhoto != null) {
                $("#imgSelfiePhoto").attr("src", contractConfirmInfo.selfiePhoto);
            } else {
                $(".picture").eq(2).css({"border": "2px dotted #fd8b14"});
                $(".camera").eq(2).show();
                $(".choose").eq(2).hide();
                if (contractConfirmInfo.credentialType == "IDCard") {
                    $("#imgSelfiePhoto").attr("src", "images/photo/sfz3.png");
                } else if (contractConfirmInfo.credentialType == "Passport") {
                    $("#imgSelfiePhoto").attr("src", "images/photo/hz3.png");
                } else {
                    $("#imgSelfiePhoto").attr("src", "images/photo/other3.png");
                }
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
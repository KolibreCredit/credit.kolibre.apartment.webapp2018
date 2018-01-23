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
    contractConfirmInfo.contactInfo = {
        realName: realName,
        cellphone: cellphone,
        relationship: relationship
    };
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
    document.getElementById("imgChoose1").click();
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


function showChooseImages() {
    $("#imgAdd").show();
    $("#imgChoose").show();
}

var mySwiper = null;

function V2UploadImages2(serverId) {
    var data = {
        serverId: serverId,
        kind: "Contract",
        index: mySwiper.realIndex
    };
    postInvoke(constants.URLS.UPLOADIMAGESWEIXIN, data, function (res) {
        if (res.succeeded) {
            contractConfirmInfo.contractPictures[res.data.index] = res.data.url;
            $("#swipercontainer2 .contract").eq(res.data.index).attr("src", res.data.url);
        }
    });
}

var contractPictures = function (contractPictures, total) {
    $("#swipercontainer2 .swiper-wrapper").append(contractPictures);
    $("#lbPage").text(total);
    if (mySwiper == null) {
        mySwiper = new Swiper('#swipercontainer2', {
            roundLengths: true,
            slidesPerView: "auto",
            centeredSlides: true,
            followFinger: false
        });
    } else {
        mySwiper.updateSlides();
    }
};
//
var tplContractPicture = "";
var itemContractPictures = "";

function V2UploadImages3(serverId) {
    var data = {
        serverId: serverId,
        kind: "Contract"
    };
    postInvoke(constants.URLS.UPLOADIMAGESWEIXIN, data, function (res) {
        if (res.succeeded) {
            contractConfirmInfo.contractPictures.push(res.data.url);
            itemContractPictures = tplContractPicture.format(res.data.url, contractConfirmInfo.contractPictures.length - 1);
            contractPictures(itemContractPictures, contractConfirmInfo.contractPictures.length);
        }
    });
}

$(document).ready(function () {
    tplContractPicture = $("#tplContractPicture").html();
    contractConfirmInfoId = getCookie(constants.COOKIES.CONTRACTCONFIRMINFOID);
    getInvoke(constants.URLS.GETCONTRACTCONFIRMINFO.format(contractConfirmInfoId), function (res) {
        if (res.succeeded) {
            contractConfirmInfo = res.data;
            //contractPictures
            for (var i = 0; i < contractConfirmInfo.contractPictures.length; i++) {
                itemContractPictures += tplContractPicture.format(contractConfirmInfo.contractPictures[i], i);
            }
            contractPictures(itemContractPictures, contractConfirmInfo.contractPictures.length);
            //
            $("#lbRealName").text(contractConfirmInfo.realName);
            $("#lbCellphone").text(contractConfirmInfo.cellphone);
            $("#lbCredentialNo").text(contractConfirmInfo.credentialNo);
            //
            $("#txtRealName").val(contractConfirmInfo.contactInfo.realName);
            $("#txtCellphone").val(contractConfirmInfo.contactInfo.cellphone);
            $("#txtRelation").val(contractConfirmInfo.contactInfo.relationship);
            //
            $("#imgCredentialFacePhoto").attr("src", contractConfirmInfo.credentialFacePhoto);
            $("#lbCredentialFacePhoto").text((contractConfirmInfo.credentialType == "IDCard" ? "身份证正面" : "护照个人信息页"));
            //
            $("#imgCredentialBackPhoto").attr("src", contractConfirmInfo.credentialBackPhoto);
            $("#lbCredentialBackPhoto").text((contractConfirmInfo.credentialType == "IDCard" ? "身份证背面" : "护照签证信息页"));
            //
            $("#imgSelfiePhoto").attr("src", contractConfirmInfo.selfiePhoto);
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
        document.querySelector('#imgChoose1').onclick = function () {
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
                            V2UploadImages2(res1.serverId);
                        }
                    });
                }
            });
        };
        //
        document.querySelector('#imgAdd').onclick = function () {
            wx.chooseImage({
                count: 1,
                sizeType: ['original'],
                sourceType: ['album', 'camera'],
                success: function (res) {
                    wx.uploadImage({
                        localId: res.localIds[0],
                        isShowProgressTips: 1,
                        success: function (res1) {
                            V2UploadImages3(res1.serverId);
                        }
                    });
                }
            });
        };
    });
});
/**
 * Created by long.jiang on 2017/1/9.
 */
//
var pictureUrls = [];
var tplItem = "";
var ispostData = true;
//
function apply() {
    if (!ispostData) {
        mui.toast(constants.msgInfo.postData);
        return false;
    }
    if (pictureUrls.length == 0) {
        mui.toast(constants.msgInfo.imgContracterr2);
        return false;
    }
    ispostData = false;
    var data = {
        contractConfirmInfoId: getCookie(constants.COOKIES.CONTRACTCONFIRMINFOID),
        pictureType: "Contract",
        pictureUrls: pictureUrls
    };
    $(".msg-post").show();
    postInvoke(constants.URLS.UPLOADPICTURES, data, function (res) {
        ispostData = true;
        $(".msg-post").hide();
        if (res.succeeded) {
            mui.toast(constants.msgInfo.imgContract);
            getContractConfirmInfo();
       /*     setTimeout(function () {
                window.location.href = "apply3.html";
            }, 1000);*/
        } else {
            mui.toast(res.message);
        }
    }, function (err) {
        ispostData = true;
        $(".msg-post").hide();
        mui.toast(err.message);
    });
}

function getContractConfirmInfo() {
    contractConfirmInfoId = getCookie(constants.COOKIES.CONTRACTCONFIRMINFOID);
    getInvoke(constants.URLS.GETCONTRACTCONFIRMINFO.format(contractConfirmInfoId), function (res) {
        if (res.succeeded) {
            if (res.data.selfiePhoto == null) {
                window.location.href = "apply3.html";
            }
            else if (res.data.contactInfo == null) {
                window.location.href = "apply4.html";
            } else {
                window.location.href = "apply5.html";
            }
        } else {
            window.location.href = "apply3.html";
        }
    }, function () {
        window.location.href = "apply3.html";
    });
}

function V2UploadImages(serverId) {
    var data = {
        serverId: serverId,
        kind: "Contract"
    };
    postInvoke(constants.URLS.UPLOADIMAGESWEIXIN, data, function (res) {
        if (res.succeeded) {
            pictureUrls.push(res.data.url);
            $("#divAddSlide").before(tplItem.format(res.data.url)).find(".slide-container").removeClass("choose");
            var swiper = new Swiper('.swiper-container', {
                slidesPerView: 2,
                spaceBetween: 10,
                freeMode: true
            });
            swiper.slideTo(pictureUrls.length - 1, 1000, false);
        }
    });
}

$(document).ready(function () {
    tplItem = $("#tplItem").html();
    $("#divAddSlide").find(".slide-container").addClass("choose");
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
        document.querySelector('#divAddSlide').onclick = function () {
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
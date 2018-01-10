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
            setTimeout(function () {
                window.location.href = "apply3.html";
            }, 1000);
        } else {
            mui.toast(res.message);
        }
    }, function (err) {
        ispostData = true;
        $(".msg-post").hide();
        mui.toast(err.message);
    });
}

function V2UploadImages(serverId) {
    var data = {
        serverId: serverId,
        type: "Contract"
    };
    postInvoke(constants.URLS.WEIXINUPLOADIMAGES, data, function (res) {
        if (res.succeeded) {
            pictureUrls.push(res.data.url);
            $(".addSlide").before(tplItem.format(res.data.url)).find(".slide-container").removeClass("choose");
            var swiper = new Swiper('.swiper-container', {
                slidesPerView: 2,
                spaceBetween: 10,
                freeMode: true
            });
            swiper.slideTo(pictureUrls.length - 1, 1000, false);
        }
    });
}

function weixinSign() {
    var signUrl = constants.URLS.SIGNATURE.format(encodeURIComponent(window.location.href.split("?")[0]));
    $.ajax({
        type: 'get',
        url: signUrl,
        contentType: 'application/json'
    })
        .done(function (res) {
            wx.config({
                debug: false,
                appId: res.appId,
                timestamp: res.timestamp,
                nonceStr: res.nonceStr,
                signature: res.signature,
                jsApiList: ['checkJsApi', 'chooseImage', 'uploadImage']
            });
        })
        .fail(function () {
            alert('获取认证异常');
        });
    document.querySelector('#chooseImg').onclick = function () {
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
}

$(document).ready(function () {
    weixinSign();
    tplItem = $("#tplItem").html();
    $(".addSlide").find(".slide-container").addClass("choose");
});
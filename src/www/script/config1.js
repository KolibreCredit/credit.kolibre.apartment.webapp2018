/**
 * Created by long.jiang on 2017/1/10.
 */
var tenancyId = "", title = "", templateType = "", bigLogo = "", smallLogo = "", bigBackground = "",
    smallBackground = "", qrCodeLogo = "";
var tabIndex = -1;
var mySwiper = null;
var ispostData = true;

function V2UploadImages(serverId) {
    var data = {
        serverId: serverId,
        kind: "Other",
        index: tabIndex
    };
    postInvoke(constants.URLS.UPLOADIMAGESWEIXIN, data, function (res) {
        if (res.succeeded) {
            if (res.data.index == 0) {
                bigBackground = res.data.url;
                $("#imgBigBackground").attr("src", bigBackground).show();
            }
            else if (res.data.index == 1) {
                smallBackground = res.data.url;
                $("#imgSmallBackground").attr("src", smallBackground).show();
            }
            else if (res.data.index == 2) {
                bigLogo = res.data.url;
                $("#imgBigLogo").attr("src", bigLogo).show();
            }
            else if (res.data.index == 3) {
                smallLogo = res.data.url;
                $("#imgSmallLogo").attr("src", smallLogo).show();
            }
            else {
                qrCodeLogo = res.data.url;
                $("#imgQrCodeLogo").attr("src", qrCodeLogo).show();
            }
            $(".add").eq(res.data.index).hide();
        }
    });
}

function step1() {
    if (tenancyId == "") {
        mui.toast("请选择公寓");
        return false;
    }
    templateType = mySwiper.activeIndex;
    $("body").css("background-color", "#f7f7f7");
    $(".mui-content").css("background-color", "#f7f7f7");
    $(".step0").hide();
    $(".step1").show();
}

function wxChooseImage(index) {
    tabIndex = index;
    document.getElementById("chooseImage").click();
}

//
function apply() {
    if (!ispostData) {
        mui.toast(constants.msgInfo.postData);
        return false;
    }
    if (bigBackground == '') {
        mui.toast("上传背景图1不能为空");
        return false;
    }
    if (smallBackground == '') {
        mui.toast("上传背景图2不能为空");
        return false;
    }
    if (bigLogo == '') {
        mui.toast("上传logo图不能为空");
        return false;
    }
    if (smallLogo == '') {
        mui.toast("上传slogan图不能为空");
        return false;
    }
   /* if (qrCodeLogo == '') {
        mui.toast("二维码logo不能为空");
        return false;
    }*/
    ispostData = false;
    $(".msg-post").show();
    var data = {
        tenancyId: tenancyId,
        templateType: templateType,
        title: title,
        bigLogo: bigLogo,
        smallLogo: smallLogo,
        bigBackground: bigBackground,
        qrCodeLogo: qrCodeLogo,
        smallBackground: smallBackground
    };
    postInvoke(constants.URLS.CREATESHORTLINK, data, function (res) {
        $(".msg-post").hide();
        ispostData = true;
        if (res.succeeded) {
            mui.toast(constants.msgInfo.shortLink);
            setTimeout(function () {
                window.location.href = res.data.shortLinkAddress;
            }, 2000);
        } else {
            mui.toast(res.message);
        }
    }, function (err) {
        ispostData = true;
        $(".msg-post").hide();
        mui.toast(err.message);
    });
}

$(document).ready(function () {
    tenancyId = getURLQuery("tenancyId");
    title = getURLQuery("title");
    //
    mySwiper = new Swiper('#swiper-container', {
        effect: 'coverflow',
        slidesPerView: 1.4,
        centeredSlides: true,
        coverflowEffect: {
            rotate: 50,
            stretch: 10,
            depth: 60,
            modifier: 2,
            slideShadows: true
        }
    });
    mySwiper.slideTo(1, 500, false);
    //
    var signUrl = constants.URLS.SIGNATURE.format(encodeURIComponent(window.location.href));
    signInvoke(signUrl, function (res) {
        wx.config({
            debug: false,
            appId: res.data.appId,
            timestamp: res.data.timestamp,
            nonceStr: res.data.nonceStr,
            signature: res.data.signature,
            jsApiList: ['checkJsApi', 'chooseImage', 'uploadImage']
        });
        document.querySelector('#chooseImage').onclick = function () {
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
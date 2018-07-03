/**
 * Created by long.jiang on 2017/1/10.
 */
var tenancyId = "", title = "", templateType = "", bigLogo = "", smallLogo = "", bigBackground = "",
    smallBackground = "";
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
                bigLogo = res.data.url;
                $("#imgBigLogo").attr("src", bigLogo).show();
            }
            else if (res.data.index == 1) {
                smallLogo = res.data.url;
                $("#imgSmallLogo").attr("src", smallLogo).show();
            }
            else if (res.data.index == 2) {
                bigBackground = res.data.url;
                $("#imgBigBackground").attr("src", bigBackground).show();
            }
            else {
                smallBackground = res.data.url;
                $("#imgSmallBackground").attr("src", smallBackground).show();
            }
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
        mui.toast("上传背景图1");
        return false;
    }
    if (smallBackground == '') {
        mui.toast("上传背景图2");
        return false;
    }
    if (bigLogo == '') {
        mui.toast("上传logo图");
        return false;
    }
    if (smallLogo == '') {
        mui.toast("上传slogan图");
        return false;
    }
    ispostData = false;
    $(".msg-post").show();
    var data = {
        tenancyId: tenancyId,
        templateType: templateType,
        title: title,
        bigLogo: bigLogo,
        smallLogo: smallLogo,
        bigBackground: bigBackground,
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
    var allTenancies = [], itemTenancies = null;
    var tplTenancies = "<li class='mui-table-view-cell'><a data-key='{0}'>{1}</a></li>"
    getInvoke(constants.URLS.GETALLTENANCIES, function (res) {
        if (res.succeeded) {
            for (var i = 0; i < res.data.length; i++) {
                itemTenancies = res.data[i];
                allTenancies.push(tplTenancies.format(itemTenancies.tenancyId, itemTenancies.tenancyName));
            }
            $("#divRelation").find("ul").html(allTenancies.join(""));
        }
    });
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
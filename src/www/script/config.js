/**
 * Created by long.jiang on 2017/1/10.
 */
var tenancyId = "", templateType = "", title = "", bigLogo = "", smallLogo = "", bigBackground = "",
    smallBackground = "";
var tabIndex = -1;
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
                $("#imgBigLogo").attr("src", bigLogo);
            }
            else if (res.data.index == 1) {
                smallLogo = res.data.url;
                $("#imgSmallLogo").attr("src", smallLogo);
            }
            else if (res.data.index == 2) {
                bigBackground = res.data.url;
                $("#imgBigBackground").attr("src", bigBackground);
            }
            else {
                smallBackground = res.data.url;
                $("#imgSmallBackground").attr("src", smallBackground);
            }
        }
    });
}

//
function apply() {
    if (!ispostData) {
        mui.toast(constants.msgInfo.postData);
        return false;
    }
    if (imgUrl1 == '') {
        mui.toast(constants.msgInfo.imgIDCarderr);
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
/**
 * Created by long.jiang on 2017/1/9.
 */
var contractpages = [2, 3, 6, 8];
//
var imgUrl1 = "";
var imgUrl2 = "";
var imgUrl3 = "";
var imgUrl4 = "";
//
var isCreateReport = false;
var isCreateExtensionInfo = false;
var accountExtensionInfoId = "";
var isImgUrls = true;
//
var waitCount = 0;
var waitCount2 = 0;
var ispostData = true;

//
function V2UploadImages(serverId, imgIndex) {
    var data = {
        serverId: serverId,
        type: "Contract",
        index: imgIndex
    };
    postInvoke(constants.URLS.UPLOADIMAGES, data, function (res) {
        if (res.index == 0) {
            imgUrl1 = res.url;
            document.getElementById('img1').setAttribute('src', imgUrl1);
            document.getElementById("div1").style.display = 'none';
        }
        else if (res.index == 1) {
            imgUrl2 = res.url;
            document.getElementById('img2').setAttribute('src', imgUrl2);
            document.getElementById("div2").style.display = 'none';
        }
        else if (res.index == 2) {
            imgUrl3 = res.url;
            document.getElementById('img3').setAttribute('src', imgUrl3);
            document.getElementById("div3").style.display = 'none';

        } else {
            imgUrl4 = res.url;
            document.getElementById('img4').setAttribute('src', imgUrl4);
            document.getElementById("div4").style.display = 'none';
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
    document.querySelector('#chooseImg1').onclick = function () {
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                wx.uploadImage({
                    localId: res.localIds[0],
                    isShowProgressTips: 1,
                    success: function (res1) {
                        V2UploadImages(res1.serverId, 0);
                    }
                });
            }
        });
    };
    //
    document.querySelector('#chooseImg2').onclick = function () {
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                wx.uploadImage({
                    localId: res.localIds[0],
                    isShowProgressTips: 1,
                    success: function (res1) {
                        V2UploadImages(res1.serverId, 1);
                    }
                });
            }
        });
    };
    //
    document.querySelector('#chooseImg3').onclick = function () {
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                wx.uploadImage({
                    localId: res.localIds[0],
                    isShowProgressTips: 1,
                    success: function (res1) {
                        V2UploadImages(res1.serverId, 2);
                    }
                });
            }
        });
    };
    //
    document.querySelector('#chooseImg4').onclick = function () {
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                wx.uploadImage({
                    localId: res.localIds[0],
                    isShowProgressTips: 1,
                    success: function (res1) {
                        V2UploadImages(res1.serverId, 3);
                    }
                });
            }
        });
    };
}

//
function apply() {
    if (!ispostData) {
        mui.toast(constants.msgInfo.postData);
        return false;
    }
    /*if (!isCreateReport) {
        mui.toast(constants.msgInfo.error);
        return false;
    }
    if (!isCreateExtensionInfo) {
        mui.toast(constants.msgInfo.error1);
        return false;
    }*/
    if (imgUrl1 == '') {
        mui.toast(constants.msgInfo.imgContracterr.format(contractpages[0]));
        return false;
    }
    if (imgUrl2 == '') {
        mui.toast(constants.msgInfo.imgContracterr.format(contractpages[1]));
        return false;
    }
    if (isImgUrls && imgUrl3 == '') {
        mui.toast(constants.msgInfo.imgContracterr.format(contractpages[2]));
        return false;
    }
    if (isImgUrls && imgUrl4 == '') {
        mui.toast(constants.msgInfo.imgContracterr.format(contractpages[3]));
        return false;
    }
    ispostData = false;
    var data = {
        accountExtensionInfoId: accountExtensionInfoId,
        imagesUrl: [imgUrl1, imgUrl2],
        imageType: "Contract"
    };
    if (imgUrl3 != '') {
        data.imagesUrl.push(imgUrl3);
    }
    if (imgUrl4 != '') {
        data.imagesUrl.push(imgUrl4);
    }
    $(".msg-post").show();
    postInvoke(constants.URLS.V2UPLOADAPARTMENTIMAGES, data, function (res) {
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

function createReport() {
    setCookie(constants.COOKIES.REPORTID, "");
    setCookie(constants.COOKIES.BATCHID, "");
    var data = {description: "青年汇租房分期"};
    postInvoke(constants.URLS.CREATEREPORT, data, function (res) {
        if (res.succeeded) {
            isCreateReport = true;
            setCookie(constants.COOKIES.REPORTID, res.data.reportId);
            setCookie(constants.COOKIES.BATCHID, res.data.batchId);
        } else {
            waitCount = waitCount + 1;
            if (waitCount < 10) {
                setTimeout(function () {
                    createReport();
                }, 2000);
            }
        }
    });
}

function createExtensionInfo() {
    var leaseId = getCookie(constants.COOKIES.LEASEID);
    postInvoke(constants.URLS.CREATEEXTENSIONINFO, {leaseId: leaseId},
        function (res) {
            if (res.succeeded) {
                isCreateExtensionInfo = true;
                accountExtensionInfoId = res.data.accountExtensionInfoId;
                setCookie(constants.COOKIES.ACCOUNTEXTENSIONINFOID, accountExtensionInfoId);
            } else {
                waitCount2 = waitCount2 + 1;
                if (waitCount2 < 10) {
                    setTimeout(function () {
                        createExtensionInfo();
                    }, 2000);
                }
            }
        });
}

function getLeaseinfo() {
    var leaseId = getCookie(constants.COOKIES.LEASEID);
    getInvoke(constants.URLS.GETLEASEINFO.format(leaseId), function (res) {
        if (res.productNo == "221010110") {
            contractpages = [1, 2, 3, 10];
            $("#lbPages").text("（第1、2、3、10页）");
            $("#lbPage1").text("第1页");
            $("#lbPage2").text("第2页");
            $("#lbPage3").text("第3页");
            $("#lbPage4").text("第10页");
            $(".swiper-slide").show();
        }
        else if (res.productNo == "221010210") {
            contractpages = [2, 3, 6, 7];
            $("#lbPages").text("（第2、3、6、7页）");
            $("#lbPage1").text("第2页");
            $("#lbPage2").text("第3页");
            $("#lbPage3").text("第6页");
            $("#lbPage4").text("第7页");
            $(".swiper-slide").show();
        }
        else if (res.productNo == "221010610") {
            contractpages = [1, 2, 3, 4];
            $("#lbPages").text("（第1、2、3、4页）");
            $("#lbPage1").text("第1页");
            $("#lbPage2").text("第2页");
            $("#lbPage3").text("第3页");
            $("#lbPage4").text("第4页");
            $(".swiper-slide").show();
        }
        else if (res.productNo == "221010410") {
            contractpages = [1, 2];
            $("#lbPages").text("（第1、2页）");
            $("#lbPage1").text("第1页");
            $("#lbPage2").text("第2页");
            $(".swiper-slide").each(function (index, element) {
                if (index < 2) {
                    $(element).show();
                }
            });
            isImgUrls = false;
        }
        else {
            $(".swiper-slide").show();
        }
        initSwiper();
    });
}

function initSwiper() {
    new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        slidesPerView: 1.5,
        paginationClickable: true,
        spaceBetween: 10,
        freeMode: true
    });
}

$(document).ready(function () {
    getLeaseinfo();
    createExtensionInfo();
    createReport();
    weixinSign();
});
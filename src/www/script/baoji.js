/**
 * Created by long.jiang on 2016/12/14.
 */
var contractId = "";
var currentRowIndex = -1;
var cleaningType = "";
var cleaningTypes = ["RichangBaojie", "ShenduBaojie", "CaBoli", "XiaoshaChuchong"];
var pictureUrls = [];
var myScroll = null;
var tplItem = ""
var tplAddImg = "";
var pickerValue = "";
var cleaningStartTime = "";
var cleaningEndTime = "";
var ispostData = true;

function selectItem(rowIndex) {
    currentRowIndex = rowIndex;
    $(".baoxiuList").find(".item").each(function (index) {
        if (rowIndex == index) {
            $(this).addClass("active").find("img").eq(0).hide();
            $(this).find("img").eq(1).show();
        } else {
            $(this).removeClass("active").find("img").eq(0).show();
            $(this).find("img").eq(1).hide();
        }
    });
}

function loadPictureUrls() {
    var itemPictures = [];
    for (var i = 0; i < pictureUrls.length; i++) {
        itemPictures.push(tplItem.format(pictureUrls[i], i));
    }
    itemPictures.push(tplAddImg);
    $("#scroller").find("ul").html(itemPictures.join("")).css("width", "{0}px".format((pictureUrls.length + 1) * 130 + 40));
    myScroll = new IScroll('#wrapper', {
        preventDefault: false,
        scrollX: true,
        scrollY: false,
        mouseWheel: false
    });
}

function delImages(index) {
    pictureUrls.splice(index, 1);
    loadPictureUrls();
}

function addImg() {
    document.getElementById("divAddImg").click();
}

function V2UploadImages(serverId) {
    var data = {
        serverId: serverId,
        kind: "Other"
    };
    postInvoke(constants.URLS.UPLOADIMAGESWEIXIN, data, function (res) {
        if (res.succeeded) {
            pictureUrls.push(res.data.url);
            loadPictureUrls();
        }
    });
}

function hideSucce() {
    $("#divSucce").hide();
    setTimeout(function () {
        window.location.href = "fuwu.html";
    }, 1000);
}

function hideError() {
    $("#divError").hide();
    setTimeout(function () {
        window.location.href = "fuwu.html";
    }, 1000);
}

function createCleaning() {
    if (!ispostData) {
        mui.toast(constants.msgInfo.postData);
        return false;
    }
    if (currentRowIndex == -1) {
        mui.toast(constants.msgInfo.cleaningType);
        return false;
    }
    cleaningType = cleaningTypes[currentRowIndex];
    var tenantName = $("#txtRealName").val();
    if (tenantName == '') {
        mui.toast(constants.msgInfo.tenantName);
        return false;
    }
    var tenantCellphone = $("#txtCellphone").val();
    if (tenantCellphone == '') {
        mui.toast(constants.msgInfo.tenantCellphone);
        return false;
    }
    if (cleaningStartTime == "" || cleaningEndTime == "") {
        mui.toast(constants.msgInfo.pickerDate);
        return false;
    }
    var description = $("#txtDescription").val();
    if (description == '') {
        mui.toast(constants.msgInfo.description2);
        return false;
    }
    if (pictureUrls.length == 0) {
        mui.toast(constants.msgInfo.pictureUrls);
        return false;
    }
    var data = {
        contractId: contractId,
        tenantName: tenantName,
        tenantCellphone: tenantCellphone,
        cleaningType: cleaningType,
        description: description,
        pictures: pictureUrls,
        cleaningStartTime: cleaningStartTime + ":00",
        cleaningEndTime: cleaningEndTime + ":00"
    }
    ispostData = false;
    $(".msg-post").show();
    postInvoke(constants.URLS.CREATECLEANING, data, function (res) {
        ispostData = true;
        $(".msg-post").hide();
        if (res.succeeded) {
            $("#lbRepairDate").html(pickerValue);
            $("#divSucce").show();
        } else {
            $("#lbError").html(res.message);
            $("#divError").show();
        }
    }, function (err) {
        ispostData = true;
        $(".msg-post").hide();
        $("#lbError").html(err.message);
        $("#divError").show();
    });
}

$(document).ready(function () {
    //
    getInvoke(constants.URLS.GETCURRENTTENANT, function (res) {
        if (res.succeeded) {
            $("#txtRealName").val(res.data.realName);
            $("#txtCellphone").val(res.data.cellphone);
        }
    });
    contractId = getURLQuery("contractId");
    repairType = getURLQuery("repairType");
    //
    tplItem = $("#tplItem").html();
    tplAddImg = $("#tplAddImg").html();
    //
    selectItem(-1);
    loadPictureUrls();
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
        document.querySelector('#divAddImg').onclick = function () {
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
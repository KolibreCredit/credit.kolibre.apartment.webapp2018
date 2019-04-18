/**
 * Created by long.jiang on 2016/12/14.
 */
var contractId = "";
var repairType = "";
var pictureUrls = [];
var myScroll = null;
var tplItem = ""
var tplAddImg = "";
var pickerValue = "";
var repairStartTime = "";
var repairEndTime = "";
var ispostData = true;

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

function filterResConfig(item) {
    if (domesticConfig.length > 0) {
        for (var i = 0; i < domesticConfig.length; i++) {
            if (item == domesticConfig[i].configType) {
                return domesticConfig[i];
            }
        }
    }
    return null;
}

function createRepair() {
    if (!ispostData) {
        mui.toast(constants.msgInfo.postData);
        return false;
    }
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
    if (repairStartTime == "" || repairEndTime == "") {
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
    var currentConfig = filterResConfig(repairType);
    var data = {
        contractId: contractId,
        tenantName: tenantName,
        tenantCellphone: tenantCellphone,
        repairType: repairType,
        description: description,
        pictures: pictureUrls,
        configContents: currentConfig,
        repairStartTime: repairStartTime + ":00",
        repairEndTime: repairEndTime + ":00"
    }
    ispostData = false;
    $(".msg-post").show();
    postInvoke(constants.URLS.CREATEREPAIR, data, function (res) {
        ispostData = true;
        $(".msg-post").hide();
        if (res.succeeded) {
            $("#divCollectFees").html(currentConfig == null ? "" : (currentConfig.isCollectFees ? "服务完成后生成服务账单可线上进行支付" : ""));
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

var domesticConfig = [];

function getTenantDomesticConfigRepair() {
    getInvoke(constants.URLS.GETTENANTDOMESTICCONFIGREPAIRBYCONTRACTID.format(contractId), function (res) {
        domesticConfig = res.data;
    });
}

$(document).ready(function () {
    tplItem = $("#tplItem").html();
    tplAddImg = $("#tplAddImg").html();
    getInvoke(constants.URLS.GETCURRENTTENANT, function (res) {
        if (res.succeeded) {
            $("#txtRealName").val(res.data.realName);
            $("#txtCellphone").val(res.data.cellphone);
        }
    });
    contractId = getURLQuery("contractId");
    repairType = getURLQuery("repairType");
    getTenantDomesticConfigRepair();
    loadPictureUrls();
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



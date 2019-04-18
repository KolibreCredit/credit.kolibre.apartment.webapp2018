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
var domesticConfig = [];
var currentConfig = null;

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
    currentConfig = filterResConfig(cleaningTypes[currentRowIndex]);
    if (currentConfig != null) {
        if (currentConfig.isCollectFees) {
            $("#imgQuestion").show();
        } else {
            $("#imgQuestion").hide();
        }
        $("#txtCollectFees").val($(".sortation").eq(currentRowIndex).text());
        $("#liCollectFees").show();
    }
    else {
        $("#liCollectFees").hide();
    }
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
        configContents: currentConfig,
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

var initCleaningConfig = function () {
    var item = null;
    var unitPrice = "";
    var configs = $(".sortation");
    for (var i = 0; i < cleaningTypes.length; i++) {
        item = filterResConfig(cleaningTypes[i]);
        if (item != null) {
            if (item.isCollectFees) {
                unitPrice = (item.unitPrice * 0.01).toFixed(0);
                configs.eq(i).text(item.chargingMode == "TimeFree" ? unitPrice + "元/小时" : unitPrice + "元/次").show();
            } else {
                configs.eq(i).text("免费").show();
            }
        }
    }
    selectItem(0);
};

function getTenantDomesticConfigCleaning() {
    getInvoke(constants.URLS.GETTENANTDOMESTICCONFIGCLEANINGBYCONTRACTID.format(contractId), function (res) {
        domesticConfig = res.data;
        initCleaningConfig();
    }, function () {
        domesticConfig = [];
        initCleaningConfig();
    });
}

$(document).ready(function () {
    getInvoke(constants.URLS.GETCURRENTTENANT, function (res) {
        if (res.succeeded) {
            $("#txtRealName").val(res.data.realName);
            $("#txtCellphone").val(res.data.cellphone);
        }
    });
    contractId = getURLQuery("contractId");
    repairType = getURLQuery("repairType");
    getTenantDomesticConfigCleaning();
    //
    tplItem = $("#tplItem").html();
    tplAddImg = $("#tplAddImg").html();
    //
    selectItem(-1);
    loadPictureUrls();
    $('#imgQuestion').click(function () {
        var self = this;
        $.pt({
            target: self,
            position: "b",
            align: "l",
            width: "100%",
            autoClose: true,
            time: 2000,
            content: '服务人员完成服务后根据服务费用和工时生成服务账单，支持在线支付。'
        });
        $(".pt").css({"left": "20px", "right": "20px"});
        $(".out").css({"left": "67px"});
        $(".in").css({"left": "67px"});
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
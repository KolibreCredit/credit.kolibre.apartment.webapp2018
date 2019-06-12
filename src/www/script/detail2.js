var configs = [
    {
        url: 'images/config/kongtiao.png',
        urls: 'images/config/kongtiaos.png',
        desc: '空调',
        key: "AirConditioner"
    },
    {
        url: 'images/config/chuang12.png',
        urls: 'images/config/chuang12s.png',
        desc: '1.2m床',
        key: "Bed1_2"
    },
    {
        url: 'images/config/chuang15.png',
        urls: 'images/config/chuang15s.png',
        desc: '1.5m床',
        key: "Bed1_5"

    },
    {
        url: 'images/config/shuzhuo.png',
        urls: 'images/config/shuzhuos.png',
        desc: '书桌',
        key: "Desk"
    },
    {
        url: 'images/config/wobolu.png',
        urls: 'images/config/wobolus.png',
        desc: '微波炉',
        key: "MicrowaveOven"
    },
    {
        url: 'images/config/tv.png',
        urls: 'images/config/tvs.png',
        desc: '电视机',
        key: "Television"
    },
    {
        url: 'images/config/xiyiji.png',
        urls: 'images/config/xiyijis.png',
        desc: '洗衣机',
        key: "WashingMachine"
    },
    {
        url: 'images/config/wifi.png',
        urls: 'images/config/wifis.png',
        desc: 'WI-FI',
        key: "Wifi"
    },
    {
        url: 'images/config/shafa.png',
        urls: 'images/config/shafas.png',
        desc: '沙发',
        key: "Sofa"
    },
    {
        url: 'images/config/yigui.png',
        urls: 'images/config/yiguis.png',
        desc: '衣柜',
        key: "Wardrobe"
    },
    {
        url: 'images/config/weishengjian.png',
        urls: 'images/config/weishengjians.png',
        desc: '卫生间',
        key: "Bathroom"
    }
    ,
    {
        url: 'images/config/reishuiqi.png',
        urls: 'images/config/reishuiqis.png',
        desc: '热水器',
        key: "WaterHeater"
    }
    ,
    {
        url: 'images/config/ranqizao.png',
        urls: 'images/config/ranqizaos.png',
        desc: '燃气灶',
        key: "GasStoves"
    },
    {
        url: 'images/config/youyanji.png',
        urls: 'images/config/youyanjis.png',
        desc: '油烟机',
        key: "Hood"
    },
    {
        url: 'images/config/diancilu.png',
        urls: 'images/config/diancilus.png',
        desc: '电磁炉',
        key: "InductionCooker"
    },
    {
        url: 'images/config/yangtai.png',
        urls: 'images/config/yangtais.png',
        desc: '阳台',
        key: "Balcony"
    }
    ,
    {
        url: 'images/config/zhinengsuo.png',
        urls: 'images/config/zhinengsuos.png',
        desc: '智能锁',
        key: "SmartLock"
    },
    {
        url: 'images/config/binxiang.png',
        urls: 'images/config/binxiangs.png',
        desc: '冰箱',
        key: "Refrigerator"
    }
];

var roomId = "";
var item = null;
var myScroll = null;

var getRoomSourceFeature = function (roomSourceFeature) {
    var arraySourceFeature = [];
    if (roomSourceFeature != null) {
        for (var i = 0; i < roomSourceFeature.length; i++) {
            arraySourceFeature.push("<span>{0}</span>".format(roomSourceFeature[i]));
        }
    }
    return arraySourceFeature.join("");
};

var filterRoomFacilities = function (key) {
    for (var i = 0; i < item.roomFacilities.length; i++) {
        if (key == item.roomFacilities[i]) {
            return true;
        }
    }
    return false;
};

var filterDecorationType = function (decorationType) {
    switch (decorationType) {
        case "MaoPi":
            return "毛坯";
        case "JianZhuang":
            return "简装";
        case "JingZhuang":
            return "精装";
        default:
            return "豪装";
    }
};

var isAllConfig = true;

function allConfig() {
    if (isAllConfig) {
        var html3 = "";
        var tpl3 = $("#tpl3").html();
        var config = null;
        var station = false;
        for (var i = 0; i < configs.length; i++) {
            config = configs[i];
            station = filterRoomFacilities(config.key);
            html3 += tpl3.format((station ? config.urls : config.url), config.desc, (station ? "active" : ""));
        }
        $("#divAllConfig").html(html3);
        isAllConfig = false;
    }
    $(".allConfig").show();
}

function hideAllConfig() {
    $(".allConfig").hide();
}

function map(addr) {
    if (addr.indexOf(item.cityName) == -1) {
        addr = item.cityName + addr;
    }
    window.location.href = "map.html?addr=" + addr;
}

function appointment() {
    window.location.href = "detail21.html?roomId={0}".format(roomId);
}

function addCollection() {
    getInvoke(constants.URLS.ADDROOMSOURCECOLLECTION.format(roomId), function (res) {
        if (res.succeeded) {
            $("#divMsg").html("收藏成功");
            $(".msg-alert").show();
            $(".shoucang").eq(0).hide();
            $(".shoucang").eq(1).show();
            setTimeout(function () {
                $(".msg-alert").hide();
            }, 2000);
        } else {
            mui.toast(res.message);
        }
    });
}

function cancleCollection() {
    getInvoke(constants.URLS.CANCLEROOMSOURCECOLLECTION.format(roomId), function (res) {
        if (res.succeeded) {
            $("#divMsg").html("取消收藏");
            $(".msg-alert").show();
            $(".shoucang").eq(0).show();
            $(".shoucang").eq(1).hide();
            setTimeout(function () {
                $(".msg-alert").hide();
            }, 2000);
        } else {
            mui.toast(res.message);
        }
    });
}

$(document).ready(function () {
    roomId = getURLQuery("roomId");
    var reserve = getURLQuery("reserve") || "0"
    getInvoke(constants.URLS.GETROOMSOURCE.format(roomId), function (res) {
        if (res.succeeded) {
            item = res.data;
            var html1 = "";
            var tpl1 = $("#tpl1").html();
            var photoImgUrls = item.pictures;
            if (photoImgUrls == null || photoImgUrls.length == 0) {
                photoImgUrls = ["images/dataErr.png"];
            }
            for (var i = 0; i < photoImgUrls.length; i++) {
                html1 = html1 + tpl1.format(photoImgUrls[i]);
            }
            $(".mui-number").html("<span>1</span>/{0}".format(photoImgUrls.length));
            $(".mui-slider-group").html(html1);
            var gallery = mui(".mui-slider");
            gallery.slider({interval: 0});
            //
            if (item.rentType == "HeZu") {
                $(".hezu").show();
            }
            //
            var tpl2 = $("#tpl2").html();
            var html2 = tpl2.format(
                item.roomSourceName,
                item.roomTypeName,
                (item.retailPrice > 0 ? (item.retailPrice * 0.01).toFixed(0) + "元/月<span>当前可入住</span>" : "敬请期待…"),
                item.apartmentAddress,
                item.subway,
                getRoomSourceFeature(item.roomSourceFeature),
                (item.rentType == "ZhengZu" ? "整租" : "合租") + " / " + item.roomTypeName + " / " + (item.roomTypeSize * 0.0001).toFixed(2) + "㎡");
            $("#divProject").html(html2);
            setTimeout(function () {
                if (item.subway != null) {
                    $(".subway").show();
                }
                if (item.roomSourceFeature.length > 0) {
                    $(".roomSourceLine").show();
                    $(".roomSourceFeature").show();
                }
            }, 100);
            //
            var html4 = "";
            var tpl4 = $("#tpl4").html();
            html4 += tpl4.format("images/hxjj/huxing.png", item.roomTypeName);
            html4 += tpl4.format("images/hxjj/mianji.png", (item.roomTypeSize * 0.0001) + "㎡");
            html4 += tpl4.format("images/hxjj/chaoxiang.png", "朝南");
            html4 += tpl4.format("images/hxjj/jingzhuang1.png", filterDecorationType(item.decorationType));
            $("#divIntro").html(html4);
            $("#divDecorationDescription").html(item.decorationDescription);
            //
            var html3 = "";
            var tpl3 = $("#tpl3").html();
            var config = null;
            var station = false;
            for (var i = 0; i < configs.length; i++) {
                if (i < 9) {
                    config = configs[i];
                    station = filterRoomFacilities(config.key);
                    html3 += tpl3.format((station ? config.urls : config.url), config.desc, (station ? "active" : ""));
                }
            }
            var tpl31 = $("#tpl31").html();
            html3 += tpl31.format(roomId, "全部", "active");
            $("#divConfigs").html(html3);
            //
            var apartmentPictures = "";
            var itemApartmentPicture = "<li><div class='apartmentPictures'><img src='{0}'/></div></li>";
            var dataApartmentPictures = item.apartmentPictures;
            if (dataApartmentPictures == null || dataApartmentPictures.length == 0) {
                dataApartmentPictures = ["images/dataErr.png"];
            }
            for (var i = 0; i < dataApartmentPictures.length; i++) {
                apartmentPictures += itemApartmentPicture.format(dataApartmentPictures[i]);
            }
            $("#scroller").css("width", "{0}px".format(200 * dataApartmentPictures.length + 40)).find("ul").html(apartmentPictures);
            myScroll = new IScroll('#wrapper', {
                preventDefault: false,
                scrollX: true,
                scrollY: false,
                mouseWheel: false
            });
            //
            $("#divApartmentIntroduction").html(item.apartmentIntroduction);
            $("#divSupportFacilities").html(item.supportFacilities);
            if (item.supportFacilities == null || item.supportFacilities == "") {
                $(".supportFacilities").hide();
            }
            $("#divTrafficMethod").html(item.trafficMethod);
            if (item.trafficMethod == null || item.trafficMethod == "") {
                $(".trafficMethod").hide();
            }
            $("#divTips").html(item.tips);
            if (item.tips == null || item.tips == "") {
                $(".tips").hide();
            }
            //
            if (item.isAvailable) {
                if (item.isCollection) {
                    $(".shoucang").eq(1).show();
                } else {
                    $(".shoucang").eq(0).show();
                }
            }
            //
            if (item.isAvailable) {
                $(".reserve .item").eq(0).css({"width": "30%"}).show();
                $(".reserve .item").eq(2).css({"width": "70%"});
            }
            if (item.contacts != null) {
                $("#telContacts").attr("href", "tel:{0}".format(item.contacts));
                $(".reserve .item").eq(1).css({"width": "50%"}).show();
                $(".reserve .item").eq(2).css({"width": "50%"});
            }
            if (item.isAvailable && item.contacts != null) {
                $(".reserve .item").eq(0).css({"width": "20%"}).show();
                $(".reserve .item").eq(1).css({"width": "40%"}).show();
                $(".reserve .item").eq(2).css({"width": "40%"});
            }
            if (reserve == "0") {
                $(".reserve").show();
            }
        } else {
            mui.toast(res.message);
        }
    }, function (err) {
        mui.toast(err.message);
    });
});
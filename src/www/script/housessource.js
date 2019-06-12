/**
 * Created by long.jiang on 2018/4/19.
 */
var myScroll = null;
var rooms = null;
var apartmentName = "";
var conditionKeys = ["", "", "", ""];
var tenancyId = "";
var forceRefresh = false;
var turnIndex = 0;

function initIScroll() {
    myScroll = new IScroll('#wrapper', {
        preventDefault: false,
        scrollX: true,
        scrollY: false,
        mouseWheel: false
    });
}

function searchItem(tabIndex) {
    $(".filter").each(function (index) {
        if (index == tabIndex) {
             $(this).toggle();
            if ($(this).is(":visible")) {
                //$(this).hide();
                $(".listActive").show();
                $(".search .item").find(".jiantou").attr("src", "images/search-jiantou.png");
            } else {
               //$(this).show();
                $(".listActive").hide();
                $(".search .item").eq(index).find(".jiantou").attr("src", "images/search-jiantous.png");
            }
        } else {
            $(this).hide();
            $(".search .item").eq(index).find(".jiantou").attr("src", "images/search-jiantou.png");
        }
    });
    //$(".listActive").show();
}

function filterSelect(tabIndex, o) {
    $(".filter").eq(tabIndex).find(".item").removeClass("active");
    conditionKeys[tabIndex] = $(o).html().trim();
    if (conditionKeys[tabIndex] == "不限" && tabIndex == 0) {
        conditionKeys[tabIndex] = "";
        $(".search .item").eq(tabIndex).find(".condition").removeClass("active").html("城市");
        $(o).addClass("active");
    }
    else if (conditionKeys[tabIndex] == "不限" && tabIndex == 1) {
        conditionKeys[tabIndex] = "";
        $(".search .item").eq(tabIndex).find(".condition").removeClass("active").html("区域");
        $(o).addClass("active");
    }
    else if (conditionKeys[tabIndex] == "不限" && tabIndex == 2) {
        conditionKeys[tabIndex] = "";
        $(".search .item").eq(tabIndex).find(".condition").removeClass("active").html("租金");
        $(o).addClass("active");
    }
    else if (conditionKeys[tabIndex] == "推荐" && tabIndex == 3) {
        conditionKeys[tabIndex] = "";
        $(".search .item").eq(tabIndex).find(".condition").removeClass("active").html("排序");
        $(o).addClass("active");
    }
    else {
        var condition = conditionKeys[tabIndex];
        if (tabIndex == 2 && conditionKeys[tabIndex].length > 7) {
            condition = conditionKeys[tabIndex].substring(0, 4) + '...';
        }
        $(".search .item").eq(tabIndex).find(".condition").addClass("active").html(condition);
        $(o).addClass("active");
    }
    $(".search .item").eq(tabIndex).find(".jiantou").attr("src", "images/search-jiantou.png");
    $(".filter").eq(tabIndex).hide();
    $(".listActive").hide();
    filterRoomsData();
}

function hideFilter() {
    $(".search .item").find(".jiantou").attr("src", "images/search-jiantou.png");
    $(".filter").hide();
    $(".listActive").hide();
}

function selectApartments(itemIndex) {
    $("#scroller .apartments").each(function (index) {
        if (itemIndex != index) {
            $(this).removeClass("active");
        } else {
            if ($(this).hasClass("active")) {
                $(this).removeClass("active");
                apartmentName = "";
            } else {
                $(this).addClass("active");
                apartmentName = $(this).find("span").html();
            }
        }
    });
    filterRoomsData();
}

function compare(property, rule) {
    return function (item1, item2) {
        if (property == "publishTime") {
            var value1 = new Date(item1[property]);
            var value2 = new Date(item2[property]);
            return rule == "asc" ? (value1 - value2) : (value2 - value1);
        } else {
            var value1 = item1[property];
            var value2 = item2[property];
            return rule == "asc" ? (value1 - value2) : (value2 - value1);
        }
    }
}

var arrayItems = [];
var getRoomSourceFeature = function (roomSourceFeature) {
    var arraySourceFeature = [];
    if (roomSourceFeature != null) {
        for (var i = 0; i < roomSourceFeature.length; i++) {
            if (i < 2) {
                arraySourceFeature.push("<span>{0}</span>".format(roomSourceFeature[i]));
            } else {
                break;
            }
        }
    }
    return arraySourceFeature.join("");
};

var drawRoomsData = function () {
    if (arrayItems.length > 0) {
        var listItems = "";
        var tplItem = (turnIndex == 0 ? $("#tplItem0").html() : $("#tplItem1").html());
        if (turnIndex == 0) {
            arrayItems.forEach(function (item) {
                listItems += tplItem.format((item.pictures == null ? "images/dataErr.png" : item.pictures[0]), item.roomSourceName, (item.retailPrice > 0 ? (item.retailPrice * 0.01) + "元/月" : "敬请期待…"), item.apartmentAddress, getRoomSourceFeature(item.roomSourceFeature), item.roomId);
            });
            $(".listColumn").hide();
            $(".list").html(listItems).show();
        } else {
            arrayItems.forEach(function (item) {
                listItems += tplItem.format((item.pictures == null ? "images/dataErr.png" : item.pictures[0]), item.roomSourceName, (item.retailPrice > 0 ? (item.retailPrice * 0.01) + "元/月" : "敬请期待…"), item.apartmentAddress, getRoomSourceFeature(item.roomSourceFeature), item.roomId);
            });
            $(".list").hide();
            $(".listColumn").html(listItems).show();
        }
        $(".errData").hide();
    } else {
        $(".list").hide();
        $(".listColumn").hide();
        $(".errData").show();
    }
}

function filterRoomsData() {
    if (rooms == null) {
        return;
    }
    var cityKey = conditionKeys[0];
    var districtKey = conditionKeys[1];
    var minRetail = 0;
    var maxRetail = 0;
    var retailKey = conditionKeys[2];
    if (retailKey != "") {
        if (retailKey.indexOf("以下") != -1) {
            minRetail = 0;
            maxRetail = parseInt(retailKey.replace("元以下", "").trim());
        }
        else if (retailKey.indexOf("以上") != -1) {
            minRetail = parseInt(retailKey.replace("元以上", "").trim());
            maxRetail = 10000000;
        } else {
            minRetail = parseInt(retailKey.split("-")[0]);
            maxRetail = parseInt(retailKey.split("-")[1].replace("元", "").trim())
        }
    }
    arrayItems = [];
    var arrayItem = null;
    for (var i = 0; i < rooms.length; i++) {
        arrayItem = rooms[i];
        if (cityKey != "" && arrayItem.cityName != cityKey) {
            continue;
        }
        if (districtKey != "" && arrayItem.districtName != districtKey) {
            continue;
        }
        if (apartmentName != "" && arrayItem.apartmentName != apartmentName) {
            continue;
        }
        if (retailKey != "") {
            if ((arrayItem.retailPrice * 0.01) >= minRetail && (arrayItem.retailPrice * 0.01) <= maxRetail) {
                arrayItems.push(arrayItem);
            }
        } else {
            arrayItems.push(arrayItem);
        }
    }
    var sortKey = conditionKeys[3];
    if (sortKey == "最新发布") {
        arrayItems.sort(compare("publishTime", "desc"));
    }
    else if (sortKey == "价格升序") {
        arrayItems.sort(compare("retailPrice", "asc"));
    }
    else if (sortKey == "价格降序") {
        arrayItems.sort(compare("retailPrice", "desc"));
    }
    else if (sortKey == "面积升序") {
        arrayItems.sort(compare("roomTypeSize", "asc"));
    }
    if (sortKey == "面积降序") {
        arrayItems.sort(compare("roomTypeSize", "desc"));
    }
    //
    drawRoomsData();
}

function detail2(roomId) {
    window.location.href = "detail2.html?roomId={0}".format(roomId);
}

function getRoomSources() {
    var tplCitieItem = "<div class='item' onclick='filterSelect(0,this)'>{0}</div>";
    var citieItems = "";
    //
    var tplDistrictItem = "<div class='item' onclick='filterSelect(1,this)'>{0}</div>";
    var districtsItems = "";
    //
    var tplApartmentItem = "<li onclick='selectApartments({0})'><div class='apartments'><span>{1}</span><img src='images/apartments.png'/></div></li>";
    var apartmentItems = "";
    //
    var data = {
        tenancyId: tenancyId,
        forceRefresh: forceRefresh
    };
    postInvoke(constants.URLS.GETROOMSOURCES, data, function (res) {
        if (res.succeeded) {
            if (res.data != null) {
                citieItems += tplCitieItem.format("不限");
                for (var i = 0; i < res.data.cities.length; i++) {
                    citieItems += tplCitieItem.format(res.data.cities[i]);
                }
                districtsItems += tplDistrictItem.format("不限");
                for (var i = 0; i < res.data.districts.length; i++) {
                    districtsItems += tplDistrictItem.format(res.data.districts[i]);
                }
                for (var i = 0; i < res.data.apartments.length; i++) {
                    apartmentItems += tplApartmentItem.format(i, res.data.apartments[i]);
                }
                $(".filter").eq(0).html(citieItems);
                $(".filter").eq(1).html(districtsItems);
                $("#scroller").css("width", "{0}px".format(100 * res.data.apartments.length)).find("ul").html(apartmentItems);
                initIScroll();
                rooms = res.data.rooms;
                filterRoomsData();
            }
        } else {
            mui.toast(res.message);
        }
    }, function (err) {
        mui.toast(err.message);
    });
}

function turnView(curIndex) {
    if (curIndex != turnIndex) {
        turnIndex = curIndex;
        $(".view").find("img").eq(0).attr("src", (turnIndex == 0 ? "images/view0s.png" : "images/view0.png"));
        $(".view").find("img").eq(2).attr("src", (turnIndex == 1 ? "images/view1s.png" : "images/view1.png"));
        drawRoomsData();
    }
}

$(document).ready(function () {
    tenancyId = getURLQuery("houselistId") || "2C29A4AFDE3C47648BF40535CA2B5290";
    forceRefresh = (getURLQuery("isRefresh") == "true" ? true : false);
    //tenancyId = "3E0D49CE950A424FBF6D5F6A57231CF0";
    //tenancyId = "13EABF152B724338A3DE9A6C598EC95A";
    getRoomSources();
    $(".filter").eq(2).find(".item").bind("click", function () {
        filterSelect(2, $(this)[0]);
    });
    $(".filter").eq(3).find(".item").bind("click", function () {
        filterSelect(3, $(this)[0]);
    });
});
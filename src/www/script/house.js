var activeIndex = 0;
var currentApartment = [{
    productno: "221010010",
    source: "上海浦东浙桥路277号(金桥)"
}, {
    productno: "221010110",
    source: "上海张江青春公寓(居里寓)"
}, {
    productno: "221010210",
    source: "上海闵行康豆公寓（澄江店）"
}, {
    productno: "221010310",
    source: "上海吴中路店"
}, {
    productno: "221010410",
    source: "上海寓居青年之家"
}, {
    productno: "221010610",
    source: "魔族国际青年社区宝杨店"
}];
var selectText = "";
//
$(document).ready(function () {
    new Swiper('.swiper-container', {
        slidesPerView: 2.5,
        spaceBetween: 20,
    });
    $(".swiper-slide").css({"width": "130px"});
    $("#divStep1").hide();
    //
    mui('.step0').on('tap', '.mui-table-view-cellMore', function () {
        selectItem0($(this).attr("data-key"));
    });
    mui('.step0').on('tap', 'a', function () {
        currentApartment[0].productno = this.getAttribute("productno");
        currentApartment[0].source = this.text;
    });
    mui('.step0').on('tap', 'span', function () {
        $(".step0 span").removeClass("active");
        $(this).addClass("active");
        selectText = $(this).text();
    });
    //
    mui('.step1').on('tap', '.mui-table-view-cell', function () {
        selectItem1($(this).attr("data-key"));
    });
    mui('.step1').on('tap', 'a', function () {
        currentApartment[1].productno = this.getAttribute("productno");
        currentApartment[1].source = this.text;
    });
    mui('.step1').on('tap', 'span', function () {
        $(".step1 span").removeClass("active");
        $(this).addClass("active");
        selectText = $(this).text();
    });
    //
    mui('.step2').on('tap', 'a', function () {
        currentApartment[2].productno = this.getAttribute("productno");
        currentApartment[2].source = this.text;
    });
    mui('.step3').on('tap', 'a', function () {
        currentApartment[3].productno = this.getAttribute("productno");
        currentApartment[3].source = this.text;
    });
    mui('.step4').on('tap', 'a', function () {
        currentApartment[4].productno = this.getAttribute("productno");
        currentApartment[4].source = this.text;
    });
    mui('.step5').on('tap', '.mui-table-view-cell', function () {
        selectItem5($(this).attr("data-key"));
    });
    mui('.step5').on('tap', 'a', function () {
        currentApartment[5].productno = this.getAttribute("productno");
        currentApartment[5].source = this.text;
    });
    mui('.step5').on('tap', 'span', function () {
        $(".step5 span").removeClass("active");
        $(this).addClass("active");
        selectText = $(this).text();
    });
    //
    getInvoke(constants.URLS.GETCURRENTHOUSEACCOUNT, function (res) {
        if (!res.isExistAccountInfo) {
            mui.alert(constants.msgInfo.verifyerr, '蜂鸟屋', function () {
                window.location.href = "verify.html?url=house.html";
            });
        }
    });
});

var lastItemIndex0 = "";
function selectItem0(itemIndex) {
    if (lastItemIndex0 != itemIndex) {
        lastItemIndex0 = itemIndex;
        $(".step0 span").removeClass("active");
        selectText = "";
    }
    if (itemIndex == "0") {
        $(".step0 .item0").toggle();
        $(".step0 .item1").hide();
        $(".step0 .img0").attr("src", "images/more2.png");
        $(".step0 .img1").attr("src", "images/more1.png");
    }
    else {
        $(".step0 .item0").hide();
        $(".step0 .item1").toggle();
        $(".step0 .img0").attr("src", "images/more1.png");
        $(".step0 .img1").attr("src", "images/more2.png");
    }
}

var lastItemIndex1 = "";
function selectItem1(itemIndex) {
    if (lastItemIndex1 != itemIndex) {
        lastItemIndex1 = itemIndex;
        $(".step1 span").removeClass("active");
        selectText = "";
    }
    if (itemIndex == "0") {
        $(".step1 .item0").toggle();
        $(".step1 .item1").hide();
        $(".step1 .item2").hide();
        $(".step1 .img0").attr("src", "images/more2.png");
        $(".step1 .img1").attr("src", "images/more1.png");
        $(".step1 .img2").attr("src", "images/more1.png");
    }
    else if (itemIndex == "1") {
        $(".step1 .item0").hide();
        $(".step1 .item1").toggle();
        $(".step1 .item2").hide();
        $(".step1 .img0").attr("src", "images/more1.png");
        $(".step1 .img1").attr("src", "images/more2.png");
        $(".step1 .img2").attr("src", "images/more1.png");
    }
    else {
        $(".step1 .item0").hide();
        $(".step1 .item1").hide();
        $(".step1 .item2").toggle();
        $(".step1 .img0").attr("src", "images/more1.png");
        $(".step1 .img1").attr("src", "images/more1.png");
        $(".step1 .img2").attr("src", "images/more2.png");
    }
}

var lastItemIndex5 = "";

function selectItem5(itemIndex) {
    if (lastItemIndex5 != itemIndex) {
        lastItemIndex5 = itemIndex;
        $(".step5 span").removeClass("active");
        selectText = "";
    }
    if (itemIndex == "0") {
        $(".step5 .item0").toggle();
        $(".step5 .item1").hide();
        $(".step5 .img0").attr("src", "images/more2.png");
        $(".step5 .img1").attr("src", "images/more1.png");
    }
    else {
        $(".step5 .item0").hide();
        $(".step5 .item1").toggle();
        $(".step5 .img0").attr("src", "images/more1.png");
        $(".step5 .img1").attr("src", "images/more1.png");
    }
}

function houseInformation() {
    var apartment = currentApartment[activeIndex];
    var productno = apartment.productno;
    var source = apartment.source;
    if (activeIndex == 0) {
        if (source == "上海闵行江川路") {
            if (selectText == "") {
                mui.toast(constants.msgInfo.source1);
                return false;
            }
            source += selectText;
        }
        else if (source == "上海张江川北公路2999号") {
            if (selectText == "") {
                mui.toast(constants.msgInfo.source1);
                return false;
            }
            source += selectText;
        }
    }
    else if (activeIndex == 1) {
        if (selectText == "") {
            mui.toast(constants.msgInfo.source1);
            return false;
        }
        source += selectText;
    }
    else if (activeIndex == 5) {
        if (selectText == "") {
            mui.toast(constants.msgInfo.source1);
            return false;
        }
        source += selectText;
    }
    if (productno == "221010010") {
        window.location.href = "house1qiannianhui.html?productno={0}&source={1}".format(productno, encodeURI(source));
    }
    else if (productno == "221010210") {
        window.location.href = "house1kangdou.html?productno={0}&source={1}".format(productno, encodeURI(source));
    }
    else if (productno == "221010310") {
        window.location.href = "house1nex.html?productno={0}&source={1}".format(productno, encodeURI(source));
    }
    else if (productno == "221010410") {
        window.location.href = "house1yuju.html?productno={0}&source={1}".format(productno, encodeURI(source));
    }
    else if (productno == "221010610") {
        window.location.href = "house1yuju.html?productno={0}&source={1}".format(productno, encodeURI(source));
    }
    else {
        window.location.href = "house1.html?productno={0}&source={1}".format(productno, encodeURI(source));
    }
}

function tabShow() {
    $(".mui-content").addClass("animation");
    $("#divStep0").hide();
    $("#divStep1").show();
}

function tabSelect(tabIndex) {
    activeIndex = tabIndex;
    $("#imgLogo").attr("src", "images/20171124/logo/{0}.png".format(tabIndex));
    if (activeIndex == 0) {
        $(".step0").show();
        $(".step1").hide();
        $(".step2").hide();
        $(".step3").hide();
        $(".step4").hide();
        $(".step5").hide();
    }
    else if (activeIndex == 1) {
        $(".step0").hide();
        $(".step1").show();
        $(".step2").hide();
        $(".step3").hide();
        $(".step4").hide();
        $(".step5").hide();
    }
    else if (activeIndex == 2) {
        $(".step0").hide();
        $(".step1").hide();
        $(".step2").show();
        $(".step3").hide();
        $(".step4").hide();
        $(".step5").hide();
    }
    else if (activeIndex == 3) {
        $(".step0").hide();
        $(".step1").hide();
        $(".step2").hide();
        $(".step3").show();
        $(".step4").hide();
        $(".step5").hide();
    }
    else if (activeIndex == 4) {
        $(".step0").hide();
        $(".step1").hide();
        $(".step2").hide();
        $(".step3").hide();
        $(".step4").show();
        $(".step5").hide();
    }
    else {
        $(".step0").hide();
        $(".step1").hide();
        $(".step2").hide();
        $(".step3").hide();
        $(".step4").hide();
        $(".step5").show();
    }
    $(".mui-content").removeClass("animation");
    $("#divStep0").show();
    $("#divStep1").hide();
}
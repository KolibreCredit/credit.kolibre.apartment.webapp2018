/**
 * Created by long.jiang on 2016/12/14.
 */
var isPaidDeposit = true;
var depositPeriod = 1;
var productno = "";
var source = "";
var roomNumber = "";
var floor = "";
var decoration = "";
//
var ispostData = true;
var leaseId = "";
var rentalType = "Full";
var rentalTypes = ["Monthly", "Quarterly", "SixMonthly", "Full"];
var imgs = ["images/Monthly.png", "images/Quarterly.png", "images/SixMonthly.png", "images/Yearly.png"];
var simgs = ["images/Monthlys.png", "images/Quarterlys.png", "images/SixMonthlys.png", "images/Yearlys.png"];
var houseList = null;
var roomList = null;

function payDeposit(tabIndex) {
    if (tabIndex == 0) {
        depositPeriod = 1;
        $("#btnPayDeposit0").css({"border": "1px solid #ff8c14", "color": "#ff8c14"});
        $("#btnPayDeposit1").css({"border": "1px solid #999999", "color": "#999999"});
    } else {
        $("#btnPayDeposit0").css({"border": "1px solid #999999", "color": "#999999"});
        $("#btnPayDeposit1").css({"border": "1px solid #ff8c14", "color": "#ff8c14"});
        depositPeriod = 2;
    }
}
//
function leaseInformation() {
    if (!ispostData) {
        mui.toast(constants.msgInfo.postData);
        return false;
    }
    if (source == '') {
        mui.toast(constants.msgInfo.source);
        return false;
    }
    floor = $("#txtFloor").text();
    if (floor == "请选择楼层") {
        mui.toast(constants.msgInfo.floor);
        return false;
    }
    if (floor == '') {
        mui.toast(constants.msgInfo.floor);
        return false;
    }
    if (!constants.REGEX.FLOOR.test(floor)) {
        mui.toast(constants.msgInfo.floorerr);
        return false;
    }
    if (roomNumber == '') {
        mui.toast(constants.msgInfo.roomNumber2);
        return false;
    }
    var outerContractNo = $("#txtOuterContractNo").val();
    if (outerContractNo == '') {
        mui.toast(constants.msgInfo.outerContractNo);
        return false;
    }
    if (outerContractNo.length < 6) {
        mui.toast(constants.msgInfo.outerContractNoerr);
        return false;
    }
    var monthRentalAmount = $("#txtMonthRentalAmount").val();
    if (monthRentalAmount == '') {
        mui.toast(constants.msgInfo.monthRentalAmount);
        return false;
    }
    if (!constants.REGEX.AMOUNT.test(monthRentalAmount)) {
        mui.toast(constants.msgInfo.monthRentalAmounterr);
        return false;
    }
    var leaseTerm = $("#txtLeaseTerm").val();
    if (leaseTerm == '') {
        mui.toast(constants.msgInfo.leaseTerm);
        return false;
    }
    if (!constants.REGEX.AMOUNT.test(leaseTerm)) {
        mui.toast(constants.msgInfo.leaseTermerr);
        return false;
    }
    if (parseInt(leaseTerm) < 1 || parseInt(leaseTerm) > 12) {
        mui.toast(constants.msgInfo.leaseTermerr2);
        return false;
    }
    /* var leaseOrderDay = $("#txtLeaseOrderDay").val();
     if (leaseOrderDay === '') {
     mui.toast(constants.msgInfo.leaseOrderDay);
     return false;1
     }
     if (!constants.REGEX.AMOUNT.test(leaseOrderDay)) {
     mui.toast(constants.msgInfo.leaseOrderDayerr);
     return false;
     }
     if (parseInt(leaseOrderDay) > 31 || parseInt(leaseOrderDay) < 1) {
     mui.toast(constants.msgInfo.leaseOrderDayRang);
     return false;
     }*/
    var leaseStartTime = $("#lbLeaseStartTime").text();
    var leaseExpiryTime = $("#lbLeaseExpiryTime").text();
    if (Date.parse(leaseExpiryTime) <= Date.parse(leaseStartTime)) {
        mui.toast(constants.msgInfo.leaseExpiryTime);
        return false;
    }
    var leaseStartTimes = leaseStartTime.split('-');
    var leaseOrderDay = new Date(new Date(parseInt(leaseStartTimes[0]), parseInt(leaseStartTimes[1]) - 1, parseInt(leaseStartTimes[2])).add("d", -5)).getDate();
    if (rentalType == "") {
        mui.toast(constants.msgInfo.rentalTypeerr);
        return false;
    }
    var depositAmount = $("#txtDepositAmount").val();
    if (depositAmount == '') {
        mui.toast(constants.msgInfo.depositAmount);
        return false;
    }
    if (!constants.REGEX.AMOUNT.test(depositAmount)) {
        mui.toast(constants.msgInfo.depositAmounterr);
        return false;
    }
    var tenementAmount = $("#txtTenementAmount").val();
    if (tenementAmount == '') {
        tenementAmount = 0;
    }
    if (!constants.REGEX.AMOUNT.test(tenementAmount)) {
        mui.toast(constants.msgInfo.tenementAmounterr);
        return false;
    }
    if ($("#chkAgreement").attr("src").indexOf('check1.png') === -1) {
        mui.toast(constants.msgInfo.agreement2);
        return false;
    }
    if (parseInt(depositAmount) == 0) {
        isPaidDeposit = true;
    }
    var houseInfor = {
        source: source,
        roomNumber: roomNumber,
        floor: floor,
        client: "M"
    };
    ispostData = false;
    postInvoke(constants.URLS.CREATEHOUSEINFO, houseInfor, function (res) {
        if (res.succeeded) {
            var leaseData = {
                houseId: res.data.houseId,
                outerContractNo: outerContractNo,
                monthRentalAmount: monthRentalAmount * 100,
                depositAmount: depositAmount * 100,
                depositPeriod: depositPeriod,
                isPaidDeposit: isPaidDeposit,
                tenementAmount: tenementAmount * 100,
                leaseTerm: leaseTerm,
                rentalType: rentalType,
                leaseOrderDay: leaseOrderDay,
                leaseStartTime: leaseStartTime,
                leaseExpiryTime: leaseExpiryTime,
                productNo: productno,
                client: "M"
            };
            postInvoke(constants.URLS.CREATELEASE, leaseData, function (res1) {
                if (res1.succeeded) {
                    leaseId = res1.data.leaseId;
                    //合同确认
                    postInvoke(constants.URLS.CREATEDIGITALCONTRACT, {
                        leaseId: leaseId,
                        contractTypeName: ['JuJian']
                    },function (res2){
                        console.log(res2);
                    });
                    $(".msg-alert").show();
                } else {
                    ispostData = true;
                    mui.toast(res1.message);
                }
            }, function (err1) {
                ispostData = true;
                mui.toast(err1.message);
            });
        } else {
            ispostData = true;
            mui.toast(res.message);
        }
    }, function (err) {
        ispostData = true;
        mui.toast(err.message);
    });
}

function agreement(curImg) {
    if (curImg.src.indexOf("check1.png") != -1) {
        curImg.src = "images/check0.png";
    } else {
        curImg.src = "images/check1.png";
    }
}

function msgclose() {
    $(".msg-alert").hide();
    window.location.href = "house2.html";
}

function showtip(imgIndex) {
    if (imgIndex == 0) {
        $("#divTip0").toggle();
        setTimeout(function () {
            $("#divTip0").hide();
        }, 2000);
    }
    else if (imgIndex == 1) {
        $("#divTip1").toggle();
        setTimeout(function () {
            $("#divTip1").hide();
        }, 2000);
    }
    else {
        $("#divTip2").toggle();
        setTimeout(function () {
            $("#divTip2").hide();
        }, 5000);
    }
}

function toggleFloor() {
    $(".floor").toggle();
    $(".moreImg").attr("src", $(".moreImg").attr("src") == "images/more1.png" ? "images/more2.png" : "images/more1.png");
}

function closequestion() {
    $(".msg-question").hide();
}

function chooseRentalType(index) {
    for (var i = 0; i < 4; i++) {
        if (index == i && $("#chk" + i).is(':checked')) {
            rentalType = rentalTypes[i];
            $("#chk" + i).attr("checked", true);
            $("#img" + i).attr("src", simgs[i]);
        } else {
            $("#img" + i).attr("src", imgs[i]);
            $("#chk" + i).get(0).checked = false;
        }
    }
}

//
var isApply = true;

function apply(yuefu) {
    if (!isApply) {
        return false;
    }
    isApply = false;
    setTimeout(function () {
        isApply = true;
    }, 5000);
    setCookie(constants.COOKIES.YUEFU, yuefu);
    setCookie(constants.COOKIES.LEASEID, leaseId);
    getInvoke(constants.URLS.GETCURRENTHOUSEACCOUNTINFO, function (res) {
        if (res.isVerified) {
            window.location.href = "apply2.html";
        } else {
            var data = {
                realName: res.realName,
                idCardNo: res.credentialNo,
                cellphone: res.cellphone
            };
            postInvoke(constants.URLS.THREEFACTORVERIFY, data, function (res1) {
                if (res1.succeeded) {
                    window.location.href = "apply2.html";
                } else {
                    window.location.href = "apply1.html";
                }
            }, function (err) {
                mui.toast(err.message);
            });
        }
    });
}

function selectFloor(index) {
    $(".swiper-slide").removeClass("active");
    $(".swiper-slide").eq(index).addClass("active");
    $("#txtFloor").text($(".swiper-slide").eq(index).html());
    roomList = houseList[index];
    roomNumber = "";
    $("#txtRoomNumber").val("");
    $(".rooms").html("");
    $(".floor").hide();
    $(".roomLine").show();
}

function selectRoom(cur) {
    $(".room").removeClass("active");
    $(cur).addClass("active");
    roomNumber = $(cur).html();
    $("#txtRoomNumber").val(roomNumber);
    $(".roomLine").show();
    $(".roomlist").hide();
}

function getYouthApartmentInfo() {
    var sb = new StringBuffer();
    var slide = "<div class='swiper-slide' onclick='selectFloor({0})'>{1}</div>";
    getInvoke(constants.URLS.GETYOUTHAPARTMENTINFO.format(source), function (res) {
        houseList = res.houseList;
        var floors = res.floors;
        for (var i = 0; i < floors.length; i++) {
            sb.Append(slide.format(i, floors[i]));
        }
        $(".swiper-wrapper").html(sb.ToString());
        setTimeout(function () {
            new Swiper('.swiper-container', {
                width: 40,
                spaceBetween: 10
            });
            $(".floor").hide();
        }, 0);
    });
}

var filterRoomlist = function (keywords) {
    roomNumber = "";
    var room = "<div class=\"room\" onclick=\"selectRoom(this)\">{0}</div>";
    var sb = new StringBuffer();
    for (var i = 0; i < roomList.length; i++) {
        if (roomList[i].indexOf(keywords) != -1) {
            sb.Append(room.format(roomList[i]));
        }
    }
    $(".rooms").html(sb.ToString());
    $(".roomlist").show();
    $(".roomLine").hide();
}

var AddEvt = function (ele, evt, fn) {
    if (document.addEventListener) {
        ele.addEventListener(evt, fn, false);
    } else if (document.attachEvent) {
        ele.attachEvent('on' + (evt == "input" ? "propertychange" : evt), fn);
    } else {
        ele['on' + (evt == "input" ? "propertychange" : evt)] = fn;
    }
};

$(document).ready(function () {
    productno = getURLQuery("productno");
    source = getURLQuery("source");
    getYouthApartmentInfo();
    AddEvt(document.getElementById("txtRoomNumber"), 'input', function () {
        if (roomList == null) {
            $("#txtRoomNumber").val("");
            mui.toast(constants.msgInfo.floor2);
            return false;
        }
        var keywords = $("#txtRoomNumber").val();
        filterRoomlist(keywords);
    });
});
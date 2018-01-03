/**
 * Created by long.jiang on 2016/12/14.
 */
Date.prototype.DateAdd = function (interval, number) {
    switch (interval.toLowerCase()) {
        case "y":
            return new Date(this.setFullYear(this.getFullYear() + number));
        case "m":
            return new Date(this.setMonth(this.getMonth() + number));
        case "d":
            return new Date(this.setDate(this.getDate() + number));
    }
}

var getDiffYmdBetweenDate = function (sDate1, sDate2) {
    var fixDate = function (sDate) {
        var aD = sDate.split('-');
        for (var i = 0; i < aD.length; i++) {
            aD[i] = fixZero(parseInt(aD[i]));
        }
        return aD.join('-');
    };
    var fixZero = function (n) {
        return n < 10 ? '0' + n : n;
    };
    var fixInt = function (a) {
        for (var i = 0; i < a.length; i++) {
            a[i] = parseInt(a[i]);
        }
        return a;
    };
    var getMonthDays = function (y, m) {
        var aMonthDays = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if ((y % 400 == 0) || (y % 4 == 0 && y % 100 != 0)) {
            aMonthDays[2] = 29;
        }
        return aMonthDays[m];
    };
    var y = 0;
    var m = 0;
    var d = 0;
    var sTmp;
    var aTmp;
    sDate1 = fixDate(sDate1);
    sDate2 = fixDate(sDate2);
    if (sDate1 > sDate2) {
        sTmp = sDate2;
        sDate2 = sDate1;
        sDate1 = sTmp;
    }
    var aDate1 = sDate1.split('-');
    aDate1 = fixInt(aDate1);
    var aDate2 = sDate2.split('-');
    aDate2 = fixInt(aDate2);
    y = aDate2[0] - aDate1[0];
    if (sDate2.replace(aDate2[0], '') < sDate1.replace(aDate1[0], '')) {
        y = y - 1;
    }
    //计算月份
    aTmp = [aDate1[0] + y, aDate1[1], fixZero(aDate1[2])];
    while (true) {
        if (aTmp[1] == 12) {
            aTmp[0]++;
            aTmp[1] = 1;
        } else {
            aTmp[1]++;
        }
        if (([aTmp[0], fixZero(aTmp[1]), aTmp[2]]).join('-') <= sDate2) {
            m++;
        } else {
            break;
        }
    }
    //计算天数
    aTmp = [aDate1[0] + y, aDate1[1] + m, aDate1[2]];
    if (aTmp[1] > 12) {
        aTmp[0]++;
        aTmp[1] -= 12;
    }
    while (true) {
        if (aTmp[2] == getMonthDays(aTmp[0], aTmp[1])) {
            aTmp[1]++;
            aTmp[2] = 1;
        } else {
            aTmp[2]++;
        }
        sTmp = ([aTmp[0], fixZero(aTmp[1]), fixZero(aTmp[2])]).join('-');
        if (sTmp <= sDate2) {
            d++;
        } else {
            break;
        }
    }
    return {y: y, m: m, d: d};
};

var isPaidDeposit = true;
var productno = "";
var source = "";
var roomNumber = "";
var floor = "";
var decoration = "";
//
var depositPeriod = 1;
var ispostData = true;
var leaseTerm = 0;
var surplusDays = 0;
var leaseId = "";
var rentalType = "Full";
var rentalTypes = ["Monthly", "Quarterly", "SixMonthly", "Full"];
var imgs = ["images/Monthly.png", "images/Quarterly.png", "images/SixMonthly.png", "images/Yearly.png"];
var simgs = ["images/Monthlys.png", "images/Quarterlys.png", "images/SixMonthlys.png", "images/Yearlys.png"];

//
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
    roomNumber = $("#txtRoomNumber").val();
    if (roomNumber == '') {
        mui.toast(constants.msgInfo.roomNumber);
        return false;
    }
    floor = $("#txtFloor").val();
    if (floor == '') {
        mui.toast(constants.msgInfo.floor);
        return false;
    }
    if (!constants.REGEX.FLOOR.test(floor)) {
        mui.toast(constants.msgInfo.floorerr);
        return false;
    }
    decoration = $("#lbDecoration").text();
    if (decoration == '') {
        mui.toast(constants.msgInfo.decoration);
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
    var tenementAmount = $("#txtTenementAmount").val();
    if (tenementAmount == '') {
        tenementAmount = 0;
    }
    if (!constants.REGEX.AMOUNT.test(tenementAmount)) {
        mui.toast(constants.msgInfo.tenementAmounterr);
        return false;
    }
    /* var leaseOrderDay = $("#txtLeaseOrderDay").val();
     if (leaseOrderDay === '') {
     mui.toast(constants.msgInfo.leaseOrderDay);
     return false;
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
        decoration: decoration,
        client: "M"
    };
    ispostData = false;
    postInvoke(constants.URLS.CREATEHOUSEINFO, houseInfor, function (res) {
        if (res.succeeded) {
            var leaseData = {
                houseId: res.data.houseId,
                outerContractNo: outerContractNo,
                monthRentalAmount: monthRentalAmount * 100,
                depositPeriod: depositPeriod,
                depositAmount: depositAmount * 100,
                tenementAmount: tenementAmount * 100,
                isPaidDeposit: isPaidDeposit,
                leaseTerm: leaseTerm,
                surplusDays: surplusDays,
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
                    }, function (res2) {
                        console.log(res2);
                    });
                    /* if (rentalType != "Monthly" && leaseTerm >= 3) {
                         $(".msg-alert").show();
                     }
                     else {
                         mui.toast(constants.msgInfo.leaseInfo);
                         setTimeout(function () {
                             window.location.href = "house2.html";
                         }, 2000);
                     }*/
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

function showquestion() {
    $(".msg-question").show();
}

function closequestion() {
    $(".msg-question").hide();
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

function more() {
    $(".more").toggle();
    if ($("#imgMore").attr("src").indexOf("more1.png") != -1) {
        $("#imgMore").attr("src", "images/more2.png");
    } else {
        $("#imgMore").attr("src", "images/more1.png");
    }
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

var isApply = true;

function apply() {
    if (!isApply) {
        return false;
    }
    isApply = false;
    setTimeout(function () {
        isApply = true;
    }, 5000);
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

$(document).ready(function () {
    productno = getURLQuery("productno");
    source = getURLQuery("source");
});
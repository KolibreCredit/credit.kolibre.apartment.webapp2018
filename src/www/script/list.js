/**
 * Created by long.jiang on 2016/12/14.
 */

function addHouse() {
    var tag = getCookie(constants.COOKIES.TAG);
    if (tag == 'yuju') {
        window.location.href = "houseyuju.html";
    }
    else if (tag == 'boke') {
        window.location.href = "houseboke.html";
    }
    else if (tag == 'kangdou') {
        window.location.href = "housekangdou.html";
    }
    else if (tag == 'mozu') {
        window.location.href = "housemozu.html";
    }
    else {
        window.location.href = "house.html";
    }
}

function apply(leaseId) {
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

function showApply(leaseId) {
    setCookie(constants.COOKIES.LEASEID, leaseId);
    $(".msg-apply").show();
}
function hideApply() {
    $(".msg-apply").hide();
}

function apply2(yuefu) {
    setCookie(constants.COOKIES.YUEFU, yuefu);
    getInvoke(constants.URLS.GETCURRENTHOUSEACCOUNTINFO, function (res) {
        if (res.isVerified) {
            $(".msg-apply").hide();
            window.location.href = "apply2.html";
        } else {
            var data = {
                realName: res.realName,
                idCardNo: res.credentialNo,
                cellphone: res.cellphone
            };
            postInvoke(constants.URLS.THREEFACTORVERIFY, data, function (res1) {
                if (res1.succeeded) {
                    $(".msg-apply").hide();
                    window.location.href = "apply2.html";
                } else {
                    $(".msg-apply").hide();
                    window.location.href = "apply1.html";
                }
            }, function (err) {
                mui.toast(err.message);
            });
        }
    });
}

function apply3(leaseId) {
    setCookie(constants.COOKIES.YUEFU, "true");
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

function checkout(leaseId) {
    window.location.href = "lease.html?leaseId={0}&url={1}".format(leaseId, 'list.html');
}

function view(leaseId) {
    window.location.href = "view.html?leaseId={0}".format(leaseId);
}

function cancel(leaseId) {
    $("#lbLeaseId").html(leaseId);
    $(".msg-alert").show();
}

function cancelCheckout() {
    var data = {
        leaseId: $("#lbLeaseId").html()
    };
    postInvoke(constants.URLS.CANCELCHECKOUT, data, function (res) {
        if (res.succeeded) {
            $(".msg-alert").hide();
            getLeases();
        } else {
            mui.toast(res.message);
        }
    }, function (err) {
        mui.toast(err.message);
    });
}

function hideMsg() {
    $(".msg-alert").hide();
}

var getRentalType = function (retType, isStaged) {
    var rentalType = "";
    if (retType == "Monthly") {
        rentalType = "月付";
    }
    else if (retType == "ForceMonthly") {
        if (isStaged) {
            rentalType = "月付";
        }
        else {
            rentalType = "全额付";
        }
    }
    else if (retType == "Quarterly") {
        rentalType = "季付";
    }
    else if (retType == "SixMonthly") {
        rentalType = "半年付";
    }
    else {
        rentalType = "全额付";
    }
    return rentalType;
};

function getLeases() {
    getInvoke(constants.URLS.GETLEASES, function (res) {
        if (res.length > 0) {
            var leasesHtml = "";
            var tplLeases = $("#tplLeases").html();
            var item = null;
            var lbState = "";
            var btnRental = ""
            var btnApply = "";
            for (var i = 0; i < res.length; i++) {
                item = res[i];
                if (item.processTag == 1) {
                    btnApply = "<button onclick='apply(\"{0}\")' class='btnPay btnActive'>{1}</button>".format(item.leaseId, "申请月付");
                }
                else if (item.processTag == 2) {
                    btnApply = "<button onclick='apply(\"{0}\")' class='btnPay btnActive'>{1}</button>".format(item.leaseId, "生成账单");
                }
                else if (item.processTag == 3) {
                    btnApply = "<button onclick='showApply(\"{0}\")' class='btnPay btnActive'>{1}</button>".format(item.leaseId, "生成账单");
                }
                else if (item.processTag == 4) {
                    btnApply = "<button onclick='apply3(\"{0}\")' class='btnPay btnActive'>{1}</button>".format(item.leaseId, "申请月付");
                }
                else {
                    btnApply = "";
                }
                if (item.isStaged) {
                    lbState = "<span style='color:#7ed321;font-size:14px'>已分期</span>";
                }
                if (item.rentalState == 'Created') {
                    btnRental = "<button onclick='checkout(\"{0}\")' class='btnApply'>申请退租</button>".format(item.leaseId)
                }
                else if (item.rentalState == 'OnCheckout') {
                    lbState = "<span style='color:#ff7e71;font-size:14px'>退租中</span>";
                    btnRental = "<button onclick='cancel(\"{0}\")' class='btnApply'>取消退租</button>".format(item.leaseId);
                } else {
                    btnRental = "";
                    lbState = "";
                }
                leasesHtml += tplLeases.format(
                    item.createTime,
                    lbState,
                    item.rentalState == "Checkout" ? '<img src="images/leasetip2.png" style="width:68px;height:71px;position:absolute;right:0;top:0">' : "",
                    item.houseInfo.source,
                    item.houseInfo.roomNumber,
                    (item.monthRentalAmount / 100).toFixed(2),
                    getRentalType(item.rentalType, item.isStaged),
                    btnApply,
                    btnRental,
                    item.leaseId);
                lbState = "";
            }
            $("#ulLeases").html(leasesHtml);
            setTimeout(function () {
                $(".rental").each(function () {
                    if ($(this).html().trim() == "") {
                        $(this).hide();
                    }
                });
            }, 100);
        } else {
            $("#divAddHouse").hide();
            $("#divNoDate").show();
        }
    }, function (err) {
        $("#divAddHouse").hide();
        $("#divNoDate").show();
        mui.toast(err.message);
    });
}

$(document).ready(function () {
    getLeases();
});

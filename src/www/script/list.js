/**
 * Created by long.jiang on 2016/12/14.
 */
var currentContractId = "";

function apply() {
    var data = {contractId: currentContractId};
    postInvoke(constants.URLS.CREATEYUEFUORDERS, data, function (res) {
        if (res.succeeded) {
            bill();
        } else {
            hideApply();
            mui.toast(res.message);
        }
    }, function (err) {
        hideApply();
        mui.toast(err.message);
    });
}

function showApply(contractId) {
    currentContractId = contractId;
    $(".msg-post").show();
}

function hideApply() {
    currentContractId = "";
    $(".msg-post").hide();
}

function contractConfirm(contractId) {
    window.location.href = "view.html?contractId={0}&confirmed=0".format(contractId);
}

function view(contractId) {
    window.location.href = "view.html?contractId={0}".format(contractId);
}

function eviction(contractId) {
    window.location.href = "lease.html?contractId={0}".format(contractId);
}

function quash() {
    var data = {
        contractId: currentContractId
    };
    postInvoke(constants.URLS.CANCELCHECKOUTAPPLY, data, function (res) {
        $(".msg-alert").hide();
        if (res.succeeded) {
            getCurrentcontracts();
        } else {
            mui.toast(res.message);
        }
    }, function (err) {
        $(".msg-alert").hide();
        mui.toast(err.message);
    });
}

function showQuash(contractId) {
    currentContractId = contractId;
    $(".msg-alert").show();
}

function hideQuash() {
    currentContractId = "";
    $(".msg-alert").hide();
}

var getPayPeriod = function (payPeriod) {
    var rentalType = "";
    if (payPeriod == 3) {
        rentalType = "季付";
    }
    else if (payPeriod == 6) {
        rentalType = "半年付";
    }
    else if (payPeriod == 12) {
        rentalType = "年付";
    }
    else if (payPeriod == 0) {
        rentalType = "全额付";
    }
    else if (payPeriod == 1) {
        rentalType = "月付";
    }
    return rentalType;
};

function getCurrentcontracts() {
    getInvoke(constants.URLS.GETCURRENTCONTRACTS, function (res) {
        if (res.succeeded && res.data.length > 0) {
            var leasesHtml = "";
            var tplLeases = $("#tplLeases").html();
            var item = null;
            var btnControls = "";
            var btnConfirm = "<button onclick='contractConfirm(\"{0}\")' class='btnPay btnActive'>确认租约</button>";
            var btnApply = "<button onclick='showApply(\"{0}\")' class='btnPay btnActive' style='margin-left:10px'>申请月付</button>";
            var btnEviction = "<button onclick='eviction(\"{0}\")' class='btnEviction btnCancel'>申请退租</button>";
            var btnQuash = "<button onclick='showQuash(\"{0}\")' class='btnQuash btnCancel'>取消退租</button>";
            var title = "";
            var titleColor = "";
            var icon = "";
            for (var i = 0; i < res.data.length; i++) {
                icon = "";
                titleColor = "";
                title = "";
                btnControls = "";
                item = res.data[i];
                if (item.confirmed) {
                    if (item.checkoutStatus == "NotCheckout") {
                        btnControls = btnEviction.format(item.contractId);
                        if (item.yueFu) {
                            title = "已分期";
                            titleColor = "staged";
                        } else {
                            btnControls = btnApply.format(item.contractId) + btnEviction.format(item.contractId);
                        }
                    }
                    else if (item.checkoutStatus == "OnCheckout") {
                        btnControls = btnQuash.format(item.contractId);
                        title = "退租中";
                        titleColor = "eviction";
                    }
                    else {
                        icon = "<img src='images/icon_quash.png' class='icon'/>";
                    }
                } else {
                    icon = "<img src='images/icon_queren.png' class='icon'/>";
                    btnControls = btnConfirm.format(item.contractId);
                }
                leasesHtml += tplLeases.format(
                    item.createTime.substring(0, 10),
                    item.apartmentName,
                    item.roomNumber,
                    (item.monthlyAmount / 100).toFixed(2),
                    item.yueFu ? "月付" : getPayPeriod(item.payPeriod),
                    btnControls,
                    icon,
                    titleColor,
                    title,
                    item.contractId
                );
            }
            $("#divLeases").html(leasesHtml);
        } else {
            $("#divLeases").html("");
            $("#divNoData").show();
        }
    }, function (err) {
        mui.toast(err.message);
    });
}

$(document).ready(function () {
    getCurrentcontracts();
});

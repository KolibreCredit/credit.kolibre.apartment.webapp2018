/**
 * Created by long.jiang on 2016/12/14.
 */
function apply(contractId) {

}

function view(contractId) {
    window.location.href = "view.html?contractId={0}".format(contractId);
}

function eviction(contractId) {
    window.location.href = "lease.html?contractId={0}".format(contractId);
}

function quash(contractId) {

}

function confirmLease(contractId) {
    window.location.href = "view.html?contractId={0}".format(contractId);
}

function showVerify(contractId) {
    currentContractId = contractId;
    $(".msg-post").show();
}

function hideVerify() {
    $(".msg-post").hide();
}

function confirmContract() {
    var data = {contractId: currentContractId};
    postInvoke(constants.URLS.CONFIRMCONTRACT, data, function (res) {
        hideVerify();
        if (res.succeeded) {
            getCurrentcontracts();
        } else {
            mui.toast(res.message);
        }
    }, function (err) {
        hideVerify();
        mui.toast(err.message);
    });
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
    return rentalType;
};

function getCurrentcontracts() {
    getInvoke(constants.URLS.GETCURRENTCONTRACTS, function (res) {
        if (res.succeeded && res.data.length > 0) {
            var leasesHtml = "";
            var tplLeases = $("#tplLeases").html();
            var item = null;
            var btnControls = "";
            var btnConfirm = "<button onclick='view(\"{0}\")' class='btnPay btnActive'>确认租约</button>";
            var btnApply = "<button onclick='apply(\"{0}\")' class='btnPay btnActive'>申请月付</button>";
            var btnEviction = "<button onclick='eviction(\"{0}\")' class='btnPay btnActive'>申请退租</button>";
            var btnQuash = "<button onclick='quash(\"{0}\")' class='btnPay btnActive'>取消退租</button>";
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
                            btnControls += btnApply.format(item.contractId);
                        }
                    }
                    else if (item.checkoutStatus == "OnCheckout") {
                        btnControls = btnQuash;
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
                    title
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

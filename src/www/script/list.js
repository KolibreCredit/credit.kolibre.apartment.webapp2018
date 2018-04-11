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


function staged(contractId) {
    window.location.href = "instalment.html?contractId={0}".format(contractId);
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

function getCurrentcontracts() {
    getInvoke(constants.URLS.GETCURRENTCONTRACTS, function (res) {
        if (res.succeeded && res.data.length > 0) {
            var leasesHtml = "";
            var tplLeases = $("#tplLeases").html();
            var item = null;
            var btnControls = "";
            var btnConfirm = "<button onclick='contractConfirm(\"{0}\")' class='btnPay btnActive'>确认租约</button>";
            var btnApply = "<button onclick='showApply(\"{0}\")' class='btnPay btnActive' style='margin-left:10px'>申请月付</button>";
            var btnStaged = "<button onclick='staged(\"{0}\")' class='btnPay btnActive' style='margin-left:10px'>申请分期</button>";
            var btnEviction = "<button onclick='eviction(\"{0}\")' class='btnEviction btnCancel'>申请退租</button>";
            var btnQuash = "<button onclick='showQuash(\"{0}\")' class='btnQuash btnCancel'>取消退租</button>";
            var title = "";
            var titleColor = "";
            var icon = "";
            var quash = "block";
            var confirmCount = 0;
            for (var i = 0; i < res.data.length; i++) {
                icon = "";
                titleColor = "";
                title = "";
                btnControls = "";
                quash = "block";
                item = res.data[i];
                if (item.confirmed) {
                    if (item.checkoutStatus == "NotCheckout") {
                        btnControls = btnEviction.format(item.contractId);
                    }
                    else if (item.checkoutStatus == "OnCheckout") {
                        btnControls = btnQuash.format(item.contractId);
                        title = "退租中";
                        titleColor = "eviction";
                    }
                    else {
                        icon = "<img src='images/icon_quash.png' class='icon'/>";
                        quash = "none";
                    }
                    if (item.canYueFu) {
                        btnControls = btnApply.format(item.contractId) + btnControls;
                    }
                    if (item.canStage) {
                        btnControls = btnStaged.format(item.contractId) + btnControls;
                    }
                    if (item.yueFu) {
                        title = "";
                        titleColor = "staged";
                    }
                    if (item.isStaged) {
                        title = "已分期";
                        titleColor = "staged";
                    }
                } else {
                    icon = "<img src='images/icon_queren.png' class='icon'/>";
                    btnControls = btnConfirm.format(item.contractId);
                    confirmCount = confirmCount + 1;
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
                    item.contractId, quash);
            }
            if (confirmCount > 0) {
                $("#lbConfirmCount").html(confirmCount);
                $("#divTip").show()
                $("#divLeases").html(leasesHtml).addClass("leasesList");
            } else {
                $("#divLeases").html(leasesHtml).removeClass("leasesList");
            }
        } else {
            $("#divTip").hide();
            $("#divLeases").html("");
            $("#divNoData").show();
        }
    }, function (err) {
        mui.toast(err.message);
    });
}

$(document).ready(function () {
    getInvoke(constants.URLS.GETCURRENTTENANT, function (res) {
            if (res.succeeded) {
                if (!res.data.hasInfo) {
                    window.location.href = "verify.html?url={0}".format("list.html");
                }
                else if (!res.data.confirmed) {
                    window.location.href = "confirmTenant.html?url={0}".format("list.html");
                } else {
                    getCurrentcontracts();
                }
            }
        }
    );
});

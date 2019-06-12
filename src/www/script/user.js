function list() {
    window.location.href = "list.html";
}

function waterElectricity() {
    getInvoke(constants.URLS.WHETHERCONFIRMCONTRACT, function (res) {
        if (res.succeeded) {
            if (res.data.needConfirm) {
                $("#lbAlert").html("您的租约处于待确认状态，不能查看智能水电表，请先确认租约。");
                $(".msg-alert").show();
            } else {
                window.location.href = "waterElectricity.html";
            }
        } else {
            mui.toast(res.message);
        }
    }, function (err) {
        mui.toast(err.message);
    });
}

function closeAlert() {
    $(".msg-alert").hide();
}

function gateLock() {
    getInvoke(constants.URLS.WHETHERCONFIRMCONTRACT, function (res) {
        if (res.succeeded) {
            if (res.data.needConfirm) {
                $("#lbAlert").html("您的租约处于待确认状态，不能查看智能门锁，请先确认租约。");
                $(".msg-alert").show();
            } else {
                window.location.href = "gateLock.html";
            }
        } else {
            mui.toast(res.message);
        }
    }, function (err) {
        mui.toast(err.message);
    });
}

$(document).ready(function () {
    getInvoke(constants.URLS.GETCURRENTTENANT, function (res) {
        if (res.succeeded) {
            $('#lbRealName').text(res.data.realName);
            $('#lbCellphone').text(res.data.cellphone);
            $('#star').raty({
                score: parseFloat(res.data.creditRating) / 2,
                path: 'images/star3',
                readOnly: true,
                size: 20
            });
        }
    });
    getInvoke(constants.URLS.GETUNCONFIRMEDCONTRACTCOUNT, function (res) {
        if (res.succeeded) {
            if (res.data > 0) {
                $("a.item1 span").show();
            }
        }
    });
    getInvoke2(constants.URLS.GETREJECTEDINVOICECOUNT, function (res) {
        if (res.succeeded) {
            if (res.data > 0) {
                $("#lbRejectedInvoiceCount").html("{0}条申请被驳回".format(res.data > 99 ? "99+" : res.data));
                $(".rejectedTip").css({"display": "inline-block"});
            }
        }
    });
});
var invoiceTitles = null;
var selectIndex = -1;

function showDelete(tabIndex) {
    selectIndex = tabIndex;
    $("#lbTitleName").html(invoiceTitles[tabIndex].titleName);
    $("#divDelete").show();
}

function hideDelete() {
    setTimeout(function () {
        mui.swipeoutClose($(".mui-table-view-cell").eq(selectIndex)[0]);
        $("#divDelete").hide();
    }, 100);
}


function getInvoiceTitles() {
    $("#divNodata").hide();
    getInvoke(constants.URLS.GETTENANTINVOICETITLES, function (res) {
        if (res.succeeded && res.data.length > 0) {
            invoiceTitles = res.data;
            var items = [], item = null;
            var tplItem = $("#tplItem").html();
            for (var i = 0; i < invoiceTitles.length; i++) {
                item = invoiceTitles[i];
                items.push(tplItem.format(item.titleName, (item.titleCategory == "Enterprise" ? "公司抬头" : "个人抬头"), (item.asDefault ? "inline-block" : "none"), i));
            }
            $("#divInvoiceTitles ul").html(items.join("")).show();
        }
        else {
            $("#divNodata").show();
        }
    });
}

function acquiesce(tabIndex) {
    var item = invoiceTitles[tabIndex];
    var data = {
        titleInfoId: item.titleInfoId,
        titleCategory: item.titleCategory,
        titleName: item.titleName,
        taxpayerNo: (item.titleCategory == "Enterprise" ? item.taxpayerNo : ""),
        asDefault: true
    };
    postInvoke(constants.URLS.UPDATEINVOICETITLE, data, function (res) {
        if (res.succeeded) {
            mui.toast("设置默认成功");
            setTimeout(function () {
                mui.swipeoutClose($(".mui-table-view-cell").eq(tabIndex)[0]);
                getInvoiceTitles();
            }, 1000);
        } else {
            mui.toast(res.message);
        }
    }, function (res) {
        mui.toast(res.message);
    });
}

function deleteInvoiceTitle() {
    var item = invoiceTitles[selectIndex];
    var data = {
        id: item.titleInfoId
    };
    postInvoke(constants.URLS.DELETEINVOICETITLE, data, function (res) {
        if (res.succeeded) {
            mui.toast("发票抬头删除成功");
            setTimeout(function () {
                mui.swipeoutClose($(".mui-table-view-cell").eq(selectIndex)[0]);
                getInvoiceTitles();
            }, 1000);
        } else {
            mui.toast(res.message);
        }
    }, function (res) {
        mui.toast(res.message);
    });
}

function edit(tabIndex) {
    window.location.href = "invoiceTitle.html?itemInvoiceTitle=" + JSON.stringify(invoiceTitles[tabIndex]);
}

function addInvoiceTitle() {
    window.location.href = "invoiceTitle.html?itemInvoiceTitle=0";
}

function itemSelect(tabIndex) {
    setCookie(constants.COOKIES.INVOICE2, JSON.stringify(invoiceTitles[tabIndex]));
    window.location.href = "invoice2.html";
}

$(document).ready(function () {
    getInvoiceTitles();
});
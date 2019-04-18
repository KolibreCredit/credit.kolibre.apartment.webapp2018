var orderType = "<span>{0}</span>";

var assembleOrderTypes = function (orders) {
    var items = [], item = null;
    for (var i = 0; i < orders.length; i++) {
        item = orders[i];
        items.push(orderType.format(item.orderType == "CustomDeposit" ? item.orderTypeName : getOrderType(item.orderType)));
    }
    return items.join("");
};

function getInvoiceInfos() {
    $("#divNodata").hide();
    getInvoke(constants.URLS.GETINVOICEINFOS, function (res) {
        if (res.succeeded && res.data.length > 0) {
            var items = [], item = null;
            var tplItem = $("#tplItem").html();
            for (var i = 0; i < res.data.length; i++) {
                item = res.data[i];
                items.push(tplItem.format(item.invoiceInfoId, assembleOrderTypes(item.orderInfos), (item.invoiceAmount * 0.01).toFixed(2), moment(item.createTime).format('YYYY-MM-DD HH:mm'), (item.invoiceMedium == "Digital" ? "电子发票" : "纸质发票"), item.invoiceMedium, getInvoiceState(item.invoiceState), item.invoiceState));
            }
            $("#divInvoiceList").html(items.join("")).show();
        }
        else {
            $("#divNodata").show();
        }
    });
}

function detail(invoiceInfoId) {
    window.location.href = "invoiceDetail.html?invoiceInfoId=" + invoiceInfoId;
}

$(document).ready(function () {
    getInvoiceInfos();
});
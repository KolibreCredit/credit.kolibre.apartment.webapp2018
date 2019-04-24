Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

var contractId = "", orderId = "";
var contracts = null, orders = null;
var itemContract = null, itemOrder = null;
var itemIndexs = null, selectOrders = null;

//
function getInvoiceOrder(contractId) {
    itemIndexs = new Array();
    $('.billList').html('');
    $('#divNodata2').hide();
    getInvoke(constants.URLS.GETINVOICEORDER.format(contractId), function (res) {
        if (res.succeeded && res.data.length > 0) {
            orders = res.data;
            var items = [];
            var tplBillItem = $("#tplBillItem").html();
            var selectIndex = 0;
            for (var i = 0; i < orders.length; i++) {
                itemOrder = orders[i];
                if (itemOrder.orderId == orderId) {
                    selectIndex = i;
                }
                items.push(tplBillItem.format(i, "images/months/{0}".format(moment(itemOrder.actualPaymentTime).format('MM') + "s.png")
                    , (itemOrder.orderType == "CustomDeposit" ? itemOrder.orderTypeName : getOrderType(itemOrder.orderType))
                    , (itemOrder.invoiceAmount * 0.01).toFixed(2)
                    , moment(itemOrder.actualPaymentTime).format('YYYY-MM-DD HH:mm')));
            }
            $(".billList").html(items.join(""));
            $(".step1").show();
            itemBillSelect(selectIndex);
        }
        else {
            $('#divNodata2').show();
            $(".step1").hide();
        }
    });
}

function getContracts() {
    getInvoke(constants.URLS.INVOICEGETCONTRACTS.format(contractId), function (res) {
        if (res.succeeded && res.data.length > 0) {
            contracts = res.data;
            var items = [];
            var tplItem = $("#tplItem").html();
            var selectIndex = 0;
            for (var i = 0; i < contracts.length; i++) {
                itemContract = contracts[i];
                if (itemContract.isDefault) {
                    selectIndex = i;
                }
                items.push(tplItem.format("item", "{0}({1})".format(itemContract.apartmentName, itemContract.roomNumber), i));
            }
            $(".contract").html(items.join(""));
            $(".step0").show();
            itemContractSelect(selectIndex);
        }
        else {
            $(".step0").hide();
            $("#divNodata").show();
        }
    });
}

function showContract() {
    $("#divContract").show();
}

function itemContractSelect(itemIndex) {
    $(".contract .item").removeClass('active').eq(itemIndex).addClass("active");
    itemContract = contracts[itemIndex];
    getInvoiceOrder(itemContract.contractId);
    $("#lbContractInfo").html("{0}({1})".format(itemContract.apartmentName, itemContract.roomNumber));
    $("#divContract").hide();
}

function totalInvoiceAmount() {
    var invoiceAmount = 0, total = 0;
    if (itemIndexs.length > 0) {
        selectOrders = new Array();
        for (var i = 0; i < itemIndexs.length; i++) {
            total = total + 1;
            itemOrder = orders[itemIndexs[i]];
            selectOrders.push(itemOrder);
            invoiceAmount = invoiceAmount + itemOrder.invoiceAmount;
        }
    }
    $("#lbInvoiceAmount").html("{0}个账单, 共{1}元".format(total, (invoiceAmount * 0.01).toFixed(2)));
}

//
function itemBillSelect(itemIndex) {
    var itemObj = $(".billList .billItem").eq(itemIndex);
    if (itemObj.hasClass("active")) {
        itemObj.removeClass("active");
        itemIndexs.remove(itemIndex);
    } else {
        itemObj.addClass("active");
        itemIndexs.push(itemIndex);
    }
    totalInvoiceAmount();
}

function allItemBillSelect() {
    $(".check3").hide();
    $(".check3s").show();
    $(".billList .billItem").addClass("active");
    itemIndexs = new Array();
    for (var i = 0; i < orders.length; i++) {
        itemIndexs.push(i);
    }
    totalInvoiceAmount();
}

function allItemBillDelete() {
    $(".check3").show();
    $(".check3s").hide();
    $(".billList .billItem").removeClass("active");
    itemIndexs = new Array();
    totalInvoiceAmount();
}

function invoice2() {
    if (itemIndexs.length == 0) {
        mui.toast("请选择开票账单");
        return false;
    }
    var orderIds = [];
    var contents = [];
    for (var i = 0; i < selectOrders.length; i++) {
        itemOrder = selectOrders[i];
        orderIds.push(itemOrder.orderId);
        contents.push({
            amount: itemOrder.invoiceAmount,
            content: itemOrder.invoiceContent
        });
    }
    var data = {invoiceInfoId: "", orderIds: orderIds, contents: contents};
    setCookie(constants.COOKIES.INVOICE, "create");
    setCookie(constants.COOKIES.INVOICE1, JSON.stringify(data));
    window.location.href = "invoice2.html";
}

//
$(document).ready(function () {
    contractId = getURLQuery("contractId") || "";
    orderId = getURLQuery("orderId");
    getContracts();
});

//
function invoiceHelp() {
    window.location.href = "invoiceHelp.html";
}

function invoiceMore() {
    window.location.href = "invoiceMore.html";
}

//
var tabIndex = -1;
var needMailIndex = -1;
var titleCategoryIndex = -1;

//
function tabItem(index) {
    if (tabIndex != index) {
        tabIndex = index;
        $('.selectTable td').removeClass('active').eq(tabIndex).addClass('active');
        $(".tabItem").hide().eq(tabIndex).show();
    }
}

//
function tabItemTitleCategory(index) {
    if (titleCategoryIndex != index) {
        titleCategoryIndex = index;
        $(".check3s").attr("src", index == 0 ? "images/check3s.png" : "images/check3.png");
        $(".check3").attr("src", index == 1 ? "images/check3s.png" : "images/check3.png");
        if (index == 0) {
            $(".itemTitle").show();
        } else {
            $(".itemTitle").hide();
        }
    }
}

//
function tabItemNeedMail(index) {
    if (needMailIndex != index) {
        needMailIndex = index;
        $(".needMails").attr("src", index == 0 ? "images/check3s.png" : "images/check3.png");
        $(".needMail").attr("src", index == 1 ? "images/check3s.png" : "images/check3.png");
        $(".itemNeed").css(index == 0 ? {"border-bottom": "1px solid rgba(216, 216, 216, 1)"} : {"border-bottom": "none"});
        if (index == 0) {
            $(".itemNeedMail").show();
        } else {
            $(".itemNeedMail").hide();
        }
    }
}

function confirmInvoiceInfo() {
    var common = {
        invoiceMedium: (tabIndex == 0 ? "Digital" : "Paper"),
        titleCategory: (titleCategoryIndex == 0 ? "Enterprise" : "Personal"),
        titleName: titleData.titleName,
        taxpayerNo: (titleCategoryIndex == 0 ? titleData.taxpayerNo : ""),
        invoiceNote: moreData.invoiceNote,
        address: moreData.address,
        phoneNumber: moreData.phoneNumber,
        bankName: moreData.bankName,
        bankAccount: moreData.bankAccount,
        email: email,
        needMail: (needMailIndex == 0 ? true : false),
        receiverName: receiverName,
        receiverPhone: receiverPhone,
        mailDistrict: mailDistrict,
        mailAddress: mailAddress
    };
    var create = {
        orderIds: ordersData.orderIds,
        contents: ordersData.contents
    };
    var modify = {
        invoiceInfoId: ordersData.invoiceInfoId
    };
    var apiUrl = "";
    var data = null;
    if (opr == "create") {
        apiUrl = constants.URLS.CREATEINVOICEINFO;
        data = Object.assign({}, create, common);

    } else {
        apiUrl = constants.URLS.MODIFYINVOICEINFO;
        data = Object.assign({}, modify, common);
    }
    postInvoke(apiUrl, data, function (res) {
        if (res.succeeded) {
            deleteInvoice();
            mui.toast("发票信息提交成功");
            setTimeout(function () {
                window.location.href = "invoiceList.html";
            }, 1000);
        } else {
            mui.toast(res.message);
        }
    }, function (res) {
        mui.toast(res.message);
    });
}
//
var email = "";
var receiverName = "";
var receiverPhone = "";
var mailDistrict = "";
var mailAddress = "";

function submitInvoiceInfo() {
    if (titleData == null) {
        mui.toast("请选择发票抬头");
        return false;
    }
    email = $("#txtEmail").val();
    if (tabIndex == 0) {
        if (email == "") {
            mui.toast("电子邮箱不能为空");
            return false;
        }
        if (!constants.REGEX.EMAIL.test(email)) {
            mui.toast("电子邮箱格式错误");
            return false;
        }
    }
    receiverName = $("#txtReceiverName").val();
    receiverPhone = $("#txtReceiverPhone").val();
    mailDistrict = $("#txtMailDistrict").val();
    mailAddress = $("#txtMailAddress").val();
    if (tabIndex == 1 && needMailIndex == 0) {
        if (receiverName == "") {
            mui.toast("收件人不能为空");
            return false;
        }
        if (receiverPhone == "") {
            mui.toast("联系电话不能为空");
            return false;
        }
        if (mailDistrict == "") {
            mui.toast("所在地区不能为空");
            return false;
        }
        if (mailAddress == "") {
            mui.toast("详细地址不能为空");
            return false;
        }
    }
    $(".invoiceTips div").hide();
    $("#lbInvoiceMedium").show().html((tabIndex == 0 ? "开具电子发票" : "开具纸质发票"));
    $("#lbInvoiceMedium2").show().find("span").html((tabIndex == 0 ? "电子发票" : "纸质发票"));
    $("#lbTitleName").show().find("span").html(titleData.titleName);
    if (titleCategoryIndex == 0) {
        $("#lbTaxpayerNo").show().find("span").html(titleData.taxpayerNo);
    }
    if (tabIndex == 0) {
        $("#lbEmail").show().find("span").html(email);
    } else {
        if (needMailIndex == 0) {
            $("#lbNeedMail").show().find("span").html("是");
            $("#lbReceiverName").show().find("span").html(receiverName);
            $("#lbReceiverPhone").show().find("span").html(receiverPhone);
            $("#lbMailDistrict").show().find("span").html(mailDistrict);
            $("#lbMailAddress").show().find("span").html(mailAddress);
        } else {
            $("#lbNeedMail").show().find("span").html("否");
        }
    }
    $(".step1").show();
}

function closeInvoiceInfo() {
    $(".step1").hide();
}

function deleteInvoice() {
    deleteCookie(constants.COOKIES.INVOICE);
    deleteCookie(constants.COOKIES.INVOICE1);
    deleteCookie(constants.COOKIES.INVOICE3);
    deleteCookie(constants.COOKIES.INVOICE4);
}

var opr = "";
var ordersData = null;
var titleData = null;
var moreData = null;
var otherData = null;
//
$(document).ready(function () {
    opr = getCookie(constants.COOKIES.INVOICE);
    ordersData = $.parseJSON(getCookie(constants.COOKIES.INVOICE1));
    var htmlItems = [], tplItem = $("#tplItem").html();
    var item = null, itemTotal = 0;
    for (var i = 0; i < ordersData.contents.length; i++) {
        item = ordersData.contents[i];
        itemTotal = itemTotal + item.amount;
        htmlItems.push(tplItem.format(item.content, (item.amount * 0.01).toFixed(2)));
    }
    $("#lbTotal").html((itemTotal * 0.01).toFixed(2) + "元");
    $("#divSelectItems").html(htmlItems.join(""));
    $("#divSelectItems .itemRow").last().css({"border-bottom": "none"});
    if (ordersData.contents.length > 1) {
        $("#divTotal").show();
    }
    //
    var invoice2 = getCookie(constants.COOKIES.INVOICE2);
    if (invoice2 != "") {
        titleData = $.parseJSON(invoice2);
        $("#txtTitleName").val(titleData.titleName);
        $("#txtTaxpayerNo").val(titleData.taxpayerNo);
        tabItemTitleCategory((titleData.titleCategory == "Enterprise" ? 0 : 1));
    }
    //
    var invoice3 = getCookie(constants.COOKIES.INVOICE3);
    if (invoice3 != "") {
        var moreTotal = 0;
        moreData = $.parseJSON(invoice3);
        if (moreData.invoiceNote != "") {
            moreTotal = moreTotal + 1;
        }
        if (moreData.address != "") {
            moreTotal = moreTotal + 1;
        }
        if (moreData.phoneNumber != "") {
            moreTotal = moreTotal + 1;
        }
        if (moreData.bankName != "") {
            moreTotal = moreTotal + 1;
        }
        if (moreData.bankAccount != "") {
            moreTotal = moreTotal + 1;
        }
        $("#txtInvoiceNotes").val("共5项，已填写{0}项".format(moreTotal));
    }
    if (opr == "modify") {
        var invoice4 = getCookie(constants.COOKIES.INVOICE4);
        otherData = $.parseJSON(invoice4);
        if (otherData.invoiceMedium == "Digital") {
            tabItem(0);
            $("#txtEmail").val(otherData.email);
        } else {
            tabItem(1);
            if (otherData.needMail) {
                tabItemNeedMail(0);
                $("#txtReceiverName").val(otherData.receiverName);
                $("#txtReceiverPhone").val(otherData.receiverPhone);
                $("#txtMailDistrict").val(otherData.mailDistrict);
                $("#txtMailAddress").val(otherData.mailAddress);
            } else {
                tabItemNeedMail(1);
            }
        }
    } else {
        tabItem(0);
    }
});

//
var useMoreData = function () {
    $("#txtInvoiceNote").val(moreData.invoiceNote);
    $("#txtAddress").val(moreData.address);
    $("#txtPhoneNumber").val(moreData.phoneNumber);
    $("#txtBankName").val(moreData.bankName);
    $("#txtBankAccount").val(moreData.bankAccount);
};

var totalMoreData = function () {
    var moreTotal = 0;
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
    $("#txtInvoiceNotes").val(moreTotal == 0 ? "" : "共5项，已填写{0}项".format(moreTotal));
};

function invoiceHelp() {
    setCookie(constants.COOKIES.INVOICE0, tabIndex);
    window.location.href = "invoiceHelp.html";
}

function invoiceMore() {
    $(".mui-content").eq(0).hide();
    $(".mui-content").eq(1).show();
}

function saveInvoiceMore() {
    moreData = {
        invoiceNote: $("#txtInvoiceNote").val(),
        address: $("#txtAddress").val(),
        phoneNumber: $("#txtPhoneNumber").val(),
        bankName: $("#txtBankName").val(),
        bankAccount: $("#txtBankAccount").val()
    };
    var data = {
        requestId: constants.COOKIES.INVOICE3,
        cacheData: moreData
    };
    postInvoke(constants.URLS.SAVEREQUESTDATA, data, function (res) {
        if (res.succeeded) {
            $(".mui-content").eq(0).show();
            $(".mui-content").eq(1).hide();
            totalMoreData();
        } else {
            mui.toast(res.message);
        }
    }, function (err) {
        mui.toast(err.message);
    });
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
        if (titleData == null && index == 0 && titleData0 != null) {
            $("#txtTitleName").val(titleData0.titleName);
            $("#txtTaxpayerNo").val(titleData0.taxpayerNo);
        }
        if (titleData == null && index == 1 && titleData1 != null) {
            $("#txtTitleName").val(titleData1.titleName);
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

//
var titleName = "";
var taxpayerNo = "";
var email = "";
var receiverName = "";
var receiverPhone = "";
var mailDistrict = "";
var mailAddress = "";

function submitInvoiceInfo() {
    titleName = $("#txtTitleName").val();
    if (titleName == "") {
        mui.toast("请选择发票抬头");
        return false;
    }
    taxpayerNo = $("#txtTaxpayerNo").val();
    email = $("#txtEmail").val();
    if (titleCategoryIndex == 0) {
        if (taxpayerNo == "") {
            mui.toast("发票税号不能为空");
            return false;
        }
        if (!/^[0-9A-Z]{15,20}$/.test(taxpayerNo)) {
            mui.toast("发票税号格式错误");
            return false;
        }
    }
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
    $("#lbTitleName").show().find("span").html(titleName);
    if (titleCategoryIndex == 0) {
        $("#lbTaxpayerNo").show().find("span").html(taxpayerNo);
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

function confirmInvoiceInfo() {
    var common = {
        invoiceMedium: (tabIndex == 0 ? "Digital" : "Paper"),
        titleCategory: (titleCategoryIndex == 0 ? "Enterprise" : "Personal"),
        titleName: titleName,
        taxpayerNo: (titleCategoryIndex == 0 ? taxpayerNo : ""),
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
        data = $.extend(true, common, create);

    } else {
        apiUrl = constants.URLS.MODIFYINVOICEINFO;
        data = $.extend(true, common, modify);
    }
    postInvoke(apiUrl, data, function (res) {
        if (res.succeeded) {
            mui.toast("发票信息提交成功");
            setCookie(constants.COOKIES.INVOICE, "");
            setCookie(constants.COOKIES.INVOICE0, "0");
            postInvoke(constants.URLS.CLEARDATACACHA, {}, function () {
                window.location.replace("invoiceList.html");
            }, function () {
                window.location.replace("invoiceList.html");
            });
        } else {
            mui.toast(res.message);
        }
    }, function (res) {
        mui.toast(res.message);
    });
}

function closeInvoiceInfo() {
    $(".step1").hide();
}

var opr = "";
var ordersData = null;
var titleData = null;
var titleData0 = null;
var titleData1 = null;
var moreData = {
    invoiceNote: "",
    address: "",
    phoneNumber: "",
    bankName: "",
    bankAccount: ""
};
var otherData = null;
//
$(document).ready(function () {
    //invoice
    opr = getCookie(constants.COOKIES.INVOICE);
    //invoice1
    getInvoke(constants.URLS.GETREQUESTDATA.format(constants.COOKIES.INVOICE1), function (res) {
        if (res.data.cacheData != null) {
            ordersData = res.data.cacheData;
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
        }
    });
    //invoice2
    getInvoke(constants.URLS.GETREQUESTDATA.format(constants.COOKIES.INVOICE2), function (res) {
        if (res.data.cacheData != null) {
            titleData = res.data.cacheData;
            $("#txtTitleName").val(titleData.titleName);
            $("#txtTaxpayerNo").val((titleData.titleCategory == "Enterprise" ? titleData.taxpayerNo : ""));
            tabItemTitleCategory((titleData.titleCategory == "Enterprise" ? 0 : 1));
        } else {
            getInvoke(constants.URLS.GETTENANTINVOICETITLES, function (res) {
                if (res.succeeded && res.data.length > 0) {
                    var item = null;
                    var invoiceTitles = res.data;
                    for (var i = 0; i < invoiceTitles.length; i++) {
                        item = invoiceTitles[i];
                        if (item.asDefault) {
                            if (item.titleCategory == "Enterprise") {
                                titleData0 = item;
                            } else {
                                titleData1 = item;
                            }
                        }
                    }
                    tabItemTitleCategory(0);
                }
            });
        }
    });
    // invoice3
    getInvoke(constants.URLS.GETREQUESTDATA.format(constants.COOKIES.INVOICE3), function (res) {
        if (res.data.cacheData != null) {
            moreData = res.data.cacheData;
            useMoreData();
            totalMoreData();
        }
    });
    //invoice0
    var medium = getCookie(constants.COOKIES.INVOICE0);
    if (opr == "modify") {
        // invoice4
        // document.title = "修改申请";
        getInvoke(constants.URLS.GETREQUESTDATA.format(constants.COOKIES.INVOICE4), function (res) {
            if (res.data.cacheData != null) {
                otherData = res.data.cacheData;
                if (medium == "0") {
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
            }
        });
    } else {
        if (medium == "0") {
            tabItem(0);
        } else {
            tabItem(1);
        }
    }
});

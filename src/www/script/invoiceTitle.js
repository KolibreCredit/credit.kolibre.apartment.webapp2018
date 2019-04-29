var categoryIndex = -1;
var asDefault = true;
var resItem = null;

//
function titleCategory(tabIndex) {
    if (categoryIndex != tabIndex) {
        categoryIndex = tabIndex;
        $(".check3s").attr("src", categoryIndex == 0 ? "images/check3s.png" : "images/check3.png");
        $(".check3").attr("src", categoryIndex == 1 ? "images/check3s.png" : "images/check3.png");
        if (categoryIndex == 0) {
            $(".itemRow").eq(1).show();
        } else {
            $(".itemRow").eq(1).hide();
        }
    }
}

//
var isPostData = true;
function addInvoiceTitle() {
    if (!isPostData) {
        mui.toast(constants.msgInfo.postData);
        return false;
    }
    var titleName = $("#txtTitleName").val();
    if (titleName == "") {
        mui.toast("发票抬头名称不能为空");
        return false;
    }
    var taxpayerNo = $("#txtTaxpayerNo").val();
    if (categoryIndex == 0) {
        if (taxpayerNo == "") {
            mui.toast("发票税号不能为空");
            return false;
        }
        if (!/^[0-9A-Z]{15,20}$/.test(taxpayerNo)) {
            mui.toast("发票税号格式错误");
            return false;
        }
    }
    var data = null;
    if (resItem != null) {
        data = {
            titleInfoId: resItem.titleInfoId,
            titleCategory: (categoryIndex == 0 ? "Enterprise" : "Personal"),
            titleName: titleName,
            taxpayerNo: (categoryIndex == 0 ? taxpayerNo : ""),
            asDefault: asDefault
        };
    } else {
        data = {
            titleCategory: (categoryIndex == 0 ? "Enterprise" : "Personal"),
            titleName: titleName,
            taxpayerNo: (categoryIndex == 0 ? taxpayerNo : ""),
            asDefault: asDefault
        };
    }
    isPostData = false;
    postInvoke((resItem == null ? constants.URLS.ADDINVOICETITLE : constants.URLS.UPDATEINVOICETITLE), data, function (res) {
        isPostData = true;
        if (res.succeeded) {
            mui.toast("发票抬头提交成功");
            setTimeout(function () {
               window.location.href = "invoiceHelp.html";
            }, 1000);
        } else {
            mui.toast(res.message);
        }
    }, function (res) {
        isPostData = true;
        mui.toast(res.message);
    });
}

//
$(document).ready(function () {
    var itemInvoiceTitle = getURLQuery("itemInvoiceTitle");
    if (itemInvoiceTitle != "0") {
        document.title = "编辑抬头";
        resItem = $.parseJSON(itemInvoiceTitle);
        $("#txtTitleName").val(resItem.titleName);
        if (resItem.titleCategory == "Enterprise") {
            $("#txtTaxpayerNo").val(resItem.taxpayerNo);
            titleCategory(0);
        } else {
            titleCategory(1);
        }
        asDefault = resItem.asDefault;
        if (!resItem.asDefault) {
            $(".mui-switch").removeClass("mui-active");
        }
    } else {
        resItem = null;
        titleCategory(0);
    }
    mui('.mui-switch').each(function () {
        this.addEventListener('toggle', function (event) {
            asDefault = event.detail.isActive;
        });
    });
});
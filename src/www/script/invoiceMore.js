//
function saveInvoiceMore() {
    var data = {
        invoiceNote: $("#txtInvoiceNote").val(),
        address: $("#txtAddress").val(),
        phoneNumber: $("#txtPhoneNumber").val(),
        bankName: $("#txtBankName").val(),
        bankAccount: $("#txtBankAccount").val()
    };
    setCookie(constants.COOKIES.INVOICE3, JSON.stringify(data));
    window.location.href = "invoice2.html";
}

var contractId = "";
$(document).ready(function () {
    contractId = getURLQuery("contractId");
    getInvoke(constants.URLS.GETCONTRACTDETAILS.format(contractId), function (res) {
        if (res.succeeded && res.data != null) {
            var arrImgUrls = [];
            var imgUrls = res.data.checkoutInfo.checkoutConfirmation.split(",");
            imgUrls.forEach(function (imgUrl) {
                if (imgUrl != "") {
                    arrImgUrls.push('<div><img src = "{0}"/></div>'.format(imgUrl))
                }
            });
            document.getElementById("divImgUrls").innerHTML = arrImgUrls.join("");
        }
    });
});
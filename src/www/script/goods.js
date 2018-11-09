var contractId = "";
$(document).ready(function () {
    contractId = getURLQuery("contractId");
    getInvoke(constants.URLS.GETCONTRACTDETAILS.format(contractId), function (res) {
        if (res.succeeded && res.data != null) {
            var roomDetails = res.data.roomDetails;
            var tplDeliveies = $("#tplDeliveies").html();
            $("#divDeliveies").html(tplDeliveies.format(roomDetails.apartmentName, roomDetails.roomNumber,res.data.tenantName, res.data.propertyDeliveies.updateTime.substring(0, 16)));
            //
            var arrImgUrls = [];
            var imgUrls = res.data.propertyDeliveies.fileUrl;
            imgUrls.forEach(function (imgUrl) {
                if (imgUrl != "") {
                    arrImgUrls.push('<div><img src = "{0}"/></div>'.format(imgUrl))
                }
            });
            document.getElementById("divImgUrls").innerHTML = arrImgUrls.join("");
            //
            var goods = res.data.propertyDeliveies.goods;
            var arrGoods = [];
            var tplGood = $("#tplGood").html();
            var tr = "<tr><td>{0}</td><td style='width:40px'>{1}</td><td style='width:40px'>{2}</td></tr>";
            var goodsTypeName = "";
            var arrTrs = [];
            var item = null;
            for (var i = 0; i < goods.length; i++) {
                goodsTypeName = goods[i].goodsTypeName;
                for (var j = 0; j < goods[i].goodsResponses.length; j++) {
                    item = goods[i].goodsResponses[j];
                    arrTrs.push(tr.format(item.name + (item.model ? item.model : "") + (item.remarks ? "<br/>" + item.remarks : ""), item.count, (item.state == "Intact" ? "完好" : "损坏")));
                }
                arrGoods.push(tplGood.format(goodsTypeName, arrTrs.join("")));
                arrTrs = [];
            }
            $("#divGoods").html(arrGoods.join(""));
        }
    });
});
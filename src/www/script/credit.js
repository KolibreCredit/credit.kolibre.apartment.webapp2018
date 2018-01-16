$(document).ready(function () {
    getInvoke(constants.URLS.GETTENANTCREDITINFO, function (res) {
        if (res.succeeded) {
            var path = "";
            var score = parseFloat(res.data.creditRating)/ 2;
            if (score > 0 && score <= 2.5) {
                $(".bg").addClass("bgImg1");
                $(".icon").attr("src", "images/20171212/tip1.png");
                $(".tip").html("您已被列入蜂鸟屋租客黑名单！");
                path = "images/star1";
                $(".black").show();
            }
            else if (score == 3) {
                $(".bg").addClass("bgImg2");
                $(".icon").attr("src", "images/20171212/tip2.png");
                $(".tip").html("信用点滴珍贵，重在积累，请珍视！");
                path = "images/star2";
            }
            else if (score >= 3.5 && score <= 4.5) {
                $(".bg").addClass("bgImg2");
                $(".icon").attr("src", "images/20171212/tip2.png");
                $(".tip").html("哎呀，不好，有逾期了！记得按时交租哦！");
                path = "images/star2";
            }
            else {
                $(".bg").addClass("bgImg3");
                $(".icon").attr("src", "images/20171212/tip3.png");
                $(".tip").html("您的信用是极好的，请继续保持哦！");
                path = "images/star2";
            }
            $('.star').raty({
                score: score,
                path: path,
                readOnly: true,
                size: 17
            });
            if (score < 5) {
                var htmllog = "";
                var tpllog = $("#tplLog").html();
                var item = null;
                for (var i = 0; i < res.data.overdueRecords.length; i++) {
                    item = res.data.overdueRecords[i];
                    htmllog += tpllog.format(item.actualPaymentTime.substring(0, 10), item.orderPaymentTime.substring(0, 10), item.overdueDays);
                }
                $("#divLog").html(htmllog);
            } else {
                $("#divLog").html($("#tplLog2").html());
            }
        }
    });
});

function answer() {
    window.location.href = "answer.html";
}
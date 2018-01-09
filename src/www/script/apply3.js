/**
 * Created by long.jiang on 2017/1/10.
 */
var imgUrl1 = "";
var ispostData = true;
//
function V2UploadImages(imgData, imgIndex) {
    var data = {
        sequenceNo: imgIndex,
        kind: "Selfie",
        base64String:[imgData]
    };
    postInvoke(constants.URLS.UPLOADIMAGESQR, data, function (res) {
        if (res.succeeded) {
            imgUrl1 = res.data.url;
            document.getElementById("img1-0").style.display = 'none';
            document.getElementById("div1-0").style.display = 'none';
            document.getElementById('img1-1').setAttribute('src', imgData);
            document.getElementById("img1-1").style.display = 'inline-block';
            $('#img1').replaceWith('<input type="file" accept="image/*" id="img1" name="img1" class="input-upload-image"/>');
        }
    });
}

function apply() {
    if (!ispostData) {
        mui.toast(constants.msgInfo.postData);
        return false;
    }
    if (imgUrl1 == '') {
        mui.toast(constants.msgInfo.imgIDCarderr);
        return false;
    }
    ispostData = false;
    $(".msg-post").show();
    var contractConfirmInfoId = getCookie(constants.COOKIES.CONTRACTCONFIRMINFOID);
    var data = {
        contractConfirmInfoId: contractConfirmInfoId,
        pictureType: "Selfie",
        pictureUrls: [imgUrl1]
    };
    postInvoke(constants.URLS.UPLOADPICTURES, data, function (res) {
        $(".msg-post").hide();
        ispostData = true;
        if (res.succeeded) {
            mui.toast(constants.msgInfo.imgIDCard);
            setTimeout(function () {
                window.location.href = "apply4.html";
            }, 1000);
        } else {
            mui.toast(res.message);
        }
    }, function (err) {
        ispostData = true;
        $(".msg-post").hide();
        mui.toast(err.message);
    });
}

$(document).ready(function () {
    getInvoke(constants.URLS.GETCURRENTTENANT, function (res) {
        if (res.succeeded) {
            if (res.data.credentialType == "IDCard") {
                $("#img1-0").attr("src", "images/demo4.png");
                $("#lbTitle").html("本人手持身份证照片");

            } else {
                $("#img1-0").attr("src", "images/hz4.png");
                $("#lbTitle").html("本人手持护照照片");
            }
        }
    });
});
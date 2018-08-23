/**
 * Created by long.jiang on 2016/9/1.
 */
var constants = {
    URLS: {
        BILL: "bill.html",
        WEBPAYURL: "https://dev.fengniaowu.com/webpay.html?orderId={0}",
        //
        SEND: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/ValidateCode/Send",
        VERIFY: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/ValidateCode/Verify",
        TENANT: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/Register/Tenant",
        LOGINBYPASSWORD: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/PasswordLogin/Tenant/Login",
        LOGINAUTHCODE: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/ValidateCodeLogin/Tenant/Login",
        QUICKLOGIN: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/ValidateCodeLogin/Tenant/QuickLogin",
        SETPASSWORD: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/Password/Set",
        GETCURRENTTENANT: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/Tenant/GetCurrentTenant",
        TWOFACTORVERIFY: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/Tenant/TwoFactorVerify",
        UPLOADTENANTINFO: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/Tenant/UploadTenantInfo",
        CONFIRMTENANTINFO: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/Tenant/ConfirmTenantInfo",
        UPDATETENANTPHOTO: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/Tenant/UpdateTenantPhoto",
        //
        SIGNATURE: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/File/Signature?url={0}",
        UPLOADIMAGESWEIXIN: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/File/UploadImagesWeiXin",
        UPLOADIMAGESQR: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/File/UploadImagesQR",
        //
        GETUNCONFIRMEDCONTRACTCOUNT: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/Contract/GetUnConfirmedContractCount",
        GETCURRENTCONTRACTS: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/Contract/GetCurrentContracts",
        GETCONTRACTDETAILS: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/Contract/GetContractDetails?contractId={0}",
        TENANTVALIDATECODEVERIFY: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/Tenant/TenantValidateCodeVerify",
        CREATECONFIRMINFO: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/Contract/CreateConfirmInfo",
        UPLOADPICTURES: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/Contract/UploadPictures",
        UPDATECONTACTINFO: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/Contract/UpdateContactInfo",
        GETCONTRACTCONFIRMINFO: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/Contract/GetContractConfirmInfo?contractConfirmInfoId={0}",
        RENDERHTMLTEMPLATE: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/Contract/RenderHtmlTemplate",
        CONFIRMCONTRACT: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/Contract/ConfirmContract",
        GETCONFIRMCONTRACTRESULT: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/Contract/GetConfirmContractResult?confirmContractProcessId={0}",
        CREATECHECKOUTAPPLY: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/Contract/CreateCheckoutApply",
        CANCELCHECKOUTAPPLY: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/Contract/CancelCheckoutApply",
        //
        QUERYALLORDERS: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/Order/QueryAllOrders?orderState={0}",
        CREATEYUEFUORDERS: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/Order/CreateYueFuOrders",
        //
        GETORDERBYORDERID: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/Order/GetOrderByOrderId?orderId={0}",
        CREATETRANSACTION: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/Transaction/CreateTransaction",
        GETTRANSACTION: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/Transaction/GetTransaction?transactionId={0}",
        GETWECHATOPENID: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/Payment/GetWeChatOpenId",
        ORDERPAYMENT: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/Payment/OrderPayment",
        GETTENANTCREDITINFO: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/Tenant/GetTenantCreditInfo",
        CHANGECELLPHONE: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/Tenant/ChangeCellphone",
        GETTENANTBYCELLPHONE: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/Tenant/GetTenantByCellphone?cellphone={0}",
        CHANGECELLPHONEWITHINFO: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/Tenant/ChangeCellphoneWithInfo",
        SENDSMSAUTHCODE: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/StageOrder/SendSmsAuthCode",
        VERIFYSMSAUTHCODE: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/StageOrder/VerifySmsAuthCode",
        GETLOANAPPLYRESULT: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/StageOrder/GetLoanApplyResult",
        FACERECOGNITION: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/StageOrder/FaceRecognition",
        RENDERPRECONFIGUREHTMLTEMPLATE: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/Contract/RenderPreConfigureHtmlTemplate",
        CREATECLEANING: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/DomesticService/CreateCleaning",
        GETTENANTCLEANINGS: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/DomesticService/GetTenantCleanings",
        GETTENANTCLEANING:"https://kc-fengniaowu-talos.dev.kolibre.credit/api/DomesticService/GetTenantCleaning?id={0}",
        CANCELCLEANING:"https://kc-fengniaowu-talos.dev.kolibre.credit/api/DomesticService/CancelCleaning",
        CREATEREPAIR: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/DomesticService/CreateRepair",
        GETTENANTREPAIRS: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/DomesticService/GetTenantRepairs",
        GETTENANTREPAIR:"https://kc-fengniaowu-talos.dev.kolibre.credit/api/DomesticService/GetTenantRepair?id={0}",
        CANCELREPAIR:"https://kc-fengniaowu-talos.dev.kolibre.credit/api/DomesticService/CancelRepair",
        CREATECOMPLAINTSUGGESTION: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/DomesticService/CreateComplaintSuggestion",
        GETTENANTCOMPLAINTSUGGESTIONS: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/DomesticService/GetTenantComplaintSuggestions",
        GETTENANTCOMPLAINTSUGGESTION:"https://kc-fengniaowu-talos.dev.kolibre.credit/api/DomesticService/GetTenantComplaintSuggestion?id={0}",
        CANCELCOMPLAINTSUGGESTION:"https://kc-fengniaowu-talos.dev.kolibre.credit/api/DomesticService/CancelComplaintSuggestion",
        GETALLTENANCIES:"https://kc-fengniaowu-talos.dev.kolibre.credit/api/ShortLink/GetAllTenancies",
        CREATESHORTLINK:"https://kc-fengniaowu-talos.dev.kolibre.credit/api/ShortLink/CreateShortLink",
        CREATERESERVATION: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/RoomSource/CreateReservation",
        GETROOMSOURCERESERVATIONS:"https://kc-fengniaowu-talos.dev.kolibre.credit/api/RoomSource/GetRoomSourceReservations",
        GETROOMSOURCE: "https://kc-fengniaowu-talos.dev.kolibre.credit/api/RoomSource/GetRoomSource?roomId={0}",
        CANCELROOMSOURCERESERVATION:"https://kc-fengniaowu-talos.dev.kolibre.credit/api/RoomSource/CancelRoomSourceReservation"
    },
    COOKIES: {
        XKCSID: 'X-KC-SID',
        TAG: 'X-KC-TAG',
        CONTRACTCONFIRMINFOID: "X-KC-CONTRACTCONFIRMINFOID"
    },
    REGEX: {
        CELLPHONE: /^(13|14|15|16|17|18|19|10)\d{9}$/,
        PASSWORD: /^[a-zA-Z\d~!@#$%^&*_]{6,18}$/,
        PAYMENT_PASSWORD: /^(?![^a-zA-Z~!@#$%^&*_]+$)(?!\D+$).{8,18}$/,
        URL: /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[:?\d]*)\S*$/,
        CREDENTIALNO: /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/,
        BANKCARDNO: /^\d{15,19}$/,
        CHECKCODE: /^\d{6}$/,
        FLOOR: /^\d{1,5}$/,
        AMOUNT: /^\d{1,7}(\.\d{1,2})?$/
    },
    msgInfo: {
        postData: "数据正在提交请稍后",
        error: "系统服务繁忙，请稍后",
        error1: "系统服务繁忙，请稍后！",
        phone: '手机号码不能为空',
        phoneerr: '手机号码格式错误',
        send: '发送成功',
        senderr: '发送失败',
        captcha: '验证码不能为空',
        captchaerr: '验证码格式错误',
        ordernoerr: "验证码获取失败",
        password: '密码不能为空',
        passworderr: '密码格式错误',
        passwordsame: '密码不一致,重新输入',
        register: '注册成功',
        registererr: '注册失败',
        agreement1: '请同意蜂鸟屋注册服务协议',
        agreement2: '请同意蜂鸟屋服务协议',
        agreement3: '请同意蜂鸟屋租房分期服务协议',
        loginSuccess: '登录成功',
        loginErr1: '密码错误',
        loginErr2: '用户未设置登录密码',
        loginErr3: '用户被锁定',
        loginErr4: '用户未注册',
        tokenerr: '请点击发送验证码',
        credentialType: "请选择证件类型",
        realName: "姓名不能为空",
        credentialNo: "证件号码不能为空",
        credentialNoerr: "证件号码格式错误",
        img10err: "身份证正面不能为空",
        img20err: "身份证背面不能为空",
        img11err: "护照个人信息页不能为空",
        img21err: "护照签证信息页不能为空",
        img3err: "手持证件不能为空",
        verify: "{0}提交成功",
        verifyerr: "请提交个人身份信息",
        uploaderr: "身份证上传失败",
        resetPassword: "密码重置成功",
        resetPassworderr: "密码重置失败",
        source: "房屋来源不能为空",
        source1: "请选择具体楼号标签",
        source2: "请选择手机号所属",
        roomNumber: "房号不能为空",
        roomNumber2: "请选择房号",
        floor: "楼层不能为空",
        floorerr: "楼层格式错误",
        floor2: "请选择楼层",
        decoration: "朝向不能为空",
        leaseInfo: "租约信息提交成功",
        outerContractNo: "合同编号不能为空",
        outerContractNoerr: "合同编号格式错误",
        monthRentalAmount: "月租金不能为空",
        monthRentalAmounterr: "月租金格式错误",
        leaseTerm: "剩余月数不能为空",
        leaseTermerr: "剩余月数格式错误",
        leaseTermerr2: "剩余月数是1-12的数字",
        leaseOrderDay: "每期付款日不能为空",
        leaseOrderDayerr: "每期付款日格式错误",
        leaseOrderDayRang: "输入1~31的数字",
        leaseExpiryTime: "合同结束日期错误",
        depositAmount: "押金不能为空",
        depositAmounterr: "押金格式错误",
        tenementAmounterr: "物业费格式错误",
        imgContracterr: "租房合同第{0}页不能为空",
        imgContracterr2: "租房合同不能为空",
        imgIDCarderr: "本人手持身份证照片为空",
        imgFaceRecognition: "人脸识别照片为空",
        faceRecognition: "人脸识别成功",
        imgContract: "租房合同上传成功",
        imgIDCard: "身份证自拍照上传成功",
        linkRealName: "联系人姓名为空",
        linkCellphone: "联系人手机号为空",
        linkRelationship: "联系人关系为空",
        contactInfo: "联系人提交成功",
        rentalTypeerr: "付款方式不能为空",
        accountCellphone: "联系人手机号不能为{0}",
        accountName: "联系人不能为{0}",
        changeCellphone: "手机号修改成功",
        changeCellphoneerr: "手机号修改失败",
        repairType: "请选择维修类型",
        tenantName: "联系人姓名不能为空",
        tenantCellphone: "联系人电话不能为空",
        pickerDate: "请选择上门时间",
        description2: "描述不能为空",
        pictureUrls: "请上传图片资料",
        cleaningType: "请选择保洁类型",
        cancelCleaning:"取消成功",
        shortLink:"短链创建成功",
        cancelRoomSourceReservation:"放弃看房成功",
        contactPhone:"手机号码不能为空",
        contactPhoneerr: "手机号码格式错误",
        appointmentName: "真实姓名不能为空",
        appointment: "预约信息提交成功"
    },
    CONFIGS: {
        APPID: "wxa74d300625108685",
        APPLYS: ["", "apply1.html", "apply2.html", "apply3.html", "apply4.html", "apply5.html"],
        LOGIN: 'login.html?url=##rurl##'
    }
};

$(function(){
    login();
    if(localStorage.PinBaToken && localStorage.PinBaAuths){
        init();
    }else{
        $('.weui-loadmore').hide();
        $('.tokenTips').show();
    }
});
function init(){
    var authsObj = JSON.parse(localStorage.PinBaAuths);
    if(authsObj.avatar){
        $('#avatar').html(`<img src="${localStorage.PinBaAuths.avatar}">`);
    }else{
        $('#avatar').html('<img src="../images/icon/icon_name.png">');
    }
    $('#real_name').html(authsObj.real_name);
    $('#sex').html(authsObj.sex==1?'男':'女');
    $('#company_name').html(authsObj.company_vo.company_name);
    $('#department_name').html(authsObj.department_vo.department_name);
    $('#phone').html(authsObj.phone);
    $('#job_number').html(authsObj.job_number);
    $('.authsContainer').show();
    $('.weui-loadmore').hide();
}
function login() {
        let ajaxData={
            phone:'15603063469',
            udid: '15603063469',
            password: '123123',
            jpush_reg_id: '15603063469',
        }
        $.ajax({
            type: "POST",
            url: "http://175049f64k.51mypc.cn/api/v1/staff/auths/login/",
            data: ajaxData,
            success: function (result) {
                var loginToken = result.token;
                //记录token
                localStorage.PinBaToken = loginToken;
                var authsObj = result;
                localStorage.PinBaAuths = JSON.stringify(authsObj);
                $.ajaxSetup({
                    beforeSend:function (xhr) {
                        xhr.setRequestHeader("authorization", loginToken);
                    },
                });
                //getList();
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log("error");
                console.log(XMLHttpRequest.status);
                console.log(XMLHttpRequest.readyState);
                console.log(textStatus);
            }
        });
    }
    function getList(){
        $.ajax({
            type: "GET",
            url: "http://175049f64k.51mypc.cn/api/v1/staff/faultitems/",
            //data: ajaxData,
            success: function (result) {
                console.log(result)
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log("error");
                console.log(XMLHttpRequest.status);
                console.log(XMLHttpRequest.readyState);
                console.log(textStatus);
            }
        });
    }

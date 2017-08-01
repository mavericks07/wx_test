$(function(){
    //固定底部按钮
    let pageHeight = document.body.clientHeight;
    $('.fullpage').css({'height':pageHeight})

    //密码明文密文切换
    $('.icon_browse').click(function(){
        $(this).toggleClass('fill');
        if($(this).hasClass('fill')){
            $(this).siblings('input')[0].type = 'text';
        }else{
            $(this).siblings('input')[0].type = 'password';
        }
    });

    //获取验证码
    $('#getValidateCode').click(function(){
        $.ajax({
            url: gAjaxUrl.validateCode,
            type: 'POST',
        });

    });

    $('#J-layer-form').validate({
        rules: {
            new_password: {
                required: true,
            },
            new_password_rep: {
                required: true,
                equalTo: 'new_password'
            },
            validate_code: {
                required: true,
            },
        },
        submitHandler:function() {
            $.ajax({
                url: ajaxUrl,
                type:ajaxType,
                data: {
                    new_password: that.billNameInput,
                    validate_code: that.billNameInput,
                },
            })
            .always(function(data) {
                base.ajaxCallback(data,function(){
                    $.toast('提交成功',1000)
                });
            });
        }
    });

    $('.btn-bottom').click(function(){
        $('#J-layer-form').submit();
    });
})

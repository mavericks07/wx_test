$(function(){
	//适配屏幕大小
	var iWidth=document.documentElement.getBoundingClientRect().width;
	iWidth=iWidth>750?750:iWidth;
	iWidth=iWidth<320?320:iWidth;
	document.getElementsByTagName("html")[0].style.fontSize=iWidth/7.5+"px";

})

var wpSiteUrl = 'http://175049f64k.51mypc.cn';
// var wpSiteUrl = 'http://192.168.104.210:8000';
var gAjaxUrl = {
    'login': wpSiteUrl+'/api/v1/staff/auths/login/',//登陆
    'validateCode': wpSiteUrl+'/api/v1/staff/auths/auth_reset_validate_code/',//获取验证码(修改密码)
    'faultitems': wpSiteUrl+'/api/v1/staff/faultitems/', //故障项目列表
    'repairordersUnpaid': wpSiteUrl+'/api/v1/staff/repairorders/unpaid/', //未支付报修单列表
    'repairordersPaid': wpSiteUrl+'/api/v1/staff/repairorders/paid/', //已支付报修单列表
    'repairordersCompleted': wpSiteUrl+'/api/v1/staff/repairorders/completed/', //已完成维修单列表


}

function ajaxCallback(data,callback=function(){}) {
    let statusErrorRule = /^4\d{2}$/;
    let statusSuccessule = /^2\d{2}$/;
    let layerMessage = '';

    if (statusErrorRule.test(data.status)) {
        let dataResponseText = JSON.parse(data.responseText).detail;

        if(dataResponseText.code == 'AUTH_FAIL'){
            localStorage.removeItem("token");
            window.location.href='/#!/login'
            layerMessage = dataResponseText.msg;
        }else if(dataResponseText.msg){
            layerMessage = dataResponseText.msg;
        }else if(dataResponseText.non_field_errors){
            layerMessage = dataResponseText.non_field_errors[0];
        }else if(data.responseJSON.detail.non_field_errors){
            layerMessage = data.responseJSON.detail.non_field_errors;
        }else if(dataResponseText[0]){
            layerMessage = dataResponseText.join(',')
        }else{
            layerMessage = '请求错误'
        }
        //layer.msg(layerMessage,{icon:2,time:1000});
        $.toast(layerMessage, "cancel");
    }else{
        callback();
    }
}
function clickPhone (phone){
    var new_phone = phone;
    $.prompt({
        title: '手机号码',
        input: phone,
        empty: false, // 是否允许为空
        onOK: function (input) {  //点击确认
            new_phone = input;
            $('.weui-mask').remove();
            $('.weui-dialog').remove();
        },
        onCancel: function () {  //点击取消
            $('.weui-mask').remove();
            $('.weui-dialog').remove();
        }
    });
    return new_phone;
}

function imageLoad(ele){
    $(ele).on('change','.imgInput>input',function(){
        let num = 0;//可上传数
        let idNum = 0;
        let imgItemTemplate = `<div class="border imgItem">
        <div class="imgInput">
        <label for="imgInput${idNum}"><img src="../images/icon/icon_camera.png" alt=""></label>
        <input id="imgInput${idNum}" type="file" accept="image/*" capture="camera">
        </div>
        </div>`;
        let srcs = getObjectURL(this.files[0]);  //获取路径
        let imgFile = $('#imgInput'+num)[0].files[0];
        let imgName = imgFile.name.substring(0,imgFile.name.lastIndexOf('.')).toLowerCase();
        let index1 = imgFile.name.lastIndexOf(".");
        let index2 = imgFile.name.length;
        let exName = imgFile.name.substring(index1+1,index2).toLowerCase();
        let imgSize = imgFile.size;
        if(exName != 'jpg' && exName != 'jpeg' && exName != 'png' && exName != 'bmp' && exName != 'gif'){
            alert('请上传jpg、jpeg、png、gif、bmp格式的图片');
            return;
        }
        if(imgSize/1024/1024>2){
            alert('上传图片不能超过2M');
            return;
        }

        let imgPreHtml=`<div class="imgPreview"><img src="${srcs}" alt=""></div>`

        $(this).parent().hide();//this指的是input
        $(this).parent().parent().append(imgPreHtml);

        num++;
        idNum++;
        if(num<3){

            $(this).parent().parent().parent().append(imgItemTemplate);
        }
    })
    $(ele).on("click", ".imgPreview img", function(event) {
        num--;
        $(this).parent().hide(); //this指img
        // $(this).parent().remove();
        if(num == 2){
            $(ele).append(imgItemTemplate);
        }
        event.stopPropagation();
    })
}

function getObjectURL(file) {
    var url = null;
    if (window.createObjectURL != undefined) {
        url = window.createObjectURL(file)
    } else if (window.URL != undefined) {
        url = window.URL.createObjectURL(file)
    } else if (window.webkitURL != undefined) {
        url = window.webkitURL.createObjectURL(file)
    }
    return url
};

+function ($) {
  "use strict";

  var defaults;

  var show = function(html, className) {
    className = className || "";
    var mask = $("<div class='weui-mask_transparent'></div>").appendTo(document.body);

    var tpl = '<div class="weui-toast ' + className + '">' + html + '</div>';
    var dialog = $(tpl).appendTo(document.body);

    dialog.show();
    dialog.addClass("weui-toast--visible");
  };

  var hide = function(callback) {
    $(".weui-mask_transparent").remove();
    $(".weui-toast--visible").remove();
    // $(".weui-toast--visible").removeClass("weui-toast--visible").transitionEnd(function() {
    //   var $this = $(this);
    //   $this.remove();
    //   callback && callback($this);
    // });
  }

  $.toast = function(text, style, callback) {
    if(typeof style === "function") {
      callback = style;
    }
    var className, iconClassName = 'weui-icon-success-no-circle';
    var duration = toastDefaults.duration;
    if(style == "cancel") {
      className = "weui-toast_cancel";
      iconClassName = 'weui-icon-cancel'
    } else if(style == "forbidden") {
      className = "weui-toast--forbidden";
      iconClassName = 'weui-icon-warn'
    } else if(style == "text") {
      className = "weui-toast--text";
    } else if(typeof style === typeof 1) {
      duration = style
    }
    show('<i class="' + iconClassName + ' weui-icon_toast"></i><p class="weui-toast_content">' + (text || "已经完成") + '</p>', className);

    setTimeout(function() {
      hide(callback);
    }, duration);
  }

  $.showLoading = function(text) {
    var html = '<div class="weui_loading">';
    html += '<i class="weui-loading weui-icon_toast"></i>';
    html += '</div>';
    html += '<p class="weui-toast_content">' + (text || "数据加载中") + '</p>';
    show(html, 'weui_loading_toast');
  }

  $.hideLoading = function() {
    hide();
  }

  var toastDefaults = $.toast.prototype.defaults = {
    duration: 2500
  }
}($);

+ function($) {
  "use strict";

  var defaults;

  $.modal = function(params, onOpen) {
    params = $.extend({}, defaults, params);


    var buttons = params.buttons;

    var buttonsHtml = buttons.map(function(d, i) {
      return '<a href="javascript:;" class="weui-dialog__btn ' + (d.className || "") + '">' + d.text + '</a>';
    }).join("");

    var tpl = '<div class="weui-dialog">' +
                '<div class="weui-dialog__hd"><strong class="weui-dialog__title">' + params.title + '</strong></div>' +
                ( params.text ? '<div class="weui-dialog__bd">'+params.text+'</div>' : '')+
                '<div class="weui-dialog__ft">' + buttonsHtml + '</div>' +
              '</div>';

    var dialog = $.openModal(tpl, onOpen);

    dialog.find(".weui-dialog__btn").each(function(i, e) {
      var el = $(e);
      el.click(function() {
        //先关闭对话框，再调用回调函数
        if(params.autoClose) $.closeModal();

        if(buttons[i].onClick) {
          buttons[i].onClick.call(dialog);
        }
      });
    });

    return dialog;
  };

  $.openModal = function(tpl, onOpen) {
    var mask = $("<div class='weui-mask'></div>").appendTo(document.body);
    mask.show();

    var dialog = $(tpl).appendTo(document.body);

    if (onOpen) {
      dialog.transitionEnd(function () {
        onOpen.call(dialog);
      });
    }

    dialog.show();
    mask.addClass("weui-mask--visible");
    dialog.addClass("weui-dialog--visible");


    return dialog;
  }

  $.closeModal = function() {
    $(".weui-mask--visible").removeClass("weui-mask--visible").transitionEnd(function() {
      $(this).remove();
    });
    $(".weui-dialog--visible").removeClass("weui-dialog--visible").transitionEnd(function() {
      $(this).remove();
    });
  };

  $.alert = function(text, title, onOK) {
    var config;
    if (typeof text === 'object') {
      config = text;
    } else {
      if (typeof title === 'function') {
        onOK = arguments[1];
        title = undefined;
      }

      config = {
        text: text,
        title: title,
        onOK: onOK
      }
    }
    return $.modal({
      text: config.text,
      title: config.title,
      buttons: [{
        text: defaults.buttonOK,
        className: "primary",
        onClick: config.onOK
      }]
    });
  }

  $.confirm = function(text, title, onOK, onCancel) {
    var config;
    if (typeof text === 'object') {
      config = text
    } else {
      if (typeof title === 'function') {
        onCancel = arguments[2];
        onOK = arguments[1];
        title = undefined;
      }

      config = {
        text: text,
        title: title,
        onOK: onOK,
        onCancel: onCancel
      }
    }
    return $.modal({
      text: config.text,
      title: config.title,
      buttons: [
      {
        text: defaults.buttonCancel,
        className: "default",
        onClick: config.onCancel
      },
      {
        text: defaults.buttonOK,
        className: "primary",
        onClick: config.onOK
      }]
    });
  };

  //如果参数过多，建议通过 config 对象进行配置，而不是传入多个参数。
  $.prompt = function(text, title, onOK, onCancel, input) {
    var config;
    if (typeof text === 'object') {
      config = text;
    } else {
      if (typeof title === 'function') {
        input = arguments[3];
        onCancel = arguments[2];
        onOK = arguments[1];
        title = undefined;
      }
      config = {
        text: text,
        title: title,
        input: input,
        onOK: onOK,
        onCancel: onCancel,
        empty: false  //allow empty
      }
    }

    var modal = $.modal({
      text: '<p class="weui-prompt-text">'+(config.text || '')+'</p><input type="text" class="weui-input weui-prompt-input" id="weui-prompt-input" value="' + (config.input || '') + '" />',
      title: config.title,
      autoClose: false,
      buttons: [
      {
        text: defaults.buttonCancel,
        className: "default",
        onClick: function () {
          $.closeModal();
          config.onCancel && config.onCancel.call(modal);
        }
      },
      {
        text: defaults.buttonOK,
        className: "primary",
        onClick: function() {
          var input = $("#weui-prompt-input").val();
          if (!config.empty && (input === "" || input === null)) {
            modal.find('.weui-prompt-input').focus()[0].select();
            return false;
          }
          $.closeModal();
          config.onOK && config.onOK.call(modal, input);
        }
      }]
    }, function () {
      this.find('.weui-prompt-input').focus()[0].select();
    });

    return modal;
  };

  //如果参数过多，建议通过 config 对象进行配置，而不是传入多个参数。
  $.login = function(text, title, onOK, onCancel, username, password) {
    var config;
    if (typeof text === 'object') {
      config = text;
    } else {
      if (typeof title === 'function') {
        password = arguments[4];
        username = arguments[3];
        onCancel = arguments[2];
        onOK = arguments[1];
        title = undefined;
      }
      config = {
        text: text,
        title: title,
        username: username,
        password: password,
        onOK: onOK,
        onCancel: onCancel
      }
    }

    var modal = $.modal({
      text: '<p class="weui-prompt-text">'+(config.text || '')+'</p>' +
            '<input type="text" class="weui-input weui-prompt-input" id="weui-prompt-username" value="' + (config.username || '') + '" placeholder="输入用户名" />' +
            '<input type="password" class="weui-input weui-prompt-input" id="weui-prompt-password" value="' + (config.password || '') + '" placeholder="输入密码" />',
      title: config.title,
      autoClose: false,
      buttons: [
      {
        text: defaults.buttonCancel,
        className: "default",
        onClick: function () {
          $.closeModal();
          config.onCancel && config.onCancel.call(modal);
        }
      }, {
        text: defaults.buttonOK,
        className: "primary",
        onClick: function() {
          var username = $("#weui-prompt-username").val();
          var password = $("#weui-prompt-password").val();
          if (!config.empty && (username === "" || username === null)) {
            modal.find('#weui-prompt-username').focus()[0].select();
            return false;
          }
          if (!config.empty && (password === "" || password === null)) {
            modal.find('#weui-prompt-password').focus()[0].select();
            return false;
          }
          $.closeModal();
          config.onOK && config.onOK.call(modal, username, password);
        }
      }]
    }, function () {
      this.find('#weui-prompt-username').focus()[0].select();
    });

    return modal;
  };

  defaults = $.modal.prototype.defaults = {
    title: "提示",
    text: undefined,
    buttonOK: "确定",
    buttonCancel: "取消",
    buttons: [{
      text: "确定",
      className: "primary"
    }],
    autoClose: true //点击按钮自动关闭对话框，如果你不希望点击按钮就关闭对话框，可以把这个设置为false
  };

}($);

+ function($) {
  "use strict";

  var defaults;

  var show = function(params) {

    var mask = $("<div class='weui-mask weui-actions_mask'></div>").appendTo(document.body);

    var actions = params.actions || [];

    var actionsHtml = actions.map(function(d, i) {
      return '<div class="weui-actionsheet__cell ' + (d.className || "") + '">' + d.text + '</div>';
    }).join("");

    var titleHtml = "";
    var cancelHtml = "";

    if (params.title) {
      titleHtml = '<div class="weui-actionsheet__title">' + params.title + '</div>';
    }

    if (params.cancel == false){
        cancelHtml =  '';
    }else{
        cancelHtml = '<div class="weui-actionsheet__action">'+
            '<div class="weui-actionsheet__cell weui-actionsheet_cancel">取消</div>'+
        '</div>'
    }

    var tpl = '<div class="weui-actionsheet " id="weui-actionsheet">'+
                titleHtml +
                '<div class="weui-actionsheet__menu">'+
                actionsHtml +
                '</div>' +
                cancelHtml +
                '</div>';
    var dialog = $(tpl).appendTo(document.body);

    dialog.find(".weui-actionsheet__menu .weui-actionsheet__cell, .weui-actionsheet__action .weui-actionsheet__cell").each(function(i, e) {
      $(e).click(function(event) {
        params.onClose && params.onClose();
        if(actions[i] && actions[i].onClick) {
          actions[i].onClick(event);
        }
        if(params.type == 'radio'){
            hide();
        }
      })
    });

    $(document).on("click", ".weui-actionsheet_confirm", function() {
        if(params.confirm){
            params.confirm && params.confirm();
        }
    });

    mask.show();
    dialog.show();
    mask.addClass("weui-mask--visible");
    dialog.addClass("weui-actionsheet_toggle");
  };

  var hide = function() {

    $(".weui-mask").removeClass("weui-mask--visible").transitionEnd(function() {
      $(this).remove();
    });
    $(".weui-actionsheet").removeClass("weui-actionsheet_toggle").transitionEnd(function() {
      $(this).remove();
    });
    $(".weui-mask").remove();
  }

  $.actions = function(params) {
    params = $.extend({}, defaults, params);
    show(params);
  }

  $.closeActions = function() {
    hide();
  }

  $(document).on("click", ".weui-actionsheet_cancel", function() {
    $.closeActions();
  });

  $(document).on("click", ".weui-actions_mask", function() {
    $.closeActions();
  });

  var defaults = $.actions.prototype.defaults = {
    title: undefined,
    onClose: undefined,
    /*actions: [{
      text: "菜单",
      className: "color-danger",
      onClick: function() {
        console.log(1);
      }
    },{
      text: "菜单2",
      className: "color-success",
      onClick: function() {
        console.log(2);
      }
    }]*/
  }

}($);

$.fn.transitionEnd = function(callback) {
    var events = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'],
      i, dom = this;

    function fireCallBack(e) {
      /*jshint validthis:true */
      if (e.target !== this) return;
      callback.call(this, e);
      for (i = 0; i < events.length; i++) {
        dom.off(events[i], fireCallBack);
      }
    }
    if (callback) {
      for (i = 0; i < events.length; i++) {
        dom.on(events[i], fireCallBack);
      }
    }
    return this;
  };

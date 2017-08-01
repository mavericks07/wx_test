var selectedItems = []; //记录已选的故障项目
var itemNum = 0; //记录故障项目的总项数
var itemOps = { //分页
       param:{
           page:1,
           page_size:10,
       }
   }
var loadFlag = true; //防止请求数据
var orderIndex = 0;
$(function(){
    //页面初始化
    //init();

    //获取故障项目列表,itemNum:故障项目的项目总数
    //getFaultItems();

    //底部菜单栏切换
    $('.weui-tabbar').on('click','.weui-tabbar__item',function(){
        $('.weui-tabbar__item').removeClass('weui-bar__item_on');
        $(this).addClass('weui-bar__item_on');
        var tabId = $(this).attr('rel-link');
        $('.weui-tab-item').removeClass('weui-tab-item-active')
        $(`#${tabId}`).addClass('weui-tab-item-active');
        // if(tabId == 'tab2'){
        //     getOrdersList(0,function(){
        //         $('.isLoading').hide();
        //     });
        // }
        // console.log(1)
    })

    //更改电话号码
    $('.clickPhone').click(function(){
        var phone = $('#phone').attr('rel-data');
        var new_phone = clickPhone(phone);
        if(new_phone != phone){
            $('#phone').html(new_phone); //更改页面文本值
            $('#phone').attr({'rel-data':new_phone});
            $('input[name="contact_phone]').val(new_phone); //表单提交字段
        }
    });

    //点击选择故障项目
    $('.clickFault').click(function(){
        $('.weui-layer').addClass('weui-layer-on');
    });

    //关闭选择故障项目弹出层
    $('.faultitemsTitle .weui-icon-cancel').click(function(){
        $('.weui-layer').removeClass('weui-layer-on');
    })

    selectItem(); //选择故障项目

    //点击选择故障项目弹出层确认按钮
    $('#saveItem').click(function(){
        if(selectedItems.length == 0){
            $.toast("请选择项目", "forbidden");
        }else{
            $('.weui-layer').removeClass('weui-layer-on');
            $('input[name="fault_items"]').val(selectedItems);
            $('.clickFault').html(selectedItems.length+'/'+itemNum);
        }
    })

    //故障项目弹出层中小项列表滚动效果
    scrollItem();

    imageLoad('#imageLoad');

    $('.swiper-container2').on('click','.orders',function(){

    })

    //页面二
    // $('.weui-navbar').on('click','.weui-navbar__item',function(){
    //     $('.weui-navbar > .weui-navbar__item').removeClass('weui_bar__item_on');
    //     $(this).addClass('weui_bar__item_on');
    //     $('#tab2 .weui-tab__bd-item').removeClass('weui-tab__bd-item__active');
    //     let tabItem = $('#tab2 .weui-tab__bd-item');
    //     $(tabItem[$(this).index()]).addClass('weui-tab__bd-item__active');
    // })

    var mySwiper = new Swiper('.swiper-container',{
        direction: 'horizontal',
        slidesPerView: 1,
        mousewheelControl: false,
        freeMode: false,
        onSlideChangeStart: function(swiper){
            $('.weui-navbar-item').removeClass('active');
            var navItems = $('.weui-navbar-item');
            $(navItems[swiper.activeIndex]).addClass('active');
            var orderLists = $('.swiper-container .orderList');
            if($(orderLists[swiper.activeIndex]).find('.list-group').children().length == 0){ //判断订单列表是否已有列表，没有才去请求
                getOrdersList(swiper.activeIndex,function(){
                    $('.isLoading').hide();
                });
            }
        }
    });
    var mySwiper2 = new Swiper('.swiper-container2',{
        direction: 'vertical',
        onTouchMove: function(swiper){      //手动滑动中触发
            var translate = mySwiper2[swiper.activeIndex].getWrapperTranslate();
            if(translate < 50 && translate > 0) {
                $(".init-loading").show();
                $(".init-loading > span").html('下拉刷新...');
            }else if(translate > 50 ){
                $(".init-loading > span").html('释放刷新...');
                // $('.swiper-container2.swiper-container-vertical > .swiper-wrapper').css('transform', 'translate3d(0px, 50px, 0px)');
                $($('.swiper-container2.swiper-container-vertical > .swiper-wrapper')[0]).css('transform', 'translate3d(0px, 50px, 0px)');
            }
            console.log(swiper)
        },
        onTouchEnd: function(swiper) {
            var _viewHeight = document.getElementsByClassName('swiper-wrapper')[0].offsetHeight;
            var _contentHeight = document.getElementsByClassName('swiper-slide')[0].offsetHeight;
            var translate = mySwiper2[swiper.activeIndex].getWrapperTranslate();

            // console.log(swiper);
             // 上拉加载
            if(mySwiper.translate <= _viewHeight - _contentHeight - 50 && mySwiper.translate < 0) {
                // console.log("已经到达底部！");

                if(loadFlag){
                    $(".loadtip").html('正在加载...');
                }else{
                    $(".loadtip").html('没有更多啦！');
                }
            }

            // 下拉刷新
            if(translate < 50){
                $(".init-loading").hide();
                $('.swiper-container2.swiper-container-vertical > .swiper-wrapper').css('transform', 'translate3d(0px, 0px, 0px)');
            }else if(translate >= 50) {
                $(".init-loading").hide();
                $(".isLoading").show();
                $('.swiper-container2.swiper-container-vertical > .swiper-wrapper').css('transform', 'translate3d(0px, 50px, 0px)');
                //$(".loadtip").html('上拉加载更多');
                loadFlag = true;

                if(loadFlag){
                    itemOps.param.page = 1;
                    getOrdersList(swiper.activeIndex,function(){
                        $('.swiper-container2.swiper-container-vertical > .swiper-wrapper').css('transform', 'translate3d(0px, 0px, 0px)');
                    });
                }

                // setTimeout(function() {
                //     $(".init-loading > span").html('刷新成功！');
                //     $(".init-loading > .weui-loading").hide();
                //     setTimeout(function(){
                //         //$(".init-loading").html('').hide();
                //     },800);
                //     $(".loadtip").show(0);

                //     //刷新操作
                //     mySwiper.update(); // 重新计算高度;
                // }, 100000);
            }else if(translate >= 0 && translate < 50){

            }

            return false;
        }
    });
    $('.weui-navbar').on('click','.weui-navbar-item',function(){

        $(this).addClass('active').siblings('a').removeClass('active');
        var orderLists = $('.swiper-container .orderList');
        // if($(orderLists[$(this).index()]).find('.list-group').children().length == 0){ //判断订单列表是否已有列表，没有才去请求
        //     getOrdersList(swiper.activeIndex);
        // }
        mySwiper.slideTo($(this).index(), 500, false)

        $('.w').css('transform', 'translate3d(0px, 0px, 0px)')
        $('.swiper-container2 .swiper-slide-active').css('height','auto').siblings('.swiper-slide').css('height','0px');
        mySwiper.update();
    });

    $('.orderList').on('click','.orders',function(){
        var orderId = $(this).attr('rel-data');
        window.location.href='../views/dormitoryOrderDetail.html?'+orderId;
    })

})

//页面初始化
function init(){
    var authsObj = JSON.parse(localStorage.PinBaAuths);
    $('#real_name').html(authsObj.real_name);
    $('#job_number').html(authsObj.job_number);
    $('#phone').html(authsObj.phone);
    $('#phone').attr({'rel-data':authsObj.phone});
    $('input[name="contact_phone"]').val(authsObj.phone);
    // var loginToken = localStorage.PinBaToken;
    // $.ajaxSetup({
    //     beforeSend:function (xhr) {
    //         xhr.setRequestHeader("authorization", loginToken);
    //     },
    // });

    //getOrdersList(1)
}

//获取故障项目列表
function getFaultItems (){
    console.log(1)
    $.ajax({
        url: gAjaxUrl.faultitems,
        type: 'GET',
        success:function(data){
            var resultData = data;

            if(resultData && resultData.length > 0){
                var template = '';
                $.each(resultData,function(index,item){
                    var titleList = '<div class="weui-menu-title">'+
                        '<div class="weui-item-title" rel-id="'+item.id+'">'+item.fault_name+'<i class="weui-menu-arrow"></i></div>'+
                        '<div class="title-placeholder"></div>'+
                    '</div>'
                    var itemList = '';
                    $.each(item.items,function(index,data){
                        itemNum++;
                        itemList += '<ul class="weui-item-list">'+
                            '<li><span class="fault-name" rel-id="'+data.id+'">'+data.fault_name+'</span><i class="weui-icon-success"></i></li>'+
                        '</ul>'
                    })
                    template += '<div class="weui-menu-item">' + titleList + itemList + '</div>';
                })
                $('.weui-menu').html(template);
            }else{
                $('.weui-menu').html('<div class="weui-menu-item text-c fc-999">没有相关数据</div>');
            }
        },
        error:function(data){
            ajaxCallback(data);
        },
    });
}

//选择故障项目
function selectItem() {
    //点击项目大项展开/收起小项
    $('.weui-menu').on('click','.weui-menu-title',function(){
        $(this).parent().toggleClass('selected');
        if(!$(this).hasClass('selected')){
            $(this).find('weui-menu-title').removeClass('fixed');
            $(this).find('.weui-item-title').css({'top':0});
        }
    });
    //在列表中点击选择/取消选择小项
    $('.weui-menu').on('click','.weui-menu-item li',function(){
        $(this).toggleClass('selected');

        var faultName = $(this).find('.fault-name').html();
        var faultId = $(this).find('.fault-name').attr('rel-id');
        var fatherId = $(this).parent().siblings().children('.weui-item-title').attr('rel-id');

        if($(this).hasClass('selected')){ //点击选择
            $('.selectedItem ul').append(`<li id="${faultId}" rel-fatherId="${fatherId}">${faultName}</li>`); //在已选栏中添加该小项
            selectedItems.push(faultId);
        }else{ //取消选择
            $(`#${faultId}`).remove(); //在已选栏中删除该小项
            //删除selectedItems中该小项
            var itemIndex = '';
            $.each(selectedItems,function(index,item){
                if(item == faultId){
                    itemIndex = index;
                }
            })
            selectedItems.splice(itemIndex,1);
        }
    })
    //在已选栏中点击取消选择小项
    $('.selectedItem > ul').on('click','li',function(){
        var fatherId = $(this).attr('rel-fatherId'); //所属大项id
        var itemId = $(this).attr('id'); //该小项id
        var items = $('.weui-menu .weui-menu-item');
        $.each(items,(index,item)=>{
            var titleId = $(item).find('.weui-item-title').attr('rel-id'); //大项id
            if(titleId==fatherId){ //匹配小项所属的大项
                var itemList = $(item).find('.weui-item-list > li.selected');
                $.each(itemList,(index,item)=>{
                    var secondItemId = $(item).find('.fault-name').attr('rel-id');
                    if(secondItemId == itemId){
                        $(item).removeClass('selected');
                    }
                })
            }
        })
        $(this).remove();
        //删除selectedItems中该小项
        var itemIndex = '';
        $.each(selectedItems,function(index,item){
            if(item == itemId){
                itemIndex = index;
            }
        })
        selectedItems.splice(itemIndex,1);
    })
}

/*
*获取记录列表
*orderIndex: 1:未支付,2:已支付,3:已维修
**/
function getOrdersList(orderIndex,callback=function(){}) {
    var ajaxUrl = '';
    switch(orderIndex){
        case 0:
            ajaxUrl = gAjaxUrl.repairordersUnpaid;
            break;
        case 1:
            ajaxUrl = gAjaxUrl.repairordersPaid;
            break;
        case 2:
            ajaxUrl = gAjaxUrl.repairordersCompleted;
            break;
    }
    // $('.isLoading').show();
    // $.ajax({
    //     url: ajaxUrl,
    //     type: 'GET',
    //     data: itemOps.param,
    //     // beforeSend: function(){
    //     //     loadFlag = false;
    //     // },
    //     success:function(data){
    //         loadFlag = true;
    //         var resultData = data.results;

    //         if(resultData && resultData.length > 0){
    //             var template = '';
    //             $.each(resultData,function(index,item){
    //                 if(orderIndex == 0){ //未支付订单
    //                     var faultitems = '';
    //                     $.each(item.fault_item_vos,function(index,data){
    //                         faultitems += data.fault_name + '/';
    //                         faultitems = faultitems.slice(0,faultitems.length-1);
    //                     });
    //                     var statusTemplate = ''
    //                     if(item.status == 40){ //待支付
    //                         statusTemplate = '<div class="pay">' +
    //                             '<span class="mr-15">￥'+item.pay_amount+'</span>' +
    //                             '<img src="../images/icon/icon_bt_pay.png" alt="">' +
    //                         '</div>'
    //                     }else{
    //                         statusTemplate = '<div class="wait">等待报价</div>'
    //                     }
    //                     template += '<div class="orders" rel-data="'+item.id+'">'+
    //                         '<div class="fc-999">报修时间:'+item.ctime+'</div>'+
    //                         '<div class="detail">'+
    //                             '<div><span class="mr-15">报修项目:</span>'+faultitems+'</div>'+
    //                             '<div><span class="mr-15">报修人员:</span>'+item.staff_vo.real_name+'</div>'+
    //                             '<div><span class="mr-15">联系电话:</span>'+item.staff_vo.phone+'</div>'+
    //                             '<div><span class="mr-15">故障地址:</span>'+item.room_vo.location+'</div>'+
    //                             statusTemplate +
    //                         '</div>'+
    //                     '</div>';
    //                     $('#unpaid').html(template);
    //                 }else if(orderIndex == 1){ //已支付订单
    //                     var faultitems = '';
    //                     $.each(item.fault_item_vos,function(index,data){
    //                         faultitems += data.fault_name + '/';
    //                         faultitems = faultitems.slice(0,faultitems.length-1);
    //                     });
    //                     var statusTemplate = '<div class="paied">' +
    //                             '<span class="mr-15">￥'+item.pay_amount+'</span>' +
    //                             '<img src="../images/icon/icon_bg_paied.png" alt="">' +
    //                         '</div>';
    //                     template += '<div class="orders" rel-data="'+item.id+'">'+
    //                         '<div class="fc-999">报修时间:'+item.ctime+'</div>'+
    //                         '<div class="detail">'+
    //                             '<div><span class="mr-15">报修项目:</span>'+faultitems+'</div>'+
    //                             '<div><span class="mr-15">报修人员:</span>'+item.staff_vo.real_name+'</div>'+
    //                             '<div><span class="mr-15">联系电话:</span>'+item.staff_vo.phone+'</div>'+
    //                             '<div><span class="mr-15">故障地址:</span>'+item.room_vo.location+'</div>'+
    //                             statusTemplate +
    //                         '</div>'+
    //                     '</div>';
    //                     $('#paid').html(template);
    //                 }else if(orderIndex == 2){ //已维修订单
    //                     var commentTempalte = '';

    //                     if(item.status == 70){ //已评价
    //                         var starTempalte = '';
    //                         for(var i=0; i<item.comment_vo.score; i++){
    //                             starTempalte += '<img src="../images/icon/icon_star_fill.png">';
    //                         }
    //                         commentTempalte = '<div class="comment"><span class="mr-15">已评价:</span><span class="fc-ffa16a score">'+item.comment_vo.score+'</span>'+starTempalte+'</div>' +
    //                             '<div class="fc-999 text-overflow"><span class="mr-15 fc-999">其他反馈:</span>'+item.comment_vo.content+'</div>';
    //                     }else{
    //                         commentTempalte = '<div class="clearfix comment"><a href="javascript:;" class="weui-btn weui-btn_20B2AA radius fl">去评价</a></div>';
    //                     }
    //                     template += '<div class="orders" rel-data="'+item.id+'">' +
    //                         '<div class="fc-999">报修时间:'+item.ctime+'</div>' +
    //                         '<div class="detail">' +
    //                             '<div class="clearfix">' +
    //                                 '<span class="mr-15">报修单号:</span>'+ item.id +
    //                                 '<span class="fr"><span class="mr-15">报修共:</span><span class="fc-ffa16a">￥'+item.pay_amount+'</span></span>' +
    //                             '</div>' +
    //                             '<div><span class="mr-15">维修工:</span>'+item.repairman_vo.staff_vo.real_name+'</div>' +
    //                             commentTempalte +
    //                         '</div>' +
    //                     '</div>';
    //                     $('#completed').html(template);
    //                 }
    //             });
    //         }else{
    //             var orderLists = $('.swiper-container .orderList');
    //             $(orderLists[orderIndex]).find('.list-group').html('<div class="text-c fc-999 mt-100">没有相关数据</div>')
    //         }
    //         callback();
    //     },
    //     error:function(data){
    //         loadFlag = true;
    //         ajaxCallback(data);
    //     },
    // })
}

//故障项目弹出层中小项列表滚动效果
function scrollItem(){
    var items = $('.weui-menu .weui-menu-item');

    $('.weui-menu').scroll(()=>{
        $.each(items,(index,item)=>{
            if($(item).hasClass('selected')){
                let listHeight = $(item).find('.weui-menu-title').siblings('.weui-item-list').outerHeight();
                let itemTop = $(item).position().top;

                if(itemTop<0 && itemTop>-listHeight){
                    $(item).find('.weui-menu-title').addClass('fixed');
                    $(item).find('.weui-item-title').css({'top':-itemTop})
                }else{
                    $(item).find('.weui-item-title').css({'top':0});
                    $(item).find('.weui-menu-title').removeClass('fixed');
                }

            }
        })
    })
}
$('.save').click(function(){
    $.toast("提交成功");
})

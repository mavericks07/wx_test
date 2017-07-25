
$(function(){
	
	//适配屏幕大小
	var iWidth=document.documentElement.getBoundingClientRect().width;
		iWidth=iWidth>750?750:iWidth;
		iWidth=iWidth<320?320:iWidth;
		document.getElementsByTagName("html")[0].style.fontSize=iWidth/7.5+"px";
})

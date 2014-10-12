// 页面即将初始化
$(document).on("pagebeforecreate",function (event) {
	var explorer = explorerType(false);
	if (explorer["type"] == "ie" && explorer["version"] < 9) {
		$("body").addClass("non_html5_bg");
		$("body").html("<div class='non_html5'><h1>请使用支持html5的浏览器打开</h1><p>比如：<a href='http://down.tech.sina.com.cn/content/40975.html' target='_blank'>谷歌浏览器</a>、<a href='https://www.mozilla.org/zh-CN/firefox/new/' target='_blank'>火狐浏览器</a>，或者当前浏览器的极速模式</p></div>");
	};
})


// 页面已初始化
$(document).on("pageinit",function (event) {

	// 页面效果
	mainMenu();  //主菜单
	searchForm();  //搜索框
	qrCode();  //二维码
	scrollPosition();  //回顶部等页面滚动效果
	listType();  //列表页文章类型判断，文字or图片
	imgContain();  //详情页段落是否包含图片
	works();  //设计作品

	// 基础功能

	// 插件效果
	fancybox();  //fancybox弹窗相册
	cnzz();  //cnzz统计代码

})





//*********************************************************************//
//                              页面效果                               //
//*********************************************************************//


// 主菜单
function mainMenu () {
	var flag = 0;
	var menu = $(".header .menu_wrapper");
	$(".header .icon-icon_menu").on("tap", toggleMenu);  //点击菜单按钮
	// 切换菜单状态
	function toggleMenu () {
		if (getWinSize() < 3) {
			if (flag) {  //菜单处于显示状态
				menu.removeClass("menu_wrapper_show");  //收起菜单
				flag = 0;
			}
			else {  //菜单处于隐藏状态
				menu.addClass("menu_wrapper_show");  //展开菜单
				flag = 1;
			}
		};
	}
}


// 搜索框
function searchForm () {
	var searchForm = $(".header .search input");
	$(".header .search .icon-icon_search").on("click", function () {  //PC端点击搜索按钮
		thisInput = $(this).parent().find("input");
		if (getWinSize() > 4 && searchForm.val() != "") {
			searchKeyword(thisInput.val(), thisInput);  //搜索跳转
		};
	})
	searchForm.focus(function () {  //输入框获得焦点
		inputActive();  //展开搜索框
		$(this).val($(this).val());  //光标移到末尾
		this.onkeyup = function () {
			if (event.keyCode == 13) {  //按下回车键
				searchKeyword($(this).val(), $(this));  //搜索跳转
			}
		}
	}).blur(function () {  //搜索框失去焦点
    	inputDisactive();  //收起搜索框
    })
	$(window).resize(function () {  //旋转屏幕，输入框自适应宽度
		if (getWinSize() < 3) {  //如果是手机
			if ($(".header .search").hasClass("search_on")) {  //搜索框处于展开状态
				searchForm.width($(window).width() - 56 - 5);  //调节输入框宽度
			};
		}
		else {
			searchForm.removeAttr("style");  //移除搜索框宽度信息
		}
	});
    // 展开搜索框
    function inputActive () {
		$(".header .search").addClass("search_on");  //展开搜索框
		if (getWinSize() < 3) {  //如果是手机
			$(".header .title").addClass("title_hide");  //隐藏标题
			searchForm.width($(window).width() - 56 - 5);  //调节输入框宽度
		}
    }
    // 收起搜索框
    function inputDisactive () {
		searchForm.removeAttr("style");  //移除搜索框宽度信息
		$(".header .search").removeClass("search_on");  //收起搜索框
		$(".header .title").removeClass("title_hide");  //显示标题
    }
    // 搜索跳转
	function searchKeyword (keyword, obj) {
		if (obj.val().length > 0) {  //输入框不为空
			window.location = "http://" + window.location.host + "/?s=" + keyword;
		};
	}
}


// 二维码
function qrCode () {
	$(document).on("click", function (e) {  //点击页面任意位置
		if (getWinSize() > 4) {  //PC
			var target  = $(e.target);
			if ($(target).hasClass("icon-icon_qr")) {  //点击二维码图标
				$(".header .qr").addClass("qr_show");  //显示二维码
			}
			else {  //点击其他地方
				$(".header .qr").removeClass("qr_show");  //隐藏二维码
			};
		};
	})
}


// 回顶部等页面滚动效果
function scrollPosition () {
	$(".gotop").on("click", function () {
        $("html,body").animate({
            scrollTop: 0
        },300);
	})
	$(".header .down .icon-arrow2_down").on("click", function () {
		var winHeight = $(window).height();
        $("html,body").animate({
            scrollTop: winHeight
        },300);
	})
}


// 列表项类型判断，文字or图片
function listType () {
	if ($(".list").length > 0) {  //处于列表页
		$(".list .post").each(function () {
			if ($(this).find("img").length > 0) {  //如果有图片，设为图片模式
				$(this).addClass("img");
				$(this).removeClass("text");
				if (getWinSize() < 3) {  //如果是手机，将第一张图片作为背景图
					$(this).css("background-image", "url(" + $(this).find("img").attr("src") + ")");
				}
				else {  //否则清除背景图
					$(this).removeAttr("style");
				}
			}
			else {  //如果没有图片，设为文字模式
				$(this).addClass("text");
				$(this).removeClass("img");
			}
		})
		$(window).resize(function () {  //改变窗口大小
			if (getWinSize() < 3) {  //如果是手机，将第一张图片作为背景图
				$(".list .img").each(function () {
					$(this).css("background-image", "url(" + $(this).find("img").attr("src") + ")");
				})
			}
			else {  //否则清除背景图
				$(".list .img").removeAttr("style");
			}
		})
	};
}


// 详情页段落是否包含图片
function imgContain () {
	if ($(".detail").length > 0) {  //处于详情页
		$(".detail .post_body p").each(function () {
			if ($(this).find("img").length > 0) {
				$(this).addClass("img_inside");
			};
		})
	};
}


// 设计作品
function works () {
	if ($("#works").length > 0 && getWinSize() < 3) {  //在手机上直接展现作品图片，而不是幻灯播放
		$("#works .pic a").each(function () {
			if ($(this).hasClass("title")) {
				$(this).remove();
			}
			else {
				var imgSrc = $(this).attr("href");
				$(this).replaceWith("<img src='" + imgSrc + "'>");
			}
		})
	};
}





//*********************************************************************//
//                              基础功能                               //
//*********************************************************************//


// 获取屏幕宽度，判断设备类型
function getWinSize () {
	var phoneLandscape = 568, padPortrait = 768, padLandscape = 1024, pc = 1200;  //响应式断点
	var winWidth = $(window).width();
	if (winWidth < phoneLandscape) {  //手机竖屏
		return 1;
	}
	else if(winWidth >= phoneLandscape && winWidth < padPortrait) {  //手机横屏
		return 2;
	}
	else if(winWidth >= padPortrait && winWidth < padLandscape) {  //平板
		return 3;
	}
	else if(winWidth >= padLandscape && winWidth < pc) {  //平板
		return 4;
	}
	else {  //PC
		return 5;
	}
}


// 判断浏览器类型与版本
function explorerType (detailed) { //参数控制是否显示浏览器完整版本号
    var Sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;
    (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
    (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
    (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
    (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
    (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
    (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
    if (detailed) {
		if (Sys.ie) return {"type":"ie","version":Sys.ie};
		else if (Sys.firefox) return {"type":"firefox","version":Sys.firefox};
		else if (Sys.chrome) return {"type":"chrome","version":Sys.chrome};
		else if (Sys.opera) return {"type":"opera","version":Sys.opera};
		else if (Sys.safari) return {"type":"safari","version":Sys.safari};
		else return {"type":"null","version":"0"};
    }
    else {
		if (Sys.ie) return {"type":"ie","version":parseInt(Sys.ie.split(".")[0])};
		else if (Sys.firefox) return {"type":"firefox","version":parseInt(Sys.firefox.split(".")[0])};
		else if (Sys.chrome) return {"type":"chrome","version":parseInt(Sys.chrome.split(".")[0])};
		else if (Sys.opera) return {"type":"opera","version":parseInt(Sys.opera.split(".")[0])};
		else if (Sys.safari) return {"type":"safari","version":parseInt(Sys.safari.split(".")[0])};
		else return {"type":"null","version":"0"};
    }
}






//*********************************************************************//
//                              插件效果                               //
//*********************************************************************//


// fancybox弹窗相册
function fancybox () {
	if ($(".fancybox").length > 0) {
		$('.fancybox').fancybox({
			prevEffect : 'none',
			nextEffect : 'none',
			closeBtn  : false,
			arrows    : true,
			nextClick : true
		});
	};
}


// cnzz统计代码
function cnzz () {
	var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");
	$(".statistic").html(unescape("%3Cspan id='cnzz_stat_icon_2994887'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s4.cnzz.com/stat.php%3Fid%3D2994887' type='text/javascript'%3E%3C/script%3E"));
}

window.onload = function () {

	// 页面效果
	pageFunc.html5Support();  //判断浏览器是否支持html5
	pageFunc.mainMenu();  //主菜单
	pageFunc.searchForm();  //搜索框
	pageFunc.qrCode();  //二维码
	pageFunc.listType();  //列表页文章类型判断，文字or图片
	pageFunc.imgContain();  //详情页段落是否包含图片
	pageFunc.movies();  //电影收藏
	pageFunc.works();  //设计作品
	pageFunc.aboutProgress();  //关于页面的环形进度条

	// 插件效果
	plugin.fancybox();  //fancybox弹窗相册
	plugin.smoothSlide();  //锚链接平滑移动

}





//*********************************************************************//
//                              页面效果                               //
//*********************************************************************//

var pageFunc = {


	// 判断浏览器是否支持html5
	html5Support: function () {
		var explorer = basic.explorerType(false);
		if (explorer["type"] == "ie" && explorer["version"] < 9) {
			$("body").addClass("non_html5_bg");
			$("body").html("<div class='non_html5'><h1>请使用支持html5的浏览器打开</h1><p>比如：<a href='http://down.tech.sina.com.cn/content/40975.html' target='_blank'>谷歌浏览器</a>、<a href='https://www.mozilla.org/zh-CN/firefox/new/' target='_blank'>火狐浏览器</a>，或者当前浏览器的极速模式</p></div>");
		};
	},


	// 主菜单
	mainMenu: function () {
		var flag = 0;
		var menu = $(".header .menu_wrapper");
		$(".header .icon-icon_menu").on("click", toggleMenu);  //点击菜单按钮
		// 切换菜单状态
		function toggleMenu () {
			if (basic.getWinSize() < 3) {
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
	},


	// 搜索框
	searchForm: function () {
		var searchForm = $(".header .search input");
		$(".header .search .icon-icon_search").on("click", function () {  //PC端点击搜索按钮
			thisInput = $(this).parent().find("input");
			if (basic.getWinSize() > 4 && searchForm.val() != "") {
				searchKeyword(thisInput.val(), thisInput);  //搜索跳转
			};
		})
		searchForm.focus(function () {  //输入框获得焦点
			$(".header").addClass("search_on");  //展开搜索框
			$(this).val($(this).val());  //光标移到末尾
		}).blur(function () {  //搜索框失去焦点
			$(".header").removeClass("search_on");  //收起搜索框
	    })
		searchForm.bind("keyup", function () {  //输入框的键盘事件
			if (event.keyCode == 13) {  //按下回车键
				searchKeyword($(this).val(), $(this));  //搜索跳转
			}
		})
	    // 搜索跳转
		function searchKeyword (keyword, obj) {
			if (obj.val().length > 0) {  //输入框不为空
				window.location = "http://" + window.location.host + "/?s=" + keyword;
			};
		}
	},


	// 二维码
	qrCode: function () {
		$(document).on("click", function (e) {  //点击页面任意位置
			if (basic.getWinSize() > 4) {  //PC
				var target  = $(e.target);
				if ($(target).hasClass("icon-icon_qr")) {  //点击二维码图标
					$(".header .qr").addClass("qr_show");  //显示二维码
				}
				else {  //点击其他地方
					$(".header .qr").removeClass("qr_show");  //隐藏二维码
				};
			};
		})
	},


	// 列表项类型判断，文字or图片
	listType: function () {
		if ($(".list").length > 0) {  //处于列表页
			$(".list .post").each(function () {
				if ($(this).find("img").length > 0) {  //如果有图片，设为图片模式
					$(this).addClass("img");
					$(this).removeClass("text");
					if (basic.getWinSize() < 3) {  //如果是手机，将第一张图片作为背景图
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
				if (basic.getWinSize() < 3) {  //如果是手机，将第一张图片作为背景图
					$(".list .img").each(function () {
						$(this).css("background-image", "url(" + $(this).find("img").attr("src") + ")");
					})
				}
				else {  //否则清除背景图
					$(".list .img").removeAttr("style");
				}
			})
		};
	},


	// 详情页段落是否包含图片
	imgContain: function () {
		if ($(".detail").length > 0) {  //处于详情页
			$(".detail .post_body p").each(function () {
				if ($(this).find("img").length > 0) {
					$(this).addClass("img_inside");
				};
			})
		};
	},


	// 电影收藏
	movies: function () {
		if ($("#movie").length > 0 && basic.getWinSize() > 4) {  //在手机上直接展现作品图片，而不是幻灯播放
			$("#movie li h3").hover(function () {
				$(this).parent().addClass("hover");
			}, function () {
				$(this).parent().removeClass("hover");
			})
		};
	},


	// 设计作品
	works: function () {
		if ($("#works").length > 0 && basic.getWinSize() < 3) {  //在手机上直接展现作品图片，而不是幻灯播放
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
	},


	// 关于页面的环形进度条
	aboutProgress: function () {
		if ($("#about").length > 0) {
			$("#about").ready(function () {
				$(".circle_progress").each(function () {
					var percentage = parseInt($(this).find(".center span").html().split("%")[0])/100;
					plugin.setPercentage(0, percentage, $(this));  //初始化进度条
				})
			})
		};
	}


}






//*********************************************************************//
//                              插件效果                               //
//*********************************************************************//

var plugin = {


	// 设置进度条，3个参数分别为：旧百分比、新百分比、作用对象
	setPercentage: function (m,n,obj) {
		var speed = 0.5  //设置动画时长（单位：秒）
		if (n >= 0 && n < 0.5) {  //是否低于50%
			if (m >= 0.5) {  //跨越50%时，动画分两段播放，将第二段延迟
				resetTime();  //重置延迟与动画时间
				obj.find(".pie_left").css({
					// 计算左半环的动画时间
					"transition-duration":speed/(m-n)*(m-0.5) + "s",
					"-webkit-transition-duration":speed/(m-n)*(m-0.5) + "s"
				})
				obj.find(".pie_right").css({
					// 计算右半环的动画时间
					"transition-duration":speed/(m-n)*(0.5-n) + "s",
					"-webkit-transition-duration":speed/(m-n)*(0.5-n) + "s",
					// 将左半环动画时间，设置为右半环的延迟
					"transition-delay":speed/(m-n)*(m-0.5) + "s",
					"-webkit-transition-delay":speed/(m-n)*(m-0.5) + "s"
				})
			}
			obj.find(".pie_right").css({  //将右半环转到相应位置
				"transform":"rotate(" + n*360 + "deg)",
				"-webkit-transform":"rotate(" + n*360 + "deg)"
			})
			obj.find(".pie_left").css({  //将左半环转到默认位置
				"transform":"rotate(0deg)",
				"-webkit-transform":"rotate(0deg)"
			})
		}
		else if (n >= 0.5 && n <= 1) {  //是否超过50%
			if (m <= 0.5) {  //跨越50%时，动画分两段播放，将第二段延迟
				resetTime();  //重置延迟与动画时间
				obj.find(".pie_right").css({
					// 计算右半环的动画时间
					"transition-duration":speed/(n-m)*(0.5-m) + "s",
					"-webkit-transition-duration":speed/(n-m)*(0.5-m) + "s"
				})
				obj.find(".pie_left").css({
					// 计算左半环的动画时间
					"transition-duration":speed/(n-m)*(n-0.5) + "s",
					"-webkit-transition-duration":speed/(n-m)*(n-0.5) + "s",
					// 将右半环动画时间，设置为左半环的延迟
					"transition-delay":speed/(n-m)*(0.5-m) + "s",
					"-webkit-transition-delay":speed/(n-m)*(0.5-m) + "s"
				})
			}
			obj.find(".pie_right").css({  //将右半环转到默认位置
				"transform":"rotate(180deg)",
				"-webkit-transform":"rotate(180deg)"
			})
			obj.find(".pie_left").css({  //将左半环转到相应位置
				"transform":"rotate(" + (n-0.5)*360 + "deg)",
				"-webkit-transform":"rotate(" + (n-0.5)*360 + "deg)"
			})
		}
		function resetTime () {  //重置延迟与动画时间
			obj.find(".pie_wrap span").css({
				"transition-delay":"0",
				"-webkit-transition-delay":"0",
				"transition-duration":speed + "s",
				"-webkit-transition-duration":speed + "s"
			});
		}
	},


	// fancybox弹窗相册
	fancybox: function () {
		if ($(".fancybox").length > 0) {
			$('.fancybox').fancybox({
				prevEffect : 'none',
				nextEffect : 'none',
				closeBtn  : false,
				arrows    : true,
				nextClick : true
			});
		};
	},


	//	锚链接平滑移动
	smoothSlide: function () {
		$("a[href*='#']").click(function() {
			if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
				if (this.hash.slice(1).length){
					var $target = $("[name=" + this.hash.slice(1) + "]");
					if($target.length){
						var targetOffset = $target.offset().top;
						$("html,body").animate({
							scrollTop: targetOffset
						},
						800);
					}
				}
				else{
					$("html,body").animate({
						scrollTop: 0
					},
					800);
				}
				return false;  //防止页面跳动
			}
		});	
	}


}





//*********************************************************************//
//                              基础功能                               //
//*********************************************************************//

var basic = {


	// 获取屏幕宽度，判断设备类型
	getWinSize: function () {
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
	},


	// 判断浏览器类型与版本
	explorerType: function (detailed) { //参数控制是否显示浏览器完整版本号
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


}
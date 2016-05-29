window.onload = ->

    #页面效果
    pageFunc.html5Support()  #判断浏览器是否支持html5
    pageFunc.mainMenu()  #主菜单
    pageFunc.searchForm()  #搜索框
    pageFunc.qrCode()  #二维码
    pageFunc.listType()  #列表页文章增加背景图
    pageFunc.imgContain()  #详情页段落是否包含图片
    pageFunc.movies()  #电影收藏
    pageFunc.works()  #设计作品
    pageFunc.aboutProgress()  #关于页面的环形进度条

    #插件效果
    plugin.fancybox()  #fancybox弹窗相册
    plugin.smoothSlide()  #锚链接平滑移动





#########################################################################
#                               页面效果                                #
#########################################################################

pageFunc = 

    # 判断浏览器是否支持html5
    html5Support: ->
        explorer = basic.explorerType(false)
        if explorer.type is "ie" and explorer.version < 9
            $("body").addClass "non_html5_bg"
            $("body").html "<div class='non_html5'><h1>请使用支持html5的浏览器打开</h1><p>比如：<a href='http://down.tech.sina.com.cn/content/40975.html' target='_blank'>谷歌浏览器</a>、<a href='https://www.mozilla.org/zh-CN/firefox/new/' target='_blank'>火狐浏览器</a>，或者当前浏览器的极速模式</p></div>"

    # 主菜单
    mainMenu: ->
        menu = document.getElementsByClassName("header")[0].getElementsByClassName "menu_wrapper"
        menuIcon = document.getElementsByClassName("header")[0].getElementsByClassName "menu"
        # 切换菜单状态
        $(".header .icon-icon_menu").on "click", ->  #点击菜单按钮
            $(menu).toggleClass "menu_wrapper_show" if basic.getWinSize() < 3  #展开/收起菜单
            $(menuIcon).toggleClass "menu_active" if basic.getWinSize() < 3  #展开/收起菜单

    # 搜索框
    searchForm: ->
        inputForm = document.getElementsByClassName("header")[0].getElementsByTagName("input")[0]
        $(".header .search .icon-icon_search").on "click", ->
            thisInput = $(this).parent().find "input"
            if basic.getWinSize() > 4 and $(inputForm).val() isnt ""
                searchKeyword thisInput.val(), thisInput  #搜索跳转
        $(inputForm).focus ->  #输入框获得焦点
            $(".header").addClass "search_on"  #展开搜索框
            $(this).val $(this).val()  #光标移到末尾
        $(inputForm).blur ->  #搜索框失去焦点
            $(".header").removeClass "search_on"  #收起搜索框
        $(inputForm).bind "keyup", ->  #输入框的键盘事件
            searchKeyword $(this).val(), $(this) if event.keyCode is 13  #按下回车键，搜索跳转
        # 搜索跳转
        searchKeyword = (keyword, obj) ->
            window.location = "http://" + window.location.host + "/?s=" + keyword if obj.val().length  #输入框不为空

    # 二维码
    qrCode: ->
        if document.getElementsByClassName("index_header")? and basic.getWinSize() > 4  #PC首页
            $(document).on "click", (e) ->  #点击页面任意位置
                target = $(e.target)
                qr = $(".header .qr")
                if target.hasClass "icon-icon_qr" then qr.addClass "qr_show" else qr.removeClass "qr_show"  #点击图标显示/隐藏二维码

    # 列表页文章增加背景图
    listType: ->
        if document.getElementsByClassName("list")[0]?  #处于列表页
            setBg = ->
                imgs = document.getElementsByClassName "img"
                if basic.getWinSize() < 3  #如果是手机，将封面图作为背景图
                    $(item).css "background-image", "url(#{$(item).attr("bg")})" for item in imgs
                else  #否则清除背景图
                    $(item).removeAttr "style" for item in imgs
            setBg()
            window.onresize = -> setBg()  #改变窗口大小

    # 详情页段落是否包含图片
    imgContain: ->
        if document.getElementsByClassName("detail")[0]?  #处于详情页
            para = document.getElementsByClassName("post_body")[0].getElementsByTagName "p"
            $(item).addClass "img_inside" for item in para when $(item).find("img").length

    # 电影收藏
    movies: ->
        if document.getElementById("movie")? and basic.getWinSize() > 4  #处于电影收藏页面，PC
            $("#movie li h3").hover ->
                $(this).parent().addClass "hover"
            $("#movie li h3").mouseout ->
                $(this).parent().removeClass "hover"

    # 设计作品
    works: ->
        if document.getElementById("works")? and basic.getWinSize() < 3  #在手机上直接展现作品图片，而不是幻灯播放
            $(".pic a.title").remove()
            workItem = document.getElementsByClassName("pic")[0].getElementsByTagName "a"
            $(item).replaceWith "<img src='#{$(item).attr "href"}'>" for item in workItem

    # 关于页面的环形进度条
    aboutProgress: ->
        if document.getElementById("about")?
            $("#about").ready ->
                progress = document.getElementsByClassName "circle_progress"
                for item in progress
                    percentage = parseInt($(item).find(".center span").html().split("%")[0])/100
                    plugin.setPercentage 0, percentage, $(item)  #初始化进度条





#########################################################################
#                               插件效果                                #
#########################################################################

plugin =

    # 设置进度条，3个参数分别为：旧百分比、新百分比、作用对象
    setPercentage: (m,n,obj) ->
        speed = 0.5  #设置动画时长（单位：秒）
        resetTime = ->  #重置延迟与动画时间
            obj.find(".pie_wrap span").css {
                "-webkit-transition-delay": "0",
                "transition-delay": "0",
                "-webkit-transition-duration": speed + "s",
                "transition-duration": speed + "s"
            }
        if n >= 0 and n < 0.5  #是否低于50%
            if m >= 0.5  #跨越50%时，动画分两段播放，将第二段延迟
                resetTime()  #重置延迟与动画时间
                obj.find(".pie_left").css {
                    # 计算左半环的动画时间
                    "-webkit-transition-duration": speed/(m-n)*(m-0.5) + "s",
                    "transition-duration": speed/(m-n)*(m-0.5) + "s"
                }
                obj.find(".pie_right").css {
                    # 计算右半环的动画时间
                    "-webkit-transition-duration": speed/(m-n)*(0.5-n) + "s",
                    "transition-duration": speed/(m-n)*(0.5-n) + "s",
                    # 将左半环动画时间，设置为右半环的延迟
                    "-webkit-transition-delay": speed/(m-n)*(m-0.5) + "s",
                    "transition-delay": speed/(m-n)*(m-0.5) + "s"
                }
            obj.find(".pie_right").css {  #将右半环转到相应位置
                "-webkit-transform": "rotate(#{n*360}deg)",
                "transform": "rotate(#{n*360}deg)"
            }
            obj.find(".pie_left").css {  #将左半环转到默认位置
                "-webkit-transform": "rotate(0deg)",
                "transform": "rotate(0deg)"
            }
        else if n >= 0.5 && n <= 1  #是否超过50%
            if m <= 0.5  #跨越50%时，动画分两段播放，将第二段延迟
                resetTime()  #重置延迟与动画时间
                obj.find(".pie_right").css {
                    # 计算右半环的动画时间
                    "-webkit-transition-duration": speed/(n-m)*(0.5-m) + "s",
                    "transition-duration": speed/(n-m)*(0.5-m) + "s"
                }
                obj.find(".pie_left").css {
                    # 计算左半环的动画时间
                    "-webkit-transition-duration": speed/(n-m)*(n-0.5) + "s",
                    "transition-duration": speed/(n-m)*(n-0.5) + "s",
                    # 将右半环动画时间，设置为左半环的延迟
                    "-webkit-transition-delay": speed/(n-m)*(0.5-m) + "s",
                    "transition-delay": speed/(n-m)*(0.5-m) + "s"
                }
            obj.find(".pie_right").css {  #将右半环转到默认位置
                "-webkit-transform": "rotate(180deg)",
                "transform": "rotate(180deg)"
            }
            obj.find(".pie_left").css {  #将左半环转到相应位置
                "-webkit-transform": "rotate(#{(n-0.5)*360}deg)",
                "transform": "rotate(#{(n-0.5)*360}deg)"
            }

    # fancybox弹窗相册
    fancybox: ->
        if document.getElementsByClassName("fancybox")[0]?
            $('.fancybox').fancybox {
                prevEffect : 'none',
                nextEffect : 'none',
                closeBtn  : false,
                arrows    : true,
                nextClick : true
            }

    # 锚链接平滑移动
    smoothSlide: ->
        $("a[href*='#']").click (e) ->
            if location.pathname.replace(/^\//, '') is this.pathname.replace(/^\//, '') and location.hostname is this.hostname
                e.preventDefault()  #防止页面跳动
                hash = this.hash.slice(1)
                if hash.length
                    $target = $("[name=#{hash}]")
                    if $target.length
                        targetOffset = $target.offset().top
                        $("html,body").animate { scrollTop: targetOffset }, 800
                else
                    $("html,body").animate { scrollTop: 0 }, 800





#########################################################################
#                               基础功能                                #
#########################################################################

basic =

    # 获取屏幕宽度，判断设备类型
    getWinSize: ->
        # 响应式断点
        phoneLandscape = 568
        padPortrait = 768
        padLandscape = 1024
        pc = 1200
        winWidth = screen.width
        if winWidth < phoneLandscape then 1  #手机竖屏
        else if winWidth >= phoneLandscape and winWidth < padPortrait then 2  #手机横屏
        else if winWidth >= padPortrait and winWidth < padLandscape then 3  #平板竖屏
        else if winWidth >= padLandscape && winWidth < pc then 4  #平板横屏
        else 5  #PC

    # 判断浏览器类型与版本
    explorerType: (detailed) ->  #参数控制是否显示浏览器完整版本号
        Sys = {}
        ua = navigator.userAgent.toLowerCase()
        if s = ua.match /rv:([\d.]+)\) like gecko/ then Sys.ie = s[1]
        else if s = ua.match /msie ([\d.]+)/ then Sys.ie = s[1]
        else if s = ua.match /firefox\/([\d.]+)/ then Sys.firefox = s[1]
        else if s = ua.match /chrome\/([\d.]+)/ then Sys.chrome = s[1]
        else if s = ua.match /opera.([\d.]+)/ then Sys.opera = s[1]
        else if s = ua.match /version\/([\d.]+).*safari/ then Sys.safari = s[1]
        else 0
        if detailed
            if Sys.ie then return {"type":"ie","version":Sys.ie}
            else if Sys.firefox then return {"type":"firefox","version":Sys.firefox}
            else if Sys.chrome then return {"type":"chrome","version":Sys.chrome}
            else if Sys.opera then return {"type":"opera","version":Sys.opera}
            else if Sys.safari then return {"type":"safari","version":Sys.safari}
            else return {"type":"null","version":"0"}
        else
            if Sys.ie then return {"type":"ie","version":parseInt(Sys.ie.split(".")[0])}
            else if Sys.firefox then return {"type":"firefox","version":parseInt(Sys.firefox.split(".")[0])}
            else if Sys.chrome then return {"type":"chrome","version":parseInt(Sys.chrome.split(".")[0])}
            else if Sys.opera then return {"type":"opera","version":parseInt(Sys.opera.split(".")[0])}
            else if Sys.safari then return {"type":"safari","version":parseInt(Sys.safari.split(".")[0])}
            else return {"type":"null","version":"0"}

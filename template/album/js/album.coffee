exports = this

Viewer = (images) ->
    self = this
    @images = images
    @image_paths = (image.path for image in images)
    @image_doms = $('.fb-image')
    @image_doms.click ->
        current_index = $.inArray(this, self.image_doms)
        self.current_index(current_index)
        self.current_window('image-viewer')
        return false

    @current_window = ko.observable()
    @current_window.subscribe (show_window) => $(document.body).css {'overflow': if show_window then 'hidden' else 'auto'}
    @current_index = ko.observable()
    @has_exif = ko.observable(false)
    @current_image = ko.computed =>
        if @current_index()?
            location.hash = @image_paths[@current_index()]
            return @images[@current_index()]
    @has_next = ko.computed => @current_index()? and @current_index() < @images.length-1
    @has_pre = ko.computed => @current_index()? and @current_index() > 0


    @exif_list = ko.computed =>
        fields = {'model': 'Model', 'fn': 'Fn', 'exposure': 'Exposure', 'focal_length': 'Focal', 'iso': 'ISO'}
        @has_exif(false)
        exif_list = []
        if @current_image() and @current_image().exif
            exif = @current_image().exif
            for info_name of exif
                exif_list.push(k:fields[info_name], v:exif[info_name]) if info_name of fields
                @has_exif(true)
            return exif_list
        return []

    @next = =>
        if @has_next()
            self.current_index(@current_index()+1)
            $('.image img').removeClass('loaded')

    @pre = =>
        if @has_pre()
            self.current_index(@current_index()-1)
            $('.image img').removeClass('loaded')

    @show_exif = ko.observable(false)

    @show_full = =>
        img_dom = $('.image-viewer .image img')
        if img_dom
            if img_dom.css('max-height') == '100%' # to fullscreen
                img_dom.css({'max-height': 'none'})
                $('.icon-resize-full').removeClass('icon-resize-full').addClass('icon-resize-small')
                $('.image-viewer .wrap').css(width: '100%', 'margin-top': 0)
                $('.image-viewer .body').css('max-height': '100%')
            else
                img_dom.css({'max-height': '100%'})
                $('.icon-resize-small').removeClass('icon-resize-small').addClass('icon-resize-full')
                $('.image-viewer .wrap').css(width: '80%', 'margin-top': '4%')
                $('.image-viewer .body').css('max-height': '80%')


    return this

compute_gps = (image) ->
    if image and image.exif and image.exif.latitude and image.exif.longitude
        gps = {lat: image.exif.latitude, lng: image.exif.longitude, title: image.title}
        if 75<gps.lng<125 and 20<gps.lat <50 #maybe in China, offset
            gps.lat = gps.lat - 0.0020746128999990844
            gps.lng = gps.lng + 0.0047
        return gps

@draw_map = (images)=>
    markers = []
    for image in images
        gps = compute_gps(image)
        if gps
            index = $.inArray(image, images)
            click_marker = (index)=>
                @viewer.current_index(index)
                @viewer.current_window('image-viewer')
            gps.click = click_marker.bind({}, index)
            markers.push(gps)

    if markers.length
        $('.map-box').css({display: 'inline-block'})
        map = new GMaps {div: '#map', lat: markers[0].lat, lng: markers[0].lng}
        map.addMarkers(markers)
        map.fitZoom()


@run_viewer = (images) ->
    $(document).ready ->
        viewer = new Viewer images
        exports.viewer = viewer

        default_hash = location.hash.replace('#', '')
        if default_hash in viewer.image_paths
            viewer.current_index($.inArray(default_hash, viewer.image_paths))
            show_viewer = ->
                viewer.current_window('image-viewer')
            setTimeout(show_viewer, 100)

        ko.applyBindings viewer


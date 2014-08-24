
ends_with = (str, suffix) ->
    return str.indexOf(suffix, str.length - suffix.length) != -1;


update_change = (path)->
    if not path
        return
    parts = path.split(/\./)
    ext = parts[parts.length-1]
    css_exts = ['css', 'scss', 'sass' ,'less']

    if ext in css_exts
        # reload the css
        update_css(path)
    else
        if document.activeElement.type in ['textarea', 'text'] # no_reload if editing
            return false
        # refresh
        if no_reload? and no_reload
            return false #ignore
        # finnaly
        location.reload()

update_css = (path)->
    for link in document.getElementsByTagName('link')
        href = link.href or ''
        href_path = href.split('?')[0].toLowerCase()
        if ends_with(href_path, path)
            # replate the css now.
            href = href.replace(/[?&]changed=.*?$/, '') # to the orignal url
            if href.indexOf('?') == -1
                href = href + '?changed=' + Math.random()
            else
                href = href + '&changed=' + Math.random()
            link.href = href;
            break
    return false


if WebSocket? and JSON?
    if document.location.protocol == 'https:' then ws_protocl='wss:' else ws_protocl='ws:'
    ws_url = ws_protocl+'realtime.farbox.com/notes'
    socket = null
    connect_to_farbox = =>
        socket = new WebSocket(ws_url)
        connectted_at = new Date()
        path_blocks = {}
        socket.onmessage = (message)->
            note = JSON.parse(message.data)
            if path_blocks[note.path]
                return false
            else
                path_blocks[note.path] = true # block it, avoid the same path events conflicts
                if note.doc_type == 'template'
                    update_change(note.path)
                path_blocks[note.path] = false # release the block
        socket.onclose = ->
            if (new Date() - connectted_at)/1000 > 10
                connect_to_farbox() #reconnect
    keep_live = =>
        if socket
            socket.send('ping')
    # first time call
    connect_to_farbox()
    setInterval(keep_live, 30000)

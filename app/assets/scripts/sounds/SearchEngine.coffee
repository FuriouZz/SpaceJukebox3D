class SPACE.SearchEngine
  SC: null
  jukebox: null

  # HTML
  input:         null
  list:          null
  listContainer: null
  el:            null
  lineHeight:    0
  resultsHeight: 0
  results:       null
  focused:       null

  scrollPos:     0

  @state:  null


  constructor: (jukebox)->
    @jukebox       = jukebox
    @SC            = SPACE.SC

    @el            = document.querySelector('.search')
    @input         = document.querySelector('.search form input')
    @list          = document.querySelector('.search .list')
    @listContainer = document.querySelector('.search ul')

    @setState(SearchEngineState.CLOSED)
    @_events()

  _events: ->
    document.querySelector('.search form').addEventListener('submit', @_eJukeboxIsSearching)
    document.addEventListener('keyup', @_eKeypress)

  _eJukeboxIsSearching: (e)=>
    e.preventDefault()
    @search(@input.value) if @input.value.length > 0

  _eKeypress: (e)=>
    switch(e.keyCode)
      when Keyboard.ENTER
        if @input.value.length == 0
          if @state == SearchEngineState.CLOSED
            @setState(SearchEngineState.OPENED)
          else
            @setState(SearchEngineState.CLOSED)
        else if @state == SearchEngineState.SEARCH and @focused
          @setState(SearchEngineState.TRACK_SELECTED)
        else if @state == SearchEngineState.TRACK_SELECTED
          @add()

      when Keyboard.UP
        @up() if @state == SearchEngineState.SEARCH

      when Keyboard.DOWN
        @down() if @state == SearchEngineState.SEARCH

      when Keyboard.ESC, Keyboard.DELETE
        if @state == SearchEngineState.SEARCH
          @setState(SearchEngineState.OPENED)
        else if @state == SearchEngineState.TRACK_SELECTED
          @setState(SearchEngineState.SEARCH)
        else
          @setState(SearchEngineState.CLOSED)

      else
        return false

  setState: (state)->
    @state = state
    switch @state
      when SearchEngineState.OPENED
        @el.classList.remove('hidden')
        @el.classList.remove('search_open')

        @input.value    = ''
        @input.disabled = false
        @input.focus()

        @reset()
      when SearchEngineState.CLOSED
        @el.classList.add('hidden')
      when SearchEngineState.SEARCH
        @el.classList.add('search_open')

        @input.disabled = true
        @input.blur()

        @lineHeight    = @listContainer.querySelector('li').offsetHeight
        @resultsHeight = @lineHeight * (@listContainer.querySelectorAll('li').length-1)

        @focused.classList.remove('selected') if @focused
        @el.classList.remove('item_selected')
      when SearchEngineState.TRACK_SELECTED
        @focused.classList.add('selected')
        @el.classList.add('item_selected')

  up: ->
    next = @scrollPos + @lineHeight
    if next <= 0
      @scrollPos = next
      @focus()

  down: ->
    next = @scrollPos - @lineHeight
    if Math.abs(next) <= @resultsHeight
      @scrollPos = next
      @focus()

  focus: =>
    if @listContainer.querySelectorAll('li').length > 1
      $([@listContainer, @input]).css('transform', 'translate(0, '+@scrollPos+'px)')
      pos = (@scrollPos*-1) / (@resultsHeight / (@listContainer.querySelectorAll('li').length-1))
      pos = Math.floor(pos)
      elm = @el.querySelector('li:nth-child('+(pos+1)+')')

      if elm.getAttribute('data-index')
        @focused.classList.remove('focused') if @focused
        @focused = elm
        @focused.classList.add('focused')
      else
        @focused = null
    else
      @setState(SearchEngineState.OPENED)
      # $([@listContainer, @input]).css('transform', 'translate(0, 0)')

  reset: ->
    @focused   = null
    @scrollPos = 0
    $([@listContainer, @input]).css('transform', 'translate(0, '+@scrollPos+'px)')
    @listContainer.innerHTML = ''

  add: ->
    index = @focused.getAttribute('data-index')
    track = @results[index]
    @jukebox.add(track) if track

    @focused.classList.add('added')
    $(@focused).css({
      'transform': 'scale(.75) translateX('+window.innerWidth+'px)'
    })

    setTimeout(=>
      @focused.remove()
      @setState(SearchEngineState.SEARCH)
      @up() if @focused.nextSibling
      @focus()
    , 500)

  search: (value)->
    path = value.split(/\s/)[0]
    if /^(track|tracks|playlist|playlists|set|sets|user|users)$/.test(path)
      lastChar = path.charAt(path.length-1)
      value    = value.replace(path+' ', '')
      path     += 's' if lastChar != 's'
      path     = 'playlists' if /sets/.test(path)
    else
      path     = 'tracks'

    string = '''
      [
        {"kind":"track","id":63256906,"created_at":"2012/10/13 10:47:16 +0000","user_id":788205,"duration":237840,"commentable":true,"state":"finished","original_content_size":9543168,"last_modified":"2014/12/22 21:01:17 +0000","sharing":"public","tag_list":"","permalink":"janet-jackson-if-kaytranada","streamable":true,"embeddable_by":"all","downloadable":true,"purchase_url":"https://www.dropbox.com/s/yua1lj16zs44rzl/Janet%20Jackson%20-%20If%20Kaytranada%20Live%20Set%20Version.mp3","label_id":null,"purchase_title":"Alternate Version DL","genre":"Poplockin Music","title":"Janet Jackson - If (Kaytranada Remix)","description":"Alternate Version, for DJs, well, thats the version i use for my dj sets; https://www.dropbox.com/s/yua1lj16zs44rzl/Janet%20Jackson%20-%20If%20Kaytranada%20Live%20Set%20Version.mp3","label_name":"","release":"","track_type":"remix","key_signature":"","isrc":"","video_url":null,"bpm":null,"release_year":null,"release_month":null,"release_day":null,"original_format":"mp3","license":"all-rights-reserved","uri":"https://api.soundcloud.com/tracks/63256906","user":{"id":788205,"kind":"user","permalink":"kaytranada","username":"KAYTRANADA","last_modified":"2014/11/07 04:11:36 +0000","uri":"https://api.soundcloud.com/users/788205","permalink_url":"http://soundcloud.com/kaytranada","avatar_url":"https://i1.sndcdn.com/avatars-000074803694-qibxt4-large.jpg"},"user_playback_count":1,"user_favorite":true,"permalink_url":"http://soundcloud.com/kaytranada/janet-jackson-if-kaytranada","artwork_url":"https://i1.sndcdn.com/artworks-000032094597-56ts7n-large.jpg","waveform_url":"https://w1.sndcdn.com/aqRGi4DmbCWz_m.png","stream_url":"https://api.soundcloud.com/tracks/63256906/stream","download_url":"https://api.soundcloud.com/tracks/63256906/download","playback_count":3331033,"download_count":96112,"favoritings_count":66653,"comment_count":1594,"attachments_uri":"https://api.soundcloud.com/tracks/63256906/attachments","policy":"ALLOW"},
        {"kind":"track","id":63256906,"created_at":"2012/10/13 10:47:16 +0000","user_id":788205,"duration":237840,"commentable":true,"state":"finished","original_content_size":9543168,"last_modified":"2014/12/22 21:01:17 +0000","sharing":"public","tag_list":"","permalink":"janet-jackson-if-kaytranada","streamable":true,"embeddable_by":"all","downloadable":true,"purchase_url":"https://www.dropbox.com/s/yua1lj16zs44rzl/Janet%20Jackson%20-%20If%20Kaytranada%20Live%20Set%20Version.mp3","label_id":null,"purchase_title":"Alternate Version DL","genre":"Poplockin Music","title":"Janet Jackson - If (Kaytranada Remix)","description":"Alternate Version, for DJs, well, thats the version i use for my dj sets; https://www.dropbox.com/s/yua1lj16zs44rzl/Janet%20Jackson%20-%20If%20Kaytranada%20Live%20Set%20Version.mp3","label_name":"","release":"","track_type":"remix","key_signature":"","isrc":"","video_url":null,"bpm":null,"release_year":null,"release_month":null,"release_day":null,"original_format":"mp3","license":"all-rights-reserved","uri":"https://api.soundcloud.com/tracks/63256906","user":{"id":788205,"kind":"user","permalink":"kaytranada","username":"KAYTRANADA","last_modified":"2014/11/07 04:11:36 +0000","uri":"https://api.soundcloud.com/users/788205","permalink_url":"http://soundcloud.com/kaytranada","avatar_url":"https://i1.sndcdn.com/avatars-000074803694-qibxt4-large.jpg"},"user_playback_count":1,"user_favorite":true,"permalink_url":"http://soundcloud.com/kaytranada/janet-jackson-if-kaytranada","artwork_url":"https://i1.sndcdn.com/artworks-000032094597-56ts7n-large.jpg","waveform_url":"https://w1.sndcdn.com/aqRGi4DmbCWz_m.png","stream_url":"https://api.soundcloud.com/tracks/63256906/stream","download_url":"https://api.soundcloud.com/tracks/63256906/download","playback_count":3331033,"download_count":96112,"favoritings_count":66653,"comment_count":1594,"attachments_uri":"https://api.soundcloud.com/tracks/63256906/attachments","policy":"ALLOW"},
        {"kind":"track","id":63256906,"created_at":"2012/10/13 10:47:16 +0000","user_id":788205,"duration":237840,"commentable":true,"state":"finished","original_content_size":9543168,"last_modified":"2014/12/22 21:01:17 +0000","sharing":"public","tag_list":"","permalink":"janet-jackson-if-kaytranada","streamable":true,"embeddable_by":"all","downloadable":true,"purchase_url":"https://www.dropbox.com/s/yua1lj16zs44rzl/Janet%20Jackson%20-%20If%20Kaytranada%20Live%20Set%20Version.mp3","label_id":null,"purchase_title":"Alternate Version DL","genre":"Poplockin Music","title":"Janet Jackson - If (Kaytranada Remix)","description":"Alternate Version, for DJs, well, thats the version i use for my dj sets; https://www.dropbox.com/s/yua1lj16zs44rzl/Janet%20Jackson%20-%20If%20Kaytranada%20Live%20Set%20Version.mp3","label_name":"","release":"","track_type":"remix","key_signature":"","isrc":"","video_url":null,"bpm":null,"release_year":null,"release_month":null,"release_day":null,"original_format":"mp3","license":"all-rights-reserved","uri":"https://api.soundcloud.com/tracks/63256906","user":{"id":788205,"kind":"user","permalink":"kaytranada","username":"KAYTRANADA","last_modified":"2014/11/07 04:11:36 +0000","uri":"https://api.soundcloud.com/users/788205","permalink_url":"http://soundcloud.com/kaytranada","avatar_url":"https://i1.sndcdn.com/avatars-000074803694-qibxt4-large.jpg"},"user_playback_count":1,"user_favorite":true,"permalink_url":"http://soundcloud.com/kaytranada/janet-jackson-if-kaytranada","artwork_url":"https://i1.sndcdn.com/artworks-000032094597-56ts7n-large.jpg","waveform_url":"https://w1.sndcdn.com/aqRGi4DmbCWz_m.png","stream_url":"https://api.soundcloud.com/tracks/63256906/stream","download_url":"https://api.soundcloud.com/tracks/63256906/download","playback_count":3331033,"download_count":96112,"favoritings_count":66653,"comment_count":1594,"attachments_uri":"https://api.soundcloud.com/tracks/63256906/attachments","policy":"ALLOW"},
        {"kind":"track","id":63256906,"created_at":"2012/10/13 10:47:16 +0000","user_id":788205,"duration":237840,"commentable":true,"state":"finished","original_content_size":9543168,"last_modified":"2014/12/22 21:01:17 +0000","sharing":"public","tag_list":"","permalink":"janet-jackson-if-kaytranada","streamable":true,"embeddable_by":"all","downloadable":true,"purchase_url":"https://www.dropbox.com/s/yua1lj16zs44rzl/Janet%20Jackson%20-%20If%20Kaytranada%20Live%20Set%20Version.mp3","label_id":null,"purchase_title":"Alternate Version DL","genre":"Poplockin Music","title":"Janet Jackson - If (Kaytranada Remix)","description":"Alternate Version, for DJs, well, thats the version i use for my dj sets; https://www.dropbox.com/s/yua1lj16zs44rzl/Janet%20Jackson%20-%20If%20Kaytranada%20Live%20Set%20Version.mp3","label_name":"","release":"","track_type":"remix","key_signature":"","isrc":"","video_url":null,"bpm":null,"release_year":null,"release_month":null,"release_day":null,"original_format":"mp3","license":"all-rights-reserved","uri":"https://api.soundcloud.com/tracks/63256906","user":{"id":788205,"kind":"user","permalink":"kaytranada","username":"KAYTRANADA","last_modified":"2014/11/07 04:11:36 +0000","uri":"https://api.soundcloud.com/users/788205","permalink_url":"http://soundcloud.com/kaytranada","avatar_url":"https://i1.sndcdn.com/avatars-000074803694-qibxt4-large.jpg"},"user_playback_count":1,"user_favorite":true,"permalink_url":"http://soundcloud.com/kaytranada/janet-jackson-if-kaytranada","artwork_url":"https://i1.sndcdn.com/artworks-000032094597-56ts7n-large.jpg","waveform_url":"https://w1.sndcdn.com/aqRGi4DmbCWz_m.png","stream_url":"https://api.soundcloud.com/tracks/63256906/stream","download_url":"https://api.soundcloud.com/tracks/63256906/download","playback_count":3331033,"download_count":96112,"favoritings_count":66653,"comment_count":1594,"attachments_uri":"https://api.soundcloud.com/tracks/63256906/attachments","policy":"ALLOW"}
      ]
    '''

    results = JSON.parse(string)

    @input.value = 'Looking for "'+value+'"'
    # @SC.search(value, path, (results)=>
    if results.length == 0
      @input.value = '"'+value+'" has no result'
      return

    @results     = []
    @listContainer.appendChild(document.createElement('li'))
    for track, i in results
      li = document.createElement('li')
      li.setAttribute('data-index', i)

      artwork_url = track.artwork_url
      artwork_url = 'images/no_artwork.gif' unless artwork_url
      li.innerHTML = """
        <div>
          <img src="#{artwork_url}" alt="" onerror="this.src='images/no_artwork.gif'">
          <div>
            <p>#{track.title}</p>
            <p>#{track.user.username.toLowerCase()}</p>
          </div>
        </div>
      """
      @results.push(track)
      @listContainer.appendChild(li)
    @setState(SearchEngineState.SEARCH)
    # )

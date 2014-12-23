class SPACE.SoundCloud

  client_id:    null
  redirect_uri: null
  token:        null

  @IS_CONNECTED: (-> return new Event('soundcloud_connected'))()

  constructor: (id, redirect_uri)->
    SC.initialize({
      client_id: id
      redirect_uri: redirect_uri
    })

    @client_id    = id
    @redirect_uri = redirect_uri

    # soundManager.setup({
    #   url:
    #   autoPlay: true
    #   useWaveformData: true
    #   useHTML5audio: true
    #   preferFlash: false
    #   flash9Options:
    #     useWaveformData: true
    # })

  isConnected: ->
    if (document.cookie.replace(/(?:(?:^|.*;\s*)soundcloud_connected\s*\=\s*([^;]*).*$)|^.*$/, "$1") != "true")
      document.querySelector('.login').classList.add('show')
      document.querySelector('.login').addEventListener('click', @_eClick)
    else
      @token = document.cookie.replace(/(?:(?:^|.*;\s*)soundcloud_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")
      return true
    return false

  _eClick: =>
    SC.connect(=>
      @token          = SC.accessToken()
      document.cookie = "soundcloud_token=" + @token
      document.cookie = "soundcloud_connected=true"
      document.querySelector('.login').classList.remove('show')
      _H.trigger(SPACE.SoundCloud.IS_CONNECTED)
    )

  pathOrUrl: (path, callback)->
    # Verify if it's an ID or an URL
    if /^\/(playlists|tracks|users)\/[0-9]+$/.test(path)
      return callback(path)

    unless /^(http|https)/.test(path)
      return console.log "\"" + path + "\" is not an url or a path"

    SC.get('/resolve', { url: path }, (track, error)=>
      if (error)
        console.log error.message
      else
        url = ['', track.kind+'s', track.id].join('/')
        callback(url)
    )

  streamSound: (object, options={}, callback)->
    if object and object.hasOwnProperty('kind')
      path = object.uri.replace('https://api.soundcloud.com', '')

      defaults =
        autoPlay: true
        useWaveformData: true
        useHTML5audio: true
        preferFlash: false

      options = _Coffee.merge(defaults, options)
      SC.stream(path, options, callback)
      # soundManager.flash9Options.useWaveformData = true

      # @getSoundUrl(path, (url)->
      #   options.url = url
      #   sound = soundManager.createSound(options)
      #   callback(sound)
      # )

  getSoundOrPlaylist: (path, callback)->
    if typeof path == 'object' and path.hasOwnProperty('kind')
      callback(path)
      return true

    @pathOrUrl(path, (path)=>
      @get(path, callback)
    )

  get: (path, callback)->
    SC.get(path, callback)

  getSoundUrl: (path, callback)->
    @getSoundOrPlaylist(path, (sound)=>
      callback(sound.stream_url+'?oauth_token='+@token)
    )

  search: (search, path, callback)->
    if typeof path == 'function'
      callback = path
      path     = 'tracks'

    if path == 'users'
      @pathOrUrl('https://soundcloud.com/'+search, (path)=>
        path = path+'/favorites?oauth_token='+@token
        SC.get(path, callback)
      )
    else
      path = '/'+path+'?oauth_token='+@token+'&q='+search
      SC.get(path, callback)

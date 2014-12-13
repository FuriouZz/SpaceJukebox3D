class SPACE.SoundCloud

  token: null

  constructor: (id)->
    SC.initialize({
      client_id: id
      redirect_uri: 'http://spacejukebox.dev/plouf.html'
    })

    if (document.cookie.replace(/(?:(?:^|.*;\s*)soundcloud_connected\s*\=\s*([^;]*).*$)|^.*$/, "$1") != "true")
      SC.connect(->
        token = SC.accessToken()
      )
    else
      @token = document.cookie.replace(/(?:(?:^|.*;\s*)soundcloud_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")

  pathOrUrl: (path, callback)->
    # Verify if it's an ID or an URL
    if /^\/(playlists|tracks)\/[0-9]+$/.test(path)
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

  streamSound: (object, callback, events={})->
    if object and object.hasOwnProperty('kind')
      path = object.uri.replace('https://api.soundcloud.com', '')
      SC.stream(path, {
        autoPlay: true
        # useEQData: true
        useWaveformData: true
        # usePeakData: true
        useHTML5audio: true
        preferFlash: false
        whileplaying : events.whileplaying
        onplay       : events.onplay
        onfinish     : events.onfinish
      }, callback)

  getSoundOrPlaylist: (path, callback)->
    @pathOrUrl(path, (path)=>
      @get(path, callback)
    )

  get: (path, callback)->
    SC.get(path, callback)

  getSoundUrl: (path, callback)->
    @getSoundOrPlaylist(path, (sound)=>
      callback(sound.stream_url+'?oauth_token='+@token)
    )

class SPACE.SoundCloud
  constructor: (id)->
    SC.initialize({
      client_id: id
      redirect_uri: 'http://localhost:3000'
    })

    # # IF NO TOKEN
    # SC.connect(->
    #   # 1-31329-11457116-c5b96945c5e7e7c
    #   console.log SC.accessToken()
    # )

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
      SC.stream(path+'?token=1-31329-11457116-c5b96945c5e7e7c', {
        autoPlay: true
        # useEQData: true
        useWaveformData: true
        # usePeakData: true
        whileplaying : events.whileplaying
        onplay       : events.onplay
        onfinish     : events.onfinish
      }, callback)

  getSoundOrPlaylist: (path, callback)->
    @pathOrUrl(path, (path)=>
      @get(path, callback)
    )

  get: (path, callback)->
    SC.get(path+'?token=1-31329-11457116-c5b96945c5e7e7c', callback)

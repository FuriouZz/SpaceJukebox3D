class Track

  # Class variables and methods
  ###############################################
  @IS_WAITING: 'track_is_waiting'
  @WILL_PLAY:  'track_will_play'
  @IS_PLAYING: 'track_is_playing'
  @IS_PAUSED:  'track_is_paused'
  @IS_STOPPED: 'track_is_stopped'

  @Source:
    SoundCloud: 'SoundCloud'
    MP3:        'MP3'
    Input:      'Input'

  @API:
    SoundManager2: 'SoundManager2'
    WebAudioAPI:   'WebAudioAPI'
    JSON:          'JSON'

  @create: (sourceUrl, callback)->
    tracks = []

    # If Input
    if typeof sourceUrl == 'boolean' and sourceUrl == true
      track = new Track()
      tracks.push(track)

    # If MP3
    else if /(\.mp3)/gi.test(sourceUrl)
      urls       = [sourceUrl]
      isPlaylist = false

      if typeof sourceUrl == 'array' 
        urls       = sourceUrl
        isPlaylist = true

      for url in urls
        track = new Track({
          source: Track.Source.MP3
          url: url
          is_playlist: isPlaylist
          source_url:  sourceUrl
        })
        tracks.push(track)

    # Else SoundCloud link
    else if /(soundcloud)/gi.test(sourceUrl)
      SPACE.SC.getSoundOrPlaylist sourceUrl, (o)=>
        scTracks   = [o]
        isPlaylist = false

        if o.hasOwnProperty('tracks')
          scTracks   = o.tracks
          isPlaylist = true

        for data in scTracks
          track = new Track({
            api:         Track.API.SoundManager2
            source:      Track.Source.SoundCloud
            sc_object:   data
            is_playlist: isPlaylist
            source_url:  sourceUrl

            title:       data.title
            author_name: data.user.username
            author_url:  data.user.permalink_url
            cover_url:   data.artwork_url
            url:         data.stream_url
          })

          track.mergeData({ playlist: o }) if isPlaylist

          tracks.push(track)

        callback(tracks)
      return

    callback(tracks)

  # Instance variables and methods
  ###############################################
  data:     null
  api:      null
  autoplay: false
  loaded:   0

  constructor: (data)->
    @data =
      title:       null
      author_name: null
      author_url:  null
      cover_url:   null
      url:         null
      is_playlist: false
      api:         Track.API.WebAudioAPI
      source:      Track.Source.Input
      timedata:    []  

    @data = HELPER.Coffee.merge(@data, data)
    @_muteTimedata()

    @_setState(Track.IS_WAITING)

  mergeData: (extra)->
    @data = HELPER.Coffee.merge(@data, extra)

  _setState: (state)->
    @state = state
    switch @state
      when Track.IS_WAITING
        HELPER.trigger(Track.IS_WAITING, { track: this })
      when Track.WILL_PLAY
        @_muteTimedata()
        HELPER.trigger(Track.WILL_PLAY, { track: this })
      when Track.IS_PLAYING
        HELPER.trigger(Track.IS_PLAYING, { track: this })
      when Track.IS_PAUSED
        @_muteTimedata()
        HELPER.trigger(Track.IS_PAUSED, { track: this })
      when Track.IS_STOPPED
        @_muteTimedata()
        HELPER.trigger(Track.IS_STOPPED, { track: this })

  # Public methods
  getTimedata: ->
    return @data.timedata

  stream: ->
    @_setState(Track.WILL_PLAY)

    if @data.api == Track.API.SoundManager2
      @_soundmanager2()
    else
      @_webaudioapi()

  play: ->
    @api.play()

  pause: ->
    @api.pause()

  stop: ->
    @api.stop()

  volume: (value)->
    value *= 100 if @data.api == Track.API.SoundManager2
    @api.setVolume(value)

  destroy: ->
    @api.destruct()

  # Private methods
  _webaudioapi: =>
    unless window.firstLaunch
      firstLaunch = false
      @autoplay   = false if /mobile/gi.test(navigator.userAgent)
    else 
      @autoplay = true  

    @api                   = WebAudioAPI
    @api.onplay            = @_onplay
    @api.onended           = @_onended
    @api.onpause           = @_onpause
    @api.onstop            = @_onstop
    @api.onaudioprocess    = @_whileplaying
    @api.onloadingprogress = @_whileloading
    
    if @data.source == Track.Source.Input
      @api.inputMode = true 
      @api.streamInput()
    else
      @api.inputMode = false 
      @api.setUrl(@data.url, @autoplay, @_onstart)    

  _soundmanager2: ->
    SPACE.SC.streamSound(@data.sc_object, {
      onplay       : @_onplay
      onfinish     : @_onended
      onstop       : @_onstop
      whileplaying : @_whileplaying
      whileloading : =>
        @_whileloading(@api.bytesLoaded / @api.bytesTotal)
    }, @_onstart)

  _muteTimedata: ->
    @data.timedata = Array(256)
    for i in [0..255]
      @data.timedata[i] = 0


  # API Events
  _onstart: (api)=>
    @api            = api
    window.AudioAPI = api

  _onplay: =>
    @_setState(Track.IS_PLAYING)

  _onpause: =>
    @_setState(Track.IS_PAUSED)

  _onstop: =>
    @_setState(Track.IS_STOPPED)

  _onended: =>
    @_setState(Track.IS_STOPPED)

  _whileloading: (value)=>
    @loaded = value

  _whileplaying: =>
    timedata = @data.timedata

    switch @data.api
      when Track.API.SoundManager2
        for i in [0..255]
          timedata[i] = Math.max(@api.waveformData.left[i], @api.waveformData.right[i])
      
      when Track.API.WebAudioAPI
        analyser = @api.analyser
        unless analyser.getFloatTimeDomainData
          array    =  new Uint8Array(analyser.fftSize)
          analyser.getByteTimeDomainData(array)
          for i in [0..255]
            timedata[i] = (array[i] - 128) / 128
        else
          array    =  new Float32Array(analyser.fftSize)
          analyser.getFloatTimeDomainData(array)
          for i in [0..255]
            timedata[i] = array[i]

    @data.timedata = timedata

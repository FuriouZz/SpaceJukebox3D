class SPACE.Track

  # STATES
  @IS_WAITING: 'track_is_waiting'
  @WILL_PLAY:  'track_will_play'
  @IS_PLAYING: 'track_is_playing'
  @IS_PAUSED:  'track_is_paused'
  @IS_STOPPED: 'track_is_stopped'

  @APIType:
    SoundManager2: 'SoundManager2'
    WebAudioAPI:   'WebAudioAPI'
    JSON:          'JSON'

  # Properties
  _SC:      null
  _data:    null
  _APIType: null
  _API:     null

  timedata: null

  autoplay: true
  state:    null

  loadingprogression: 0
  inputMode:          false

  constructor: ->
    @_SC      = SPACE.SC
    @_APIType = SPACE.Track.APIType.WebAudioAPI
    @setState(SPACE.Track.IS_WAITING)

  #
  # Setters
  ###########################################
  setData: (data)->
    @_data = data

  setState: (state)->
    @state = state
    switch @state
      when SPACE.Track.IS_WAITING
        HELPER.trigger(SPACE.Track.IS_WAITING, { track: this })
      when SPACE.Track.WILL_PLAY
        @timedata = Array(256)
        HELPER.trigger(SPACE.Track.WILL_PLAY, { track: this })
      when SPACE.Track.IS_PLAYING
        HELPER.trigger(SPACE.Track.IS_PLAYING, { track: this })
      when SPACE.Track.IS_PAUSED
        HELPER.trigger(SPACE.Track.IS_PAUSED, { track: this })
      when SPACE.Track.IS_STOPPED
        HELPER.trigger(SPACE.Track.IS_STOPPED, { track: this })

  #
  # Public methods
  ###########################################
  load: ->
    @setState(SPACE.Track.WILL_PLAY)

    if @inputMode
      @_webaudioapi()
    else if @_APIType == 'WebAudioAPI'
      @_SC.getSoundUrl('/tracks/'+@_data.id, @_webaudioapi)
    else
      @_soundmanager2()

  play: ->
    @_API.play()

  pause: ->
    @_API.pause()

  stop: ->
    @_API.stop()

  volume: (value)->
    @_API.volume(value)

  destroy: ->
    switch @_APIType
      when SPACE.Track.APIType.SoundManager2
        @_API.destruct()
      when SPACE.Track.APIType.WebAudioAPI
        @_API.destroy()
      else
        console.log('something to destroy here')

  #
  # Private methods
  ###########################################
  _onstart: (api)=>
    @_API           = api
    window.AudioAPI = api

  _onplay: =>
    @setState(SPACE.Track.IS_PLAYING)

  _onpause: =>
    @setState(SPACE.Track.IS_PAUSED)

  _onstop: =>
    @setState(SPACE.Track.IS_STOPPED)

  _onended: =>
    @setState(SPACE.Track.IS_STOPPED)

  _onloadingprogress: (value)=>
    @loadingprogression = value

  _whileplaying: =>
    switch @_APIType
      when SPACE.Track.APIType.SoundManager2
        for i in [0..255]
          @timedata[i] = Math.max(@sound.waveformData.left[i], @sound.waveformData.right[i])
      
      when SPACE.Track.APIType.WebAudioAPI
        analyser = @_API.analyser
        unless analyser.getFloatTimeDomainData
          array    =  new Uint8Array(analyser.fftSize)
          analyser.getByteTimeDomainData(array)
          for i in [0..255]
            @timedata[i] = (array[i] - 128) / 128
        else
          array    =  new Float32Array(analyser.fftSize)
          analyser.getFloatTimeDomainData(array)
          for i in [0..255]
            @timedata[i] = array[i]

  _webaudioapi: (url)=>
    unless window.firstLaunch
      firstLaunch = false
      @autoplay   = false if /mobile/gi.test(navigator.userAgent)
    else 
      @autoplay = true  

    @_API                   = WebAudioAPI
    @_API.onplay            = @_onplay
    @_API.onended           = @_onended
    @_API.onpause           = @_onpause
    @_API.onstop            = @_onstop
    @_API.onaudioprocess    = @_whileplaying
    @_API.onloadingprogress = @_onloadingprogress
    
    if @inputMode
      @_API.inputMode = true 
      @_API.streamInput()
    else
      @_API.inputMode = false 
      @_API.setUrl(url, @autoplay, @_onstart)    

  _soundmanager2: ->
    @_SC.streamSound(@_data, {
      onplay       : @_onplay
      onfinish     : @_onended
      onstop       : @_onstop
      whileplaying : @_whileplaying
      whileloading : =>
        @_onloadingprogress(@_API.bytesLoaded / @_API.bytesTotal)
    }, @_onstart)

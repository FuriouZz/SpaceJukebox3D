class SPACE.Track

  data:                 null
  spaceship:            null
  sound:                null

  time:                 0
  pendingDuration:      0

  isPlaying:            false
  whileplayingCallback: null

  constructor: (data)->
    @data = data
    @SC   = SPACE.SC
    @_events()

  _events: ->
    document.addEventListener(TRACK.IS_PLAYING.type, @_eTrackIsPlaying)
    document.addEventListener(TRACK.IS_STOPPED.type, @_eTrackIsStopped)

  _eTrackIsPlaying: =>
    @isPlaying = true

  _eTrackIsStopped: =>
    @isPlaying = false

  stream: ->
    url  = 'resources/sounds/'+@data.url

    window.WebAudioAPI = window.WebAudioAPI || new SPACE.WebAudioAPI()

    @api = WebAudioAPI
    @api.onplay         = @_onplay
    @api.onaudioprocess = @_whileplaying
    @api.onended        = @_onfinish
    @api.setUrl(url)

  play: ->
    @api.play()

  pause: ->
    @api.pause()

  stop: ->
    @api.stop()
    @_onfinish()

  destruct: ->
    document.removeEventListener(TRACK.IS_PLAYING.type, @_eTrackIsPlaying)
    document.removeEventListener(TRACK.IS_STOPPED.type, @_eTrackIsStopped)
    @api.destroy()

  _starting: (sound)=>
    @sound = sound
    SPACE.LOG('Next: ' + @data.title)

  _onplay: =>
    _H.trigger(TRACK.IS_PLAYING, { track: this })

  _onfinish: =>
    _H.trigger(TRACK.IS_STOPPED, { track: this })
    @api.stop()

  datas: Array(256)
  _whileplaying: (e)=>
    analyser = @api.analyser
    array    =  new Float32Array(analyser.fftSize)
    analyser.getFloatTimeDomainData(array)

    for i in [0..255]
      @datas[i] = array[i]

    @waveformData =
      mono: @datas

    @whileplayingCallback() if @whileplayingCallback

class SPACE.Track

  data:                 null
  spaceship:            null
  sound:                null

  time:                 0
  pendingDuration:      0

  isPlaying:            false
  whileplayingCallback: null

  timedata: null

  constructor: (data)->
    @data     = data
    @SC       = SPACE.SC
    @timedata = Array(256)
    @_events()

  _events: ->
    document.addEventListener(EVENT.Track.IS_PLAYING.type, @_eTrackIsPlaying)
    document.addEventListener(EVENT.Track.IS_STOPPED.type, @_eTrackIsStopped)

  _eTrackIsPlaying: =>
    @isPlaying = true

  _eTrackIsStopped: =>
    @isPlaying = false

  stream: ->
    url  = 'resources/sounds/'+@data.url

    autoplay = true
    unless window.WebAudioAPI
      window.WebAudioAPI = window.WebAudioAPI || new SPACE.WebAudioAPI()
      autoplay = false

    @api = WebAudioAPI
    @api.onplay         = @_onplay
    @api.onpause        = @_onpause
    @api.onaudioprocess = @_whileplaying
    @api.onended        = @_onfinish
    @api.setUrl(url, autoplay, @_onload)

  play: ->
    @api.play()

  pause: ->
    @api.pause()

  stop: ->
    @api.stop()
    @_onfinish()

  destruct: ->
    document.removeEventListener(EVENT.Track.IS_PLAYING.type, @_eTrackIsPlaying)
    document.removeEventListener(EVENT.Track.IS_STOPPED.type, @_eTrackIsStopped)
    @api.destroy()

  _onload: =>
    HELPER.trigger(EVENT.Track.IS_LOADED, { track: this })

  _starting: (sound)=>
    @sound = sound
    SPACE.LOG('Next: ' + @data.title)

  _onplay: =>
    HELPER.trigger(EVENT.Track.IS_PLAYING, { track: this })

  _onpause: =>
    HELPER.trigger(EVENT.Track.IS_PAUSED, { track: this })

  _onfinish: =>
    HELPER.trigger(EVENT.Track.IS_STOPPED, { track: this })
    @api.stop()
    @_reset()

  _whileplaying: (e)=>
    analyser = @api.analyser

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

    @waveformData =
      mono: @timedata

    @whileplayingCallback() if @whileplayingCallback

  _reset: ->
    for data, i in @waveformData.mono
      data = @timedata[i] = 0


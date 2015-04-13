class WebAudioAPI

  # State
  @IS_PLAYING: 'webaudioapi_is_playing'
  @IS_PAUSED:  'webaudioapi_is_paused'
  @IS_STOPPED: 'webaudioapi_is_stopped'
  @IS_ENDED:   'webaudioapi_is_ended'

  # Properties
  identifier: 'WebAudioAPI'

  ctx:       null
  analyser:  null
  processor: null
  buffer:    null
  src:       null

  startTime: 0
  position:  0
  duration:  0

  time: 0

  isLoaded: false

  state: null

  _vendorURL: null
  _inputMode:   false

  ## Setup Web Audio API
  constructor: ->
    # Setup AudioContext
    try
      if (window.AudioContextObject == undefined)
        window.AudioContextObject = new (window.AudioContext||window.webkitAudioContext)()
    catch e
      if (App.env == 'development')
        console.log("HTML5 Web Audio API not supported. Switch to SoundManager2.")

    @ctx = AudioContextObject
    @_oldBrowser()

    # Setup UserMedia
    navigator.getUserMedia =
      navigator.getUserMedia    or navigator.webkitGetUserMedia or 
      navigator.mozGetUserMedia or navigator.msGetUserMedia
    @_vendorURL = window.URL || window.webkitURL

    # Set default state
    @setState(WebAudioAPI.IS_ENDED)

  setUrl: (url, autoplay=false, callback)->
    if @inputMode
      alert('Disable input mode')
      return

    request = new XMLHttpRequest()
    request.open('GET', url, true)
    request.responseType    = 'arraybuffer'
    request.withCredentials = false
    request.onload = =>
      @ctx.decodeAudioData(request.response, (buffer)=>
        @isLoaded = true
        @buffer = buffer
        callback(this) if callback
        @play() if autoplay
      , @_onError)
    request.onprogress = (e)=>
      if e.lengthComputable
        @onloadingprogress(e.loaded / e.total) if @onloadingprogress 
    request.send()

  streamInput: ->
    unless @inputMode
      alert('Enable input mode')
      return

    navigator.getUserMedia({ video: false, audio: true }, (stream)=>
      @isLoaded     = true
      @_localstream = stream
      @play()
    , @_onError)

  setState: (state)->
    @state = state

  _onError: (e)->
    console.log 'ERROR', e

  pause: ->
    if @inputMode
      @stop()
    else if @src
      @src.stop(0)
      @src       = null
      @processor.onaudioprocess = null
      @position  = @ctx.currentTime - @startTime
      @setState(WebAudioAPI.IS_PAUSED)
      @onpause() if @onpause

  play: (position)->
    return unless @isLoaded
    if @state == WebAudioAPI.IS_PLAYING
      @pause()
      return

    @_connect()

    unless @inputMode
      @position  = if typeof position == 'number' then position else @position or 0
      @startTime = @ctx.currentTime - (@position or 0)
      @src.start(@ctx.currentTime, @position)

    @setState(WebAudioAPI.IS_PLAYING)
    @onplay() if @onplay

  stop: ->
    if @src
      if @inputMode
        @src.mediaStream.stop()
        @isLoaded    = false
        @localstream = null
      else
        @src.stop(0)
      @src       = null
      @processor.onaudioprocess = null
      @position  = 0
      @startTime = 0
      @setState(WebAudioAPI.IS_STOPPED)
      @onstop() if @onstop

  volume: (volume)->
    volume = Math.min(1, Math.max(0, volume))
    @gainNode.gain.value = volume

  updatePosition: ->
    if @state == WebAudioAPI.IS_PLAYING
      @position = @ctx.currentTime - @startTime

    if @position > @buffer.duration
      @position = @buffer.duration
      @pause()

    return @position

  seek: (time)->
    if @state == WebAudioAPI.IS_PLAYING
      @play(time)
    else
      @position = time

  destroy: ->
    @stop()
    @_disconnect()
    @ctx = null

  _connect: ->
    if @inputMode and @_localstream
      # Setup audio source
      @src = @ctx.createMediaStreamSource(@_localstream)
    else
      # Setup buffer source
      @src                 = @ctx.createBufferSource()
      @src.buffer          = @buffer
      @src.onended         = @_onEnded
      @duration            = @buffer.duration

    # Setup analyser
    @analyser = @ctx.createAnalyser()
    @analyser.smoothingTimeConstant = 0.8
    @analyser.minDecibels           = -140
    @analyser.maxDecibels           = 0
    @analyser.fftSize               = 512

    # Setup ScriptProcessor
    @processor = @ctx.createScriptProcessor(2048, 1, 1)

    # Setp GainNode
    @gainNode = @ctx.createGain()

    @src.connect(@analyser)
    @src.connect(@gainNode)
    @analyser.connect(@processor)
    @processor.connect(@ctx.destination)
    @gainNode.connect(@ctx.destination)

    @processor.onaudioprocess = @_onAudioProcess
    @processor.api = @

    @_oldBrowser()

  _disconnect: ->
    @analyser.disconnect(0)  if @analyser
    @processor.disconnect(0) if @processor
    @gainNode.disconnect(0)  if @gainNode

  _onAudioProcess: =>
    @onaudioprocess() if @onaudioprocess

  _onEnded: (e)=>
    if @src and (@state == WebAudioAPI.IS_STOPPED || @state == WebAudioAPI.IS_PLAYING)
      @src.disconnect(0)
      @src                      = null
      @processor.onaudioprocess = null
      @state = WebAudioAPI.IS_ENDED
      @onended() if @onended

  _oldBrowser: ->
    if @ctx and typeof @ctx.createScriptProcessor != 'function'
      @ctx.createScriptProcessor = @ctx.createJavaScriptNode

    if @src and typeof @src.start != 'function'
      @src.start = @src.noteOn

    if @src and typeof @src.stop != 'function'
      @src.stop = @src.noteOff

WebAudioAPI = new WebAudioAPI()

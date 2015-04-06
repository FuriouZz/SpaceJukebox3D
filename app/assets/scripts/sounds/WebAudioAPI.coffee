class SPACE.WebAudioAPI

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
  isPlaying: false
  isPaused: true

  state: null

  ## Setup Web Audio API
  constructor: ->
    try
      if (window.AudioContextObject == undefined)
        window.AudioContextObject = new (window.AudioContext||window.webkitAudioContext)()
    catch e
      if (App.env == 'development')
        console.log("HTML5 Web Audio API not supported. Switch to SoundManager2.")

    @setState(ENUM.AudioState.IS_ENDED)

  setUrl: (url, autoplay=false, callback)->
    @ctx = AudioContextObject
    @_oldBrowser()

    request = new XMLHttpRequest()
    request.open('GET', url, true)
    request.responseType = 'arraybuffer'
    request.withCredentials = true
    request.onload = =>
      @ctx.decodeAudioData(request.response, (buffer)=>
        @isLoaded = true
        @buffer = buffer
        @play() if autoplay
        callback() if callback
      , @_onError)
    request.send()

  setState: (state)->
    @state = state

  _onError: ->
    console.log 'ERROR'

  pause: ->
    if @src
      @src.stop(0)
      @src       = null
      @processor.onaudioprocess = null
      @position  = @ctx.currentTime - @startTime
      @setState(ENUM.AudioState.IS_PAUSED)
      @onpause() if @onpause

  play: (position)->
    return unless @isLoaded
    if @state == ENUM.AudioState.IS_PLAYING
      @pause()
      return

    @_connect()
    @position  = if typeof position == 'number' then position else @position or 0
    @startTime = @ctx.currentTime - (@position or 0)

    @src.start(@ctx.currentTime, @position)

    @setState(ENUM.AudioState.IS_PLAYING)
    @onplay() if @onplay

  stop: ->
    if @src
      @src.stop(0)
      @src       = null
      @processor.onaudioprocess = null
      @position  = 0
      @startTime = 0
      @setState(ENUM.AudioState.IS_STOPPED)

  volume: (volume)->
    volume = Math.min(1, Math.max(0, volume))
    @gainNode.gain.value = volume

  updatePosition: ->
    if @state == ENUM.AudioState.IS_PLAYING
      @position = @ctx.currentTime - @startTime

    if @position > @buffer.duration
      @position = @buffer.duration
      @pause()

    return @position

  seek: (time)->
    if @state == ENUM.AudioState.IS_PLAYING
      @play(time)
    else
      @position = time

  destroy: ->
    @stop()
    @_disconnect()
    @ctx = null

  _connect: ->
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

  _onAudioProcess: =>
    @onaudioprocess() if @onaudioprocess

  _onEnded: (e)=>
    if @src and (@state == ENUM.AudioState.IS_STOPPED || @state == ENUM.AudioState.IS_PLAYING)
      @src.disconnect(0)
      @src                      = null
      @processor.onaudioprocess = null
      @state = ENUM.AudioState.IS_ENDED
      @onended() if @onended

  _oldBrowser: ->
    if @ctx and typeof @ctx.createScriptProcessor != 'function'
      @ctx.createScriptProcessor = @ctx.createJavaScriptNode

    if @src and typeof @src.start != 'function'
      @src.start = @src.noteOn

    if @src and typeof @src.stop != 'function'
      @src.stop = @src.noteOff

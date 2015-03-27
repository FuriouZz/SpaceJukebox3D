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

  ## Setup Web Audio API
  constructor: ->
    try
      if (window.AudioContextObject == undefined)
        window.AudioContextObject = new (window.AudioContext||window.webkitAudioContext)()
    catch e
      if (App.env == 'development')
        console.log("HTML5 Web Audio API not supported. Switch to SoundManager2.")

  setUrl: (url)->
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
        @play()
      , @_onError)
    request.send()

  _onError: ->
    console.log 'ERROR'

  pause: ->
    if @src
      @src.stop(0)
      @src       = null
      @processor.onaudioprocess = null
      @position  = @ctx.currentTime - @startTime
      @isPlaying = false

  play: (position)->
    return unless @isLoaded
    @_connect()
    @position  = if typeof position == 'number' then position else @position or 0
    @startTime = @ctx.currentTime - (@position or 0)
    @src.start(@ctx.currentTime, @position)
    console.log @src
    @isPlaying = true
    @onplay() if @onplay

  stop: ->
    if @src
      @src.stop()
      @src.disconnect(0)
      @src       = null
      @processor.onaudioprocess = null
      @isPlaying = false
      @position  = 0
      @startTime = 0

  volume: (volume)->
    volume = Math.min(1, Math.max(0, volume))
    @gainNode.gain.value = volume

  updatePosition: ->
    if @isPlaying
      @position = @ctx.currentTime - @startTime

    if @position > @buffer.duration
      @position = @buffer.duration
      @pause()

    return @position

  seek: (time)->
    if @isPlaying
      @play(time)
    else
      @position = time

  destroy: ->
    @stop()
    @_disconnect()
    @ctx = null

  _connect: ->
    @pause() if @isPlaying

    # Setup buffer source
    @src                 = @ctx.createBufferSource()
    @src.buffer          = @buffer
    @src.onended         = @_onEnded
    @duration            = @buffer.duration

    # Setup analyser
    @analyser = @ctx.createAnalyser()
    @analyser.smoothingTimeConstant = .3
    @analyser.fftSize = 512

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
    @volume(0)

  _disconnect: ->
    @analyser.disconnect(0)  if @analyser
    @processor.disconnect(0) if @processor

  _onAudioProcess: =>
    @onaudioprocess() if @onaudioprocess

  _onEnded: =>
    @src.disconnect(0)
    @src                      = null
    @processor.onaudioprocess = null
    @isPlaying                = false
    @onended() if @onended

  _oldBrowser: ->
    if @ctx and typeof @ctx.createScriptProcessor != 'function'
      @ctx.createScriptProcessor = @ctx.createJavaScriptNode

    if @src and typeof @src.start != 'function'
      @src.start = @src.noteOn

    if @src and typeof @src.stop != 'function'
      @src.stop = @src.noteOff

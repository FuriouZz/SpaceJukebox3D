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

  update: (delta)->
    if @isPlaying
      @time += delta

    if @pendingDuration > 0 and (@pendingDuration - @time) < 60*60*1000 and @spaceship.state == SPACE.Spaceship.IDLE and @isPlaying
      SPACE.LOG('Spaceship launched : '+@data.title)
      @spaceship.setState(SPACE.Spaceship.LAUNCHED)

    if @spaceship.state == SPACE.Spaceship.LAUNCHED
      @spaceship.songDuration = (@pendingDuration - @time)

    if @spaceship.state == SPACE.Spaceship.IN_LOOP
      @spaceship.time = @spaceship.songDuration - (@pendingDuration - @time)

    if @spaceship.state == SPACE.Spaceship.ARRIVED
      @isPlaying = false

    @spaceship.update(delta)

  stream: ->
    @SC.streamSound(@data, {
      onplay       : @_onplay
      onfinish     : @_onfinish
      onstop       : @_onfinish
      whileplaying : @_whileplaying
    }, @_starting)

  play: ->
    @sound.play()

  pause: ->
    @sound.pause()

  stop: ->
    @_onfinish()

  destruct: ->
    document.removeEventListener(TRACK.IS_PLAYING.type, @_eTrackIsPlaying)
    document.removeEventListener(TRACK.IS_STOPPED.type, @_eTrackIsStopped)
    @sound.destruct()

  _starting: (sound)=>
    @sound = sound
    SPACE.LOG('Next: ' + @data.title)

  _onplay: =>
    _H.trigger(TRACK.IS_PLAYING, { track: this })

  _onfinish: ->
    _H.trigger(TRACK.IS_STOPPED, { track: this })
    @sound.stop()

  _whileplaying: =>
    datas = Array(256)
    for i in [0..255]
      datas[i] = Math.max(@sound.waveformData.left[i], @sound.waveformData.right[i])

    @waveformData =
      mono: datas
      stereo: @sound.waveformData

    @whileplayingCallback() if @whileplayingCallback

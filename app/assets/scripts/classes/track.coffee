class SPACE.Track

  data:      null
  spaceship: null

  sound:     null

  time:      0

  pendingDuration: 0

  JukeBoxisPlaying: false

  constructor: (data)->
    @data = data
    @_events()

  _events: ->
    document.addEventListener(JUKEBOX.IS_PLAYING.type, @_eJukeboxIsPlaying)
    document.addEventListener(JUKEBOX.IS_STOPPED.type, @_eJukeboxIsStopped)

  _eJukeboxIsPlaying: =>
    @JukeBoxisPlaying = true

  _eJukeboxIsStopped: =>
    @JukeBoxisPlaying = false
    console.log 'i said stop'

  update: (delta)->
    if @JukeBoxisPlaying
      @time += delta

    if @pendingDuration > 0 and (@pendingDuration - @time) < 15*60*1000 and @spaceship.state == SPACESHIP.IDLE and @JukeBoxisPlaying
      SPACE.LOG('Spaceship launched : '+@data.title)
      @spaceship.setState(SPACESHIP.LAUNCHED)
      @spaceship.duration = @spaceship.time = (@pendingDuration - @time)

    if @spaceship.state == SPACESHIP.LAUNCHED
      @spaceship.duration = @spaceship.time = (@pendingDuration - @time)

    if @spaceship.state == SPACESHIP.IN_LOOP
      @spaceship.time = (@pendingDuration - @time)

    @spaceship.update(delta)

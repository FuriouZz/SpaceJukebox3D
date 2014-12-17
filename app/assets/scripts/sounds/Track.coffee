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
    # console.log 'i said stop', @data.title

  update: (delta)->
    if @JukeBoxisPlaying
      @time += delta

    if @pendingDuration > 0 and (@pendingDuration - @time) < 1*60*1000 and @spaceship.state == SPACE.Spaceship.IDLE and @JukeBoxisPlaying
      SPACE.LOG('Spaceship launched : '+@data.title)
      @spaceship.setState(SPACE.Spaceship.LAUNCHED)

    if @spaceship.state == SPACE.Spaceship.LAUNCHED
      @spaceship.songDuration = (@pendingDuration - @time)

    if @spaceship.state == SPACE.Spaceship.IN_LOOP
      @spaceship.time = @spaceship.songDuration - (@pendingDuration - @time)

    if @spaceship.state == SPACE.Spaceship.ARRIVED
      @JukeBoxisPlaying = false    

    @spaceship.update(delta)

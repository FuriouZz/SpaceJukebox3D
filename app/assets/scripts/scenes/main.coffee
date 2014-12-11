class SPACE.MainScene extends SPACE.Scene

  playlist: null
  current: null

  constructor: (bg)->
    super(bg)

    middlePoint = new PIXI.Point(window.innerWidth * .5, window.innerHeight * .5)

    @eq = new SPACE.Equalizer(middlePoint, {minLength: 0, maxLength: 200, radius: 250})
    @addChild(@eq)

    @sc = new SPACE.SoundCloud(SPACE.SOUNDCLOUD.id)

    # @playlist = []
    # @_predefinedPlaylist()
    @_events()

    @jukebox = new SPACE.Jukebox()
    @jukebox.whileplaying = @_whileplaying

  _events: ->
    document.addEventListener(JUKEBOX.TRACK_ON_ADD.type, @_eTrackOnAdd)

  _eTrackOnAdd: (e)=>
    spaceship = new SPACE.Spaceship(@eq.center, @eq.radius)
    @addChild(spaceship)

    track = e.object.track
    track.spaceship = spaceship
    HELPERS.trigger(JUKEBOX.TRACK_ADDED, { track: track })

    @dotted = new SPACE.DottedLine(track)
    @addChild(@dotted)

  _predefinedPlaylist: ->
    @add('https://soundcloud.com/chonch-2/courte-danse-macabre')
    @add('https://soundcloud.com/chonch-2/mouais')
    @add('https://soundcloud.com/huhwhatandwhere/sets/supreme-laziness-the-celestics')
    @add('https://soundcloud.com/chonch-2/cacaco-2')
    @add('https://soundcloud.com/chonch-2/duodenum')
    @add('https://soundcloud.com/chonch-2/little-green-monkey')

  draw: ->
    @eq.draw()

  update: (delta)->
    super
    @jukebox.update(delta)

  #   for track, i in @playlist
  #     track.update(delta)

  #   if @playlist.length > 0
  #     @next() if @current == null

  # add: (soundOrPlaylist)->
  #   middlePoint = new PIXI.Point(window.innerWidth * .5, window.innerHeight * .5)

  #   @sc.getSoundOrPlaylist(soundOrPlaylist, (o)=>
  #     tracks = null
  #     if o.hasOwnProperty('tracks')
  #       tracks = o.tracks
  #     else
  #       tracks = []
  #       tracks.push(o)

  #     for data in tracks
  #       # Create Spaceship
  #       spaceship = new SPACE.Spaceship(middlePoint, @eq.radius)
  #       @addChild(spaceship)

  #       # Create track from data and spaceship
  #       track = new SPACE.Track(data, spaceship)
  #       track.durationBeforeLaunching = @getDurationFromPosition(@playlist.length-1)
  #       @playlist.push(track)

  #   )

  # getDurationFromPosition: (position)->
  #   duration = 0
  #   for track, i in @playlist
  #     duration += track.data.duration
  #     break if i == position
  #   return duration

  # next: (track)->
  #   @_onfinish() if @current
  #   @current = @playlist.shift()

  #   @sc.streamSound(@current.data, @_starting, {
  #     onplay       : @_onplay
  #     onfinish     : @_onfinish
  #     onstop       : @_onstop
  #     whileplaying : @_whileplaying
  #   })

  # play: ->
  #   if @current and @current.hasOwnProperty('sound')
  #     @current.sound.play()

  # resume: ->
  #   if @current and @current.hasOwnProperty('sound')
  #     @current.sound.resume()

  # pause: ->
  #   if @current and @current.hasOwnProperty('sound')
  #     @current.sound.pause()
  #     @eq.mute()

  # stop: ->
  #   if @current and @current.hasOwnProperty('sound')
  #     @current.sound.stop()
  #     @eq.mute()

  # _starting: (sound)=>
  #   @current.sound = sound
  #   document.dispatchEvent(SPACE.Track.ON_PLAY())

  # _onplay: =>
  #   console.log 'onplay'

  # _onfinish: =>
  #   @current.sound.stop()
  #   @current = null
  #   @eq.mute()
  #   @tmpPosition = 0
  #   document.dispatchEvent(SPACE.Track.ON_STOP())

  _whileplaying: =>
    sound = @jukebox.current.sound

    datas = Array(256)
    for i in [0..127]
      datas[i]     = Math.max(sound.waveformData.left[i], sound.waveformData.right[i])
      datas[255-i] = Math.max(sound.waveformData.left[i], sound.waveformData.right[i])

    if sound.paused
      @eq.mute()
    else
      @eq.setNewValues(datas)


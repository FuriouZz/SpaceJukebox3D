class Cover

  constructor: ->
    @_events()

  _events: ->
    document.addEventListener(TRACK.IS_PLAYING.type, @_eTrackIsPlaying)

  _eTrackIsPlaying: (e)->
    track = e.object.track
    title = track.data.title
    username = track.data.user.username
    console.log(title, username)

  update: ()->


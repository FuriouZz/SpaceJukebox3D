window.JUKEBOX =
  TRACK_ON_ADD:       new Event('jukebox_track_on_add')
  TRACK_ON_ADD_ERROR: new Event('jukebox_track_on_add_error')
  TRACK_ADDED:        new Event('jukebox_track_added')
  ON_PLAY:            new Event('jukebox_on_play')
  ON_STOP:            new Event('jukebox_on_stop')
  IS_PLAYING:         new Event('jukebox_is_playing')
  IS_STOPPED:         new Event('jukebox_is_stopped')
  IS_SEARCHING:       new Event('jukebox_is_searching')
Object.freeze(JUKEBOX)

window.TRACK =
  IS_PLAYING: new Event('track_is_playing')
  IS_PAUSED:  new Event('track_is_paused')
  IS_STOPPED: new Event('track_is_stopped')
Object.freeze(TRACK)

JUKEBOX = {}
JUKEBOX.__defineGetter__('TRACK_ON_ADD', -> return new Event('jukebox_track_on_add') )
JUKEBOX.__defineGetter__('TRACK_ADDED',  -> return new Event('jukebox_track_added') )
JUKEBOX.__defineGetter__('ON_PLAY',      -> return new Event('jukebox_on_play'))
JUKEBOX.__defineGetter__('ON_STOP',      -> return new Event('jukebox_on_stop'))
JUKEBOX.__defineGetter__('IS_PLAYING',   -> return new Event('jukebox_is_playing'))
JUKEBOX.__defineGetter__('IS_STOPPED',   -> return new Event('jukebox_is_stopped'))

TRACK = {}
TRACK.__defineGetter__('IS_PLAYING', -> return new Event('track_is_playing'))
TRACK.__defineGetter__('IS_PAUSED',  -> return new Event('track_is_paused'))
TRACK.__defineGetter__('IS_STOPPED', -> return new Event('track_is_stopped'))

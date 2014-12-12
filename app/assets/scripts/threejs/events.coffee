# SPACESHIP = {}
# SPACESHIP.__defineGetter__('IDLE', -> return 'IDLE')
# SPACESHIP.__defineGetter__('LAUNCHED', -> return 'LAUNCHED')
# SPACESHIP.__defineGetter__('IN_LOOP', -> return 'IN_LOOP')
# SPACESHIP.__defineGetter__('ARRIVED', -> return 'ARRIVED')

JUKEBOX = {}
JUKEBOX.__defineGetter__('TRACK_ON_ADD', -> return new Event('jukebox_track_on_add') )
JUKEBOX.__defineGetter__('TRACK_ADDED',  -> return new Event('jukebox_track_added') )
JUKEBOX.__defineGetter__('ON_PLAY',      -> return new Event('jukebox_on_play'))
JUKEBOX.__defineGetter__('ON_STOP',      -> return new Event('jukebox_on_stop'))
JUKEBOX.__defineGetter__('IS_PLAYING',   -> return new Event('jukebox_is_playing'))
JUKEBOX.__defineGetter__('IS_STOPPED',   -> return new Event('jukebox_is_stopped'))

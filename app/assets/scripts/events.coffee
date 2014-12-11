SPACESHIP = {}
SPACESHIP.__defineGetter__('IDLE', -> return 'IDLE')
SPACESHIP.__defineGetter__('LAUNCHED', -> return 'LAUNCHED')
SPACESHIP.__defineGetter__('IN_LOOP', -> return 'IN_LOOP')
SPACESHIP.__defineGetter__('ARRIVED', -> return 'ARRIVED')

  # @ON_PLAY: ->
  #   ev = document.createEvent('HTMLEvents')
  #   ev.initEvent('soundonplay', true, true)
  #   ev.eventName = 'soundonplay'
  #   return ev

  # @ON_STOP: ->
  #   ev = document.createEvent('HTMLEvents')
  #   ev.initEvent('soundonstop', true, true)
  #   ev.eventName = 'soundonstop'
  #   return ev

JUKEBOX = {}
JUKEBOX.__defineGetter__('TRACK_ON_ADD', -> return new Event('trackonadd') )
JUKEBOX.__defineGetter__('TRACK_ADDED',  -> return new Event('trackadded') )
JUKEBOX.__defineGetter__('ON_PLAY',      -> return new Event('jukeboxonplay'))
JUKEBOX.__defineGetter__('ON_STOP',      -> return new Event('jukeboxonstop'))
JUKEBOX.__defineGetter__('IS_PLAYING',   -> return new Event('jukeboxisplaying'))
JUKEBOX.__defineGetter__('IS_STOPPED',   -> return new Event('jukeboxisstopped'))

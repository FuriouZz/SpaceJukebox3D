SPACE = SPACE || {}

SPACE.ENV        = 'development'

# PIXI.JS
SPACE.FPS        = 60
SPACE.pixelRatio = (window.devicePixelRatio || 1)

# THREE.JS
SPACE.THREE = {}

# SOUNDCLOUD
SPACE.SOUNDCLOUD =
  id: '807d28575c384e62a58be5c3a1446e68'

# SPACESHIP EVENTS STATES


# METHODS
SPACE.LOG        = (log)->
  unless /(prod|production)/.test(SPACE.ENV)
      time = (new Date()).toTimeString()
      console.log(time+' '+log)

SPACE.ASSERT     = (condition, action)->
  action() if condition
  return condition

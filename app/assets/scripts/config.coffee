SPACE = SPACE || {}

SPACE.ENV        = 'development'

# PIXI.JS
SPACE.FPS        = 30
SPACE.pixelRatio = (window.devicePixelRatio || 1)

# THREE.JS
SPACE.THREE = {}

# SOUNDCLOUD
SPACE.SC = (->
  object = {}
  if SPACE.ENV == 'development'
    object.id = 'de0b8539b4ad2f6cc23dfe1cc6e0438d'
  else
    object.id = '807d28575c384e62a58be5c3a1446e68'
  object.redirect_uri = window.location.origin
  return object
)()


# METHODS
SPACE.LOG        = (log, styles='')->
  unless /(prod|production)/.test(SPACE.ENV)
      date     = new Date()
      timeStr  = date.toTimeString()
      timeStr  = timeStr.substr(0, 8)
      dateStr  = date.getDate() + '/'
      dateStr += (date.getMonth()+1) + '/'
      dateStr += date.getFullYear()
      console.log(dateStr+' - '+timeStr+' | '+log, styles)

SPACE.TODO       = (message)->
  SPACE.LOG('%cTODO | ' + message, 'color: #0088FF')

SPACE.ASSERT     = (condition, action)->
  action() if condition
  return condition

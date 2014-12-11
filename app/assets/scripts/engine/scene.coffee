class Scene extends PIXI.Stage
  paused: false

  constructor: (bg)->
    super(bg)

  update: (delta)=>
    for child in @children
      @updateObj(child, delta)

  updateObj: (obj, delta)->
    obj.update(delta) if typeof obj.update == 'function'
    if obj.children && obj.children.length > 0
      for child in obj.children
        @updateObj(child, delta)

  resize: ->

  resume: ->
    @paused = false

  pause: ->
    @paused = true

  isPaused: ->
    return @paused

SPACE.Scene = Scene

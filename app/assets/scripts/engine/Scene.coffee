class SPACE.Scene extends THREE.Scene
  # paused: false

  constructor: ->
    super

    @type             = 'Scene'
    @fog              = null
    @overrideMaterial = null
    @autoUpdate       = true

  update: (delta)->
    for child in @children
      @updateObj(child, delta)

  updateObj: (obj, delta)->
    obj.update(delta) if typeof obj.update == 'function'
    if obj.hasOwnProperty('children') and obj.children.length > 0
      for child in obj.children
        @updateObj(child, delta)

  resize: =>
    for child in @children
      @resizeObj(child)

  resizeObj: (obj)->
    obj.resize() if typeof obj.resize == 'function'
    if obj.hasOwnProperty('children') and obj.children.length > 0
      for child in obj.children
        @resizeObj(child)

  resume: ->
    @paused = false

  pause: ->
    @paused = true

  isPaused: ->
    return @paused

class SPACE.Equalizer extends PIXI.Graphics

  center:     null

  _values:    null
  _oldValues: null
  _newValues: null

  _time: 1

  # Parameters
  maxLength:         0
  minLength:         0
  radius:            0
  interpolationTime: 0

  constructor: (point, opts={})->
    super

    # Set parameters
    defaults =
      maxLength:         200
      minLength:         50
      radius:            250
      interpolationTime: 150

    opts               = HELPERS.merge(defaults, opts)
    @minLength         = opts.minLength
    @maxLength         = opts.maxLength
    @radius            = opts.radius
    @interpolationTime = opts.interpolationTime

    # Set values
    @center     = new PIXI.Point(point.x, point.y)
    @_values    = []
    @_oldValues = []
    @_newValues = []

  setNewValues: (values)->
    newValues = []
    for value in values
      length = @minLength + parseFloat(value)*(@maxLength - @minLength)
      newValues.push(length)

    @_newValues = newValues
    @resetTime()

  random: =>
    rands = []
    for i in [0..255]
      rands[i] = Math.random()
    @setNewValues(rands)

  mute: =>
    mute = []
    for i in [0..255]
      mute[i] = 0
    @setNewValues(mute)

  update: (delta)->
    @_time += delta
    t = @_time / @interpolationTime
    return if t > 1

    for i in [0..(@_newValues.length-1)]
      diff        = @_oldValues[i] - @_newValues[i]
      @_values[i] = @_oldValues[i] - t * diff

  resetTime: ->
    @_time = 0
    @_oldValues = @_values

    if @_newValues.length > @_oldValues.length
      for i in [(@_oldValues.length)..(@_newValues.length-1)]
        @_oldValues[i] = 0

  calculateLinePoint: (angle, length)->
    center = HELPERS.retina(@center)
    x = center.x + Math.cos(angle) * length
    y = center.y + Math.sin(angle) * length
    return new PIXI.Point(x, y)

  draw: ->
    @clear()
    @lineStyle(SPACE.pixelRatio, 0xFFFFFF, .75)

    for i in [0..(@_values.length-1)]
      angle  = PIXI.PI_2 * i / (@_values.length)
      angle  += Math.PI*.5

      length = @_values[i]
      radius = HELPERS.retina(@radius)

      from = @calculateLinePoint(angle, radius-length*.5)
      to   = @calculateLinePoint(angle, radius+length*.5)

      @drawline(from.x, from.y, to.x, to.y)

  drawline: (fromX, fromY, toX, toY)->
    @moveTo(fromX, fromY)
    @lineTo(toX, toY)

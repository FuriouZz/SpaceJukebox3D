class SPACE.Equalizer extends THREE.Group

  center:     null

  _values:    null
  _newValues: null
  _oldValues: null

  _time:      1

  # THREE
  material:   null
  lines:      null
  isGenerated: false

  # Parameters
  maxLength:         0
  minLength:         0
  radius:            0
  interpolationTime: 0
  color:             0xFFFFFF
  lineForceUp:       .5
  lineForceDown:     .5
  absolute:          false

  constructor: (point, opts={})->
    super

    # Set parameters
    defaults =
      maxLength:         200
      minLength:         50
      radius:            250
      interpolationTime: 150
      color:             0xDE548E
      lineForceUp:       .5
      lineForceDown:     .5
      absolute:          false

    opts               = HELPERS.merge(defaults, opts)
    @minLength         = opts.minLength
    @maxLength         = opts.maxLength
    @radius            = opts.radius
    @interpolationTime = opts.interpolationTime
    @color             = opts.color
    @lineForceUp       = opts.lineForceUp
    @lineForceDown     = opts.lineForceDown
    @absolute          = opts.absolute

    # Set values
    @center     = point
    @_values    = []
    @_oldValues = []
    @_newValues = []

    @generate()

  setValues: (values)->
    newValues = []
    for value in values
      value = Math.abs(value) if @absolute
      length = @minLength + parseFloat(value)*(@maxLength - @minLength)
      newValues.push(Math.max(length, 0))
    @_newValues = newValues
    @resetInterpolation()

  generate: ->
    @mute()

    @material   = new THREE.LineBasicMaterial({ color: @color, linewidth: 4 })
    @lines      = []

    @update(0)
    @updateGeometries(true)

  update: (delta)->
    @_time += delta
    t = @_time / @interpolationTime
    return if t > 1

    for i in [0..(@_newValues.length-1)]
      diff        = @_oldValues[i] - @_newValues[i]
      @_values[i] = @_oldValues[i] - t * diff
    @updateGeometries()# if @isGenerated

  updateGeometries: (create=false)->
    for i in [0..(@_values.length-1)]
      angle  = Math.PI * 2 * i / (@_values.length)

      length = @_values[i]
      radius = @radius

      from = @computePosition(@center, angle, radius-length*@lineForceDown)
      to   = @computePosition(@center, angle, radius+length*@lineForceUp)

      if typeof @lines[i] == 'undefined'
        geometry = new THREE.Geometry()
        geometry.vertices.push(from, to, from)

        line = new THREE.Line(geometry, @material)
        @lines.push(line)
        @add(line)
      else
        line = @lines[i]
        line.geometry.vertices[0] = from
        line.geometry.vertices[1] = to
        line.geometry.vertices[2] = from
        line.geometry.verticesNeedUpdate = true

  random: (setValues=true)=>
    values = []
    for i in [0..63]
      values[i] = Math.random()
    @setValues(values) if setValues
    return values

  mute: (setValues=true)->
    values = []
    for i in [0..63]
      values[i] = 0
    @setValues(values) if setValues

  resetInterpolation: ->
    @_time = 0
    @_oldValues = @_values

    if @_newValues.length > @_oldValues.length
      for i in [(@_oldValues.length)..(@_newValues.length-1)]
        @_oldValues[i] = 0

  computePosition: (point, angle, length)->
    x = point.x + Math.sin(angle) * length
    y = point.y + Math.cos(angle) * length
    return new THREE.Vector3(x, y, point.z)


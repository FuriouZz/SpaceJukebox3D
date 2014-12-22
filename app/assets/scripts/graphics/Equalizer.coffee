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
  nbValues:          0
  maxNbValues:       512
  mirror:            true

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
      nbValues:          256 # Maximum 512 values
      mirror:            true

    opts               = _Coffee.merge(defaults, opts)
    @minLength         = opts.minLength
    @maxLength         = opts.maxLength
    @radius            = opts.radius
    @interpolationTime = opts.interpolationTime
    @color             = opts.color
    @lineForceUp       = opts.lineForceUp
    @lineForceDown     = opts.lineForceDown
    @absolute          = opts.absolute
    @nbValues          = opts.nbValues
    @mirror            = opts.mirror

    # Set values
    @center     = point
    @_values    = @mute(false)
    @_oldValues = @mute(false)
    @_newValues = @mute(false)

    @generate()

  setNbValues: (nbValues)->
    @nbValues = nbValues
    @mute()

  setValues: (values)->
    if @mirror
      datas  = Array(@nbValues)
      for i in [0..((@nbValues*.5)-1)]
        datas[i] = datas[@nbValues-1-i] = values[i]
      values = datas

    newValues = @mute(false)
    for value, i in values
      value = Math.abs(value) if @absolute
      length = @minLength + parseFloat(value)*(@maxLength - @minLength)
      newValues[i] = Math.max(length, 0)
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

    for i in [0..(@maxNbValues-1)]
      diff        = @_oldValues[i] - @_newValues[i]
      @_values[i] = @_oldValues[i] - t * diff
    @updateGeometries()

  updateGeometries: (create=false)->
    if @test
      console.log @_values.length, @_oldValues.length, @_newValues.length

    for length, i in @_values
      angle  = Math.PI * 2 * i / (@nbValues-1)

      from = @computePosition(@center, angle, @radius-length*@lineForceDown)
      to   = @computePosition(@center, angle, @radius+length*@lineForceUp)

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
    for i in [0..(@maxNbValues-1)]
      values[i] = Math.random()
    @setValues(values) if setValues
    return values

  mute: (setValues=true)->
    values = []
    for i in [0..(@maxNbValues-1)]
      values[i] = 0
    @setValues(values) if setValues
    return values

  resetInterpolation: ->
    @_time = 0
    @_oldValues = @_values
    @_values    = @mute(false)

    if @_newValues.length > @_oldValues.length
      for i in [(@_oldValues.length)..(@_newValues.length-1)]
        @_oldValues[i] = 0

  computePosition: (point, angle, length)->
    x = point.x + Math.sin(angle) * length
    y = point.y + Math.cos(angle) * length
    return new THREE.Vector3(x, y, point.z)

  removeLineFromParent: (index)->
    parent = @lines[index]
    parent.remove(@lines[index])

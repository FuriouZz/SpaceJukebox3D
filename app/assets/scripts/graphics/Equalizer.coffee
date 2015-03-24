class SPACE.Equalizer extends THREE.Group

  center:     null

  _values:    null
  _newValues: null

  _time:      1

  # THREE
  material:   null
  lines:      null

  # Parameters
  maxLength:         0
  minLength:         0
  radius:            0
  interpolationTime: 0
  color:             0xFFFFFF
  lineForceUp:       .5
  lineForceDown:     .5
  linewidth:         0
  absolute:          false
  nbValues:          0
  maxNbValues:       512
  mirror:            true

  constructor: (opts={})->
    super

    # Set parameters
    defaults =
      maxLength:         200
      minLength:         50
      radius:            250
      interpolationTime: 150
      color:             0xFFFFFF
      lineForceUp:       .5
      lineForceDown:     .5
      absolute:          false
      nbValues:          256 # Maximum 512 values
      mirror:            true
      linewidth:         2

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
    @linewidth         = opts.linewidth

    # Set values
    @center     = new THREE.Vector3()
    @_values    = @mute(false)
    @_newValues = @mute(false)

    @generate()

    @_events()
    @updateValues()

  _events: ->
    document.addEventListener(TRACK.IS_STOPPED.type, @_eTrackIsStopped)

  _eTrackIsStopped: =>
    @mute()

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

    @material   = new THREE.LineBasicMaterial({ color: @color, linewidth: @linewidth })
    @lines      = []

    @update(0)
    @updateGeometries(true)

  update: (delta)->
    @_time += delta
    t = @_time / @interpolationTime
    return if t > 1

    for i in [0..(@maxNbValues-1)]
      diff        = @_values[i] - @_newValues[i]
      @_values[i] = @_values[i] - t * diff

    @updateGeometries()

  updateValues: =>
    if SPACE.Jukebox.state == JukeboxState.IS_PLAYING and SPACE.Jukebox.waveformData.mono
      @setValues(SPACE.Jukebox.waveformData.mono)
    setTimeout(@updateValues, @interpolationTime * .5)

  updateGeometries: (create=false)->
    for length, i in @_values
      angle  = Math.PI * 2 * i / @nbValues

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

  computePosition: (point, angle, length)->
    x = point.x + Math.sin(angle) * length
    y = point.y + Math.cos(angle) * length
    return new THREE.Vector3(x, y, point.z)

  removeLineFromParent: (index)->
    parent = @lines[index]
    parent.remove(@lines[index])

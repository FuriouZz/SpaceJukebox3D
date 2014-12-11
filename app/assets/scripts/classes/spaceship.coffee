class SPACE.Spaceship extends PIXI.Graphics

  isIncoming: false
  isLoop:     false

  target:     null
  radius:     0

  currentDistance: 0
  distance:   0
  angle:      0

  time:       0

  state:      null

  constructor: (target, radius)->
    super

    @target          = new PIXI.Point(target.x, target.y)
    @radius          = radius

    @currentDistance = Math.max(window.innerWidth, window.innerHeight)
    @angle           = Math.random() * PIXI.PI_2

    target      = HELPERS.retina(@target)
    @position.x = target.x + Math.cos(@angle) * HELPERS.retina(@currentDistance)
    @position.y = target.y + Math.sin(@angle) * HELPERS.retina(@currentDistance)

    @setState(SPACESHIP.IDLE)

    @draw()

  setState: (state)->
    @state = state

    switch state
      when SPACESHIP.IDLE
        @isIncoming = false
        @isLoop     = false
      when SPACESHIP.LAUNCHED
        @isIncoming      = true
        @isLoop          = false
      when SPACESHIP.IN_LOOP
        @isIncoming      = false
        @isLoop          = true
        @distance        = HELPERS.distance(@position, HELPERS.retina(@target))
        @currentDistance = @distance
        @duration        = @time
      when SPACESHIP.ARRIVED
        @isIncoming = false
        @isLoop     = false
        console.log 'arrived'
      else
        @setState(SPACESHIP.IDLE)

  forward: (angle, speed)->
    @move(angle + Math.PI, speed)

  backward: (angle, speed)->
    @move(angle, speed)

  move: (angle, speed)->
    direction   = new PIXI.Point(0, 0)
    direction.x = Math.cos(angle) * speed
    direction.y = Math.sin(angle) * speed

    @position.x += direction.x
    @position.y += direction.y

    @rotation = angle

  draw: ->
    @beginFill(0xFFFFFF)
    @moveTo(0, HELPERS.retina(-2.5))
    @lineTo(0, HELPERS.retina(2.5))
    @lineTo(HELPERS.retina(7.5), 0)

  update: (delta)->
    if @state == SPACESHIP.LAUNCHED
      @_updateLaunched()
    else if @state == SPACESHIP.IN_LOOP
      @_updateInLoop()

  _updateLaunched: ->
    if HELPERS.distance(@position, HELPERS.retina(@target)) <= HELPERS.retina(@radius)
      @setState(SPACESHIP.IN_LOOP)
    @forward(@angle, 1)

  _updateInLoop: ->
    progression = @time / @duration
    progression = 1 - Math.min(progression, 1)

    @currentDistance = @distance * (1 - progression)
    target = HELPERS.retina(@target)
    pos =
      x: target.x + Math.cos(@angle + (progression * PIXI.PI_2))* @currentDistance
      y: target.y + Math.sin(@angle + (progression * PIXI.PI_2))* @currentDistance

    old =
      x: @position.x
      y: @position.y

    @position.x = pos.x
    @position.y = pos.y

    angle = HELPERS.angleBetweenPoints(old, @position)
    @rotation = angle

    @setState(SPACESHIP.ARRIVED) if progression >= 1

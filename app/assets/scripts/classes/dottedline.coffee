class SPACE.DottedLine extends PIXI.Graphics
  time: 0

  constructor: (track)->
    super

    @from      = new PIXI.Point(0, 0)
    @to        = new PIXI.Point(600, 600)
    @track     = track
    @spaceship = @track.spaceship
    
    @lineStyle(SPACE.pixelRatio, 0xFFFFFF, 1)

    @isWaiting = false

  update: (delta)->
    if @track.spaceship.state == SPACESHIP.IN_LOOP    
      @time += delta
      d = @track.spaceship.duration / 100
      
      if @time >= d*.75 and !@isWaiting
        @from = new PIXI.Point(@spaceship.position.x, @spaceship.position.y)
        @isWaiting = true
      if @time >= d
        @time = 0
        @to = new PIXI.Point(@spaceship.position.x, @spaceship.position.y)
        @draw()
        @isWaiting = false

  draw: ->
    @beginFill(0xFFFFFF, .25)
    @moveTo(@from.x, @from.y)
    @lineTo(@to.x, @to.y)
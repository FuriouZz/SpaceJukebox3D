

HELPERS = HELPERS || {

  # Event
  trigger: (e, object)->
    e.object = object
    document.dispatchEvent(e)

  # Array
  shuffle: (array)->
    tmp
    curr = array.length
    while 0 != curr
      rand = Math.floor(Math.random() * curr)
      curr -= 1
      tmp         = array[curr]
      array[curr] = array[rand]
      array[rand] = tmp
    return array

  # Object
  merge: (options, overrides) ->
    @extend (@extend {}, options), overrides

  extend: (object, properties) ->
    for key, val of properties
      object[key] = val
    object

  # Math
  angleBetweenPoints: (first, second) ->
    height = second.y - first.y
    width  = second.x - first.x
    return Math.atan2(height, width)

  distance: (point1, point2) ->
    x = point1.x - point2.x
    y = point1.y - point2.y
    d = x * x + y * y
    return Math.sqrt(d)

  collision: (dot1, dot2)->
    r1 = if dot1.radius then dot1.radius else 0
    r2 = if dot2.radius then dot2.radius else 0
    dist = r1 + r2

    return @distance(dot1.position, dot2.position) <= Math.sqrt(dist * dist)

  map: (value, low1, high1, low2, high2) ->
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1)

  retina: (value)->
    if typeof value is 'object'
      object = value
      o = {}
      for key of object
        value = object[key]
        if typeof value is 'number'
          o[key] = value * SPACE.pixelRatio
      return @merge(object, o)
    else if typeof value is 'array'
      array = value
      a = []
      for value, key in array
        if typeof value is 'number'
          a.push(value * SPACE.pixelRatio)
        else
          a.push(value)
      return a
    else if typeof value is 'number'
      return value * SPACE.pixelRatio
    return false
    
}

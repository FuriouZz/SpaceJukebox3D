window.HELPER = window.HELPER ||
  events: {}

  trigger: (eventname, object)->
    # console.log eventname
    unless @events.hasOwnProperty(eventname)
      @events[eventname] = new Event(eventname)

    e = @events[eventname]
    e.object = object
    document.dispatchEvent(e)

  retina: (value)->
    if typeof value is 'object'
      object = value
      o = {}
      for key of object
        value = object[key]
        if typeof value is 'number'
          o[key] = value * window.devicePixelRatio
      return @merge(object, o)
    else if typeof value is 'array'
      array = value
      a = []
      for value, key in array
        if typeof value is 'number'
          a.push(value * window.devicePixelRatio)
        else
          a.push(value)
      return a
    else if typeof value is 'number'
      return value * window.devicePixelRatio
    return false

HELPER.Coffee =
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

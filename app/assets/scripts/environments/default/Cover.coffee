class SPACE.DEFAULT.Cover

  constructor: ->
    @_events()

  _events: ->
    document.addEventListener(TRACK.IS_PLAYING.type, @_eTrackIsPlaying)

  _eTrackIsPlaying: (e)->
    track    = e.object.track
    title    = track.data.title
    username = track.data.author
    user_url = track.data.author_url

    $('#cover h1').html(title)
    $('#cover h2').html('by <a href="'+user_url+'">'+username+'</a>')

    css = """
        a { color: """+track.data.color1+""" !important; }
        body { color: """+track.data.color2+""" !important; }
    """
    $('.cover-style').html(css)
    $('#wrapper').css('background-image', 'url(resources/covers/'+track.data.cover+')')


  update: ()->


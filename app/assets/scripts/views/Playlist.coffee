class Playlist

  constructor: ->
    @_events()

  _events: ->
    document.querySelector('#playlist .open').addEventListener('click', @_eOpen)
    document.querySelector('#playlist .close').addEventListener('click', @_eClose)

  _eOpen: ->
    $('#playlist').removeClass('hidden')

  _eClose: ->
    $('#playlist').addClass('hidden')

  setList: (list)->
    html = ""
    for item, i in list
      html += "<li data-url=\""+item.url+"\">"
      html += "<span class=\"number\">"+(i+1)+"</span>"
      html += "<span class=\"title\">"+item.title+"</span>"
      html += "<span class=\"duration\"></span>"
      html += "</li>"
    $('#playlist ul').html(html)

  setActive: (activeUrl)->
    console.log activeUrl
    $('#playlist li').removeClass('active')
    $('#playlist li[data-url="'+activeUrl+'"]').addClass('active')

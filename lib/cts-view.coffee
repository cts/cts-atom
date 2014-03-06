{View} = require 'atom'

module.exports =
class CtsView extends View
  @content: ->
    @div class: 'cts overlay from-top', =>
      @div "The Cts package is Alive! It's ALIVE!", class: "message"

  initialize: (serializeState) ->
    atom.workspaceView.command "cts:toggle", => @toggle()

  # Returns an object that can be retrieved when package is activated
  serialize: ->

  # Tear down any state and detach
  destroy: ->
    @detach()

  toggle: ->
    console.log "CtsView was toggled!"
    if @hasParent()
      @detach()
    else
      atom.workspaceView.append(this)

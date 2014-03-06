CtsView = require './cts-view'

module.exports =
  ctsView: null

  activate: (state) ->
    @ctsView = new CtsView(state.ctsViewState)

  deactivate: ->
    @ctsView.destroy()

  serialize: ->
    ctsViewState: @ctsView.serialize()

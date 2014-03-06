var AtomCTS;

module.exports = AtomCTS = (function(){

  function AtomCTS() {
  }

  AtomCTS.prototype.convert = function() {
    console.error("hi");
    var editor = atom.workspace.activePaneItem
    var selection = editor.getSelection()

    var figlet = require('figlet');
    var opts = {font: "Larry 3D 2"};
    var text = selection.getText();
    console.error(text);
    figlet(text, opts, function(err, asciiArt) {
      if (err) {
        console.error(err);
      } else {
        selection.insertText("\n" + asciiArt);
      }
    });
  };

  AtomCTS.prototype.destroy = function() {
  };

  return AtomCTS;

})();

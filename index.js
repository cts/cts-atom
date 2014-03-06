var AtomCTS = require('./lib/atom-cts.js');

module.exports = {
  configDefaults: {
  },
  activate: function(){
    var self = this;
    self.atomCTS = new AtomCTS();
    atom.workspaceView.command("cts:convert", function() {
      self.atomCTS.convert();
    });
    return self.atomCTS;
  },
  deactivate: function(){
    return this.atomCTS.destroy();
  }
};

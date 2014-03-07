var Subscriber, AtomCTS;
var cp = require('child_process');
var _ = require('underscore-plus');
var CTS_Worker = null;

var Subscriber = require('emissary').Subscriber;

module.exports = AtomCTS = (function(){

  CTS_Worker = cp.fork(__dirname + '/worker.js');
  process.on('exit', function() {
    CTS_Worker.kill();
  });
  var $ = require('atom').$;
  console.error("Hi");

  function AtomCTS() {
    atom.workspace.eachEditor((function(self) {
      return function(editor) {
        return self.handleEvents(editor);
      };
    })(this));
    this.config = {globals:{},options:{}};
    this.loadConfig();
  }

  Subscriber.includeInto(AtomCTS);

  AtomCTS.prototype.convert = function() {
    console.error("hi");
    var editor = atom.workspace.activePaneItem;
    var selection = editor.getSelection();

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

  AtomCTS.prototype.handleEvents = function(editor) {
    var buffer = editor.getBuffer();
    var listenFor = [];

    listenFor.push('cts-test');

    this.subscribe(atom.workspaceView,
      'pane-container:active-pane-item-changed', function() {
      this.run(editor);
    }.bind(this));
    this.subscribe(buffer, listenFor.join(' '), (function(self) {
      return _.debounce(function() {
        return buffer.transact(function() {
          self.run(editor);
        });
      },50);
    })(this));
    this.subscribe(buffer, 'destroyed', (function(self) {
      return function() {
        return self.unsubscribe(buffer);
      };
    })(this));
  };

  AtomCTS.prototype.run = function(editor){
    var self = this;
    var text = this.getContents();
    if( !text ) {
      this.resetState(editor);
      return;
    }

    var cb = function (jsHintErrors) {
      CTS_Worker.removeListener('message', cb);
      if(jsHintErrors.length === 0) {
        self.resetState(editor);
      }
      if( editor.cursors[0] ){
        self.updateStatus(jsHintErrors, editor.cursors[0].getBufferRow());
      }
      self.updatePane(jsHintErrors);
      self.subscribe(atom.workspaceView, 'cursor:moved', function () {
        if( editor.cursors[0] ){
          self.updateStatus(jsHintErrors, editor.cursors[0].getBufferRow());
        }
      });
    };
    CTS_Worker.on('message', cb);

    CTS_Worker.send({
      method: 'run',
      text:text,
      options: this.config.options,
      config: this.config.globals
    });
  };

  AtomCTS.prototype.updatePane = function(errors){
    $('#jshint-status-pane').remove();
    if( !errors || !atom.config.get('atom-jshint.showErrorPanel') ) return;
    var html = $('<div id="jshint-status-pane" class="atom-jshint-pane" style="height:">');
    errors.forEach(function(error){
      html.append('Line: ' + error.line + ' Char:' + error.character + ' ' + error.reason);
      html.append('<br/>');
    });
    atom.workspaceView.prependToBottom(html);
  };

  AtomCTS.prototype.resetState = function(editor){
    this.updatePane([]);
    atom.workspaceView.off('cursor:moved');
    this.unsubscribe(editor);
  };

  AtomCTS.prototype.getContents = function(){
    if( !atom.workspace.activePaneItem ) return false;
    var filename = atom.workspace.activePaneItem.getUri();
    if( !filename ) return false;
    if( filename.slice(-3) !== '.js' ) return false;
    var text = atom.workspace.activePaneItem.getText();
    if( !text ) return false;
    return text;
  };

  AtomCTS.prototype.destroy = function() {
  };

  AtomCTS.prototype.loadConfig = function() {
    // No op
  };

  AtomCTS.prototype.findBindings = function() {
    // Use editor.getText()
    // Make Buffer ranges like pane.getSelectedBufferRange
    // then setTextIbBufferRange(range, text) to set.
    // must update range with new length.
    //Command option I debug console
  };

  return AtomCTS;

})();

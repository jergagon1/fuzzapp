Selectize.define('hidden_textfield', function (options) {
  var self = this;

  this.setup_original = this.setup;
  this.hideInput_original = this.hideInput;
  this.showInput_original = this.showInput;

  this.plHolder = $('<span>' + this.settings.placeholder + '</span>');

  this.opts = {opacity: 0, position: 'absolute', left: self.rtl ? 10000 : -10000};

  this.setup = function () {
    self.setup_original();
    this.$control_input.prop("disabled", "disabled");
    this.$control_input.css(self.opts)
    this.$control.append(self.plHolder);
  };

  this.hideInput = function () {
    self.hideInput_original();
    self.plHolder.css(self.opts)
  };

  this.showInput = function () {
    this.showInput_original();
    this.$control_input.css(self.opts)
  }
});
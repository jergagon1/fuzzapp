Selectize.define('hidden_textfield', function (options) {
  var self = this;

  this.setup_original = this.setup;

  this.setup = function () {
    self.setup_original();
    this.$control_input.prop("disabled", "disabled");
  }
});
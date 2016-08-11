var Template = {
  _templates: {},
  register: function (key, template) {
    template = template.trim();
    this._templates[key] = Handlebars.compile(template)
  },
  render: function (key, data) {
    var template = this._templates[key];

    if (data) {
      return this.toHTML(template(data));
    } else {
      return template;
    }
  },
  toHTML: function (string) {
    string = string.trim();
    var div = document.createElement('div');
    div.innerHTML = string;
    return div.childNodes[0];
  }
}
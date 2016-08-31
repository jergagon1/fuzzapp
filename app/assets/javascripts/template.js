var Template = {
  _templates: {},
  register: function (key, template) {
    var tmpl = document.querySelector(template);
    if (!tmpl) {
      tmpl = document.createElement('div');
    }

    template = tmpl.innerHTML.trim();
    this._templates[key.toLowerCase()] = Handlebars.compile(template)
  },
  render: function (key, data) {
    var template = this._templates[key.toLowerCase()];

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
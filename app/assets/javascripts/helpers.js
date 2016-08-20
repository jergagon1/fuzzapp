var Helpers = {
  getTitleReport: function (report) {
    var type = this.getAnimalTypeReport(report);
    var str = report.report_type + ' ' + type;
    if (report.pet_name) {
      str += ' ' + report.pet_name;
    }
    return this.camelize(str);
  },
  getAnimalTypeReport: function (report) {
    var type = report.animal_type.toLowerCase().replace(/(\s+)/gm, ' ');
    if (!type || type === 'pet type') {
      type = 'pet'
    }
    return type;
  },
  camelize: function (str) {
    return str.replace(/(^[a-z])/, function (p) {
      return p.toUpperCase();
    })
  }
};
Template.register('reportsItemTemplate', document.querySelector('#reports-item-template').innerHTML);

function ReportItem(report) {
  this.report = report;

  this._$el = Template.render('reportsItemTemplate', this.serialize());
}

ReportItem.prototype.last_seen = function () {
  return this.report.last_seen && moment(this.report.last_seen).format('DD MMM HH:mm');
};

ReportItem.prototype.serialize = function () {
  var data = this.report;
  data.last_seen = this.last_seen();
  return data;
};

ReportItem.prototype.getRoute = function () {
  return 'report/' + this.report.id
};

ReportItem.prototype.hasPosition = function () {
  return this.report.lat && this.report.lng;
};

ReportItem.prototype.getPosition = function () {
  return {
    lat: this.report.lat,
    lng: this.report.lng
  }
};

ReportItem.prototype.getIcon = function () {
  return this.report.report_type === 'found' ? '/img/app/map/found-pin.png' : '/img/app/map/lost-pin.png';
}
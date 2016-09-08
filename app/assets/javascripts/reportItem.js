//= require helpers
Template.register('reportsItemTemplate', '#reports-item-template');

function ReportItem(report) {
  this.report = report;

  this._$el = Template.render('reportsItemTemplate', this.serialize());
}

ReportItem.prototype.last_seen = function () {
  return this.report.last_seen && moment(this.report.last_seen).format('DD MMM HH:mm A');
};

ReportItem.prototype.getLastSeenAgo = function () {
  if (this.report.last_seen) {
    var diff = moment().diff(this.report.last_seen, 'minutes');

    if (diff < 60) {
      return moment.duration(diff, 'minutes').humanize() + ' ago';
    } else if (diff < 60 * 24) {
      return moment.duration(diff, 'minutes').humanize() + ' ago';
    } else {
      return moment(this.report.last_seen).format('DD MMM HH:mm A');
    }
  }
};

ReportItem.prototype.serialize = function () {
  var data = this.report;
  data.last_seen = this.getLastSeenAgo();
  data.title = this.getTitle();
  data.image = this.getImage();
  return data;
};

ReportItem.prototype.getTitle = function () {
  return Helpers.getTitleReport(this.report);
};

ReportItem.prototype.getRoute = function () {
  return 'fuzzapp/report/' + this.report.id
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
};

ReportItem.prototype.getImage = function () {
  if (this.report.image) {
    return this.report.image;
  } else {
    switch (Helpers.getAnimalTypeReport(this.report)) {
      case 'dog':
      case 'pet':
      default:
        return '/img/app/dog.png';
      case 'cat':
        return '/img/app/cat.png';
      case 'bird':
        return '/img/app/bird.png'
    }
  }
};

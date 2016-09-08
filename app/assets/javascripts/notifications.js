Pusher.logToConsole = true;

Template.register('notificationTemplate', '#notification-template');

var Notification = {
  _container: document.querySelector('.notifications'),
  _timeout: null,
  showReport: function (report) {
    var self = this;
    var deferred = $.Deferred();
    var $el = Template.render('notificationTemplate', report);
    self.showNotification($el)
      .then(function () {
        deferred.resolve(report);
      }, function () {
        deferred.reject();
      });

    deferred.always(function () {
      self.removeNotification($el);
    });

    return deferred.promise();
  },
  removeNotification: function ($el) {
    var $container = this._container;
    var self = this;
    $el.classList.remove('show');
    setTimeout(function () {
      if ($container.contains($el)) {
        $container.removeChild($el);
      }
      clearTimeout(self._timeout);
    }, 200);
  },
  showNotification: function ($el) {

    var deferred = $.Deferred();

    $el.addEventListener('click', deferred.resolve, false);

    $el.querySelector('.Notification__alert-close').addEventListener('click', function (e) {
      e.preventDefault();
      deferred.reject();
      return false;
    }, false);

    this._timeout = setTimeout(deferred.reject, 7 * 1000);

    var $container = this._container;
    $container.appendChild($el);
    $el.classList.add('show');

    return deferred;
  }
};


document.addEventListener('DOMContentLoaded', function () {
  var pusher = new Pusher(window.fuzzfinders.pusherKey, {
    encrypted: true
  });

  var channel = pusher.subscribe(window.fuzzfinders.pusherChannel);
  channel.bind('report_created', function (data) {
    Notification.showReport(data.report).then(function (report) {
      Router.navigate('fuzzapp/report/' + report.id);
    });
  });
}, false);

Pusher.logToConsole = true;

var pusher = new Pusher(window.fuzzfinders.pusherKey, {
  cluster: 'eu',
  encrypted: true
});

var channel = pusher.subscribe(window.fuzzfinders.pusherChannel);
channel.bind('report_created', function(data) {
  console.log(data.report);
});

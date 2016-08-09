Pusher.logToConsole = true;

var pusher = new Pusher(window.fuzzfinders.pusherKey, {
  // cluster: 'mt1',
  encrypted: true
});

var channel = pusher.subscribe(window.fuzzfinders.pusherChannel);
channel.bind('report_created', function(data) {
  console.log(data);
});

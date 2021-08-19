importScripts('https://www.gstatic.com/firebasejs/7.6.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.6.1/firebase-messaging.js');

// TODO: move this to env config somehow
firebase.initializeApp({
  projectId: "rog-2-0",
  apiKey: "AIzaSyCY1oTVrozQfDrCG1k-b3Q4Iw5iWSF_LIM",
  appId: "1:153344187169:web:64dd90de0f9831cc643c60",
  messagingSenderId: "153344187169"
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  const title = (payload.data.trigger_type + ' by ' + payload.data.camera_name);
  const options = {
    body: payload.data.camera_groups_name,
    data: payload.data,
    icon: '/logo192x192.png',
    image: payload.data.alert_image_url_with_token
  }

  let url = payload.data.web_client_url;
  clients.matchAll({includeUncontrolled: false, type: 'window'}).then( windowClients => {
    // Check if there is already a window/tab open with the target URL
    for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url.includes(url) && 'focus' in client) {
          client.postMessage({
            msg: "fetchAlerts"
          });
          return self.registration.showNotification(title, options);
        }
    }
  })
});

self.addEventListener('notificationclick', function(event) {
  let url = event.notification.data.web_client_url;
  event.notification.close(); // Android needs explicit close.
  event.waitUntil(
      clients.matchAll({includeUncontrolled: false, type: 'window'}).then( windowClients => {
          // Check if there is already a window/tab open with the target URL
          for (var i = 0; i < windowClients.length; i++) {
              var client = windowClients[i];
              // If so, just focus it.
              if (client.url.includes(url) && 'focus' in client) {
                return client.navigate(url + '/#/alerts').then(client => client.focus());
              }
          }
          // If not, then open the target URL in a new window/tab.
          if (clients.openWindow) {
              return clients.openWindow(url);
          }
      })
    );
});

self.addEventListener('install', function (event) {
  return self.skipWaiting();
})

self.addEventListener('activate', function (event) {
  return self.clients.claim();
})

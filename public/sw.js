self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    vibrate: [200, 100, 200],
    data: data.data,
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'Otevřít',
        icon: '/Logo.png'
      },
      {
        action: 'close',
        title: 'Zavřít',
        icon: '/Logo.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(event.notification.data?.url || '/program')
    );
  }
});

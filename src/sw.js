/* eslint-disable */
import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';

// This is the code piece that GenerateSW mode can't provide for us.
// This code listens for the user's confirmation to update the app.
self.addEventListener('message', (e) => {
  if (!e.data) {
    return;
  }

  switch (e.data) {
    case 'skipWaiting':
      self.skipWaiting();
      break;
    default:
      // NOOP
      break;
  }
});

clientsClaim();

// The precaching code provided by Workbox.
// This is the placeholder that will be replaced with the precache manifest
self.__WB_MANIFEST;

// Precache and route all the assets
precacheAndRoute(self.__WB_MANIFEST);

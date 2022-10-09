const {registerRoute} = require('workbox-routing');
const {ExpirationPlugin} = require('workbox-expiration');
const {CacheFirst, StaleWhileRevalidate} = require('workbox-strategies');
const {warmStrategyCache} = require('workbox-recipes');
const {CacheableResponsePlugin} = require('workbox-cacheable-response');
const {precacheAndRoute} = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
  }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
  }),
  ],
});

registerRoute(({request}) => request.mode === 'navigate', pageCache);
registerRoute(
  ({request}) => ['style', 'script', 'worker'].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: 'asset-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
    }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
    ]
})
);

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

// Change this to your repository name
var GHPATH = '/lacto-calculator';
 
// Choose a different app prefix name
var APP_PREFIX = 'lc_';
 
// The version of the cache. Every time you change any of the files
// you need to change this version (version_01, version_02…). 
// If you don't change the version, the service worker will give your
// users the old files!
var VERSION = 'version_18';
 
// The files to make available for offline use. make sure to add 
// others to this list
var URLS = [    
  `${GHPATH}/`,
  `${GHPATH}/index.html`,
  `${GHPATH}/_astro/iconfont/*.*`,
  `${GHPATH}/_astro/css/*.css`,
  `${GHPATH}/_astro/js/*.js`,
]
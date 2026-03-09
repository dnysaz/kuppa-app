/**
 * routes/api.js
 */
const kuppa = require('./Config');
const route = kuppa.createRouter();
const api   = kuppa.controllers.api;
const mw    = kuppa.middleware;

// 1. Grup rute yang butuh Auth
route.group([mw.apiAuth], (route) => {

    // route.get('/endpoint',[api.test, 'index']).name('endpoint');

});


module.exports = route;
// import polyfills
import 'core-js/es7/array'; // due of considerDataAria and svg methods wchih using Array.includes in snabbdom-pragma

import { setup, run } from '@cycle/run';
import { restartable, rerunner } from 'cycle-restart';
import { makeDOMDriver } from '@cycle/dom';
import { makeHTTPDriver } from '@cycle/http';
import { timeDriver } from '@cycle/time';
import isolate from '@cycle/isolate';
import onionify from 'cycle-onionify';

import { Component } from './interfaces';
import { App } from './app';

import { routerify } from 'cyclic-router';
import { makeHistoryDriver } from '@cycle/history';
import switchPath from 'switch-path';

const main: Component = onionify(App);

let drivers: any, driverFn: any;
/// #if PRODUCTION
drivers = {
    DOM: makeDOMDriver('#app'),
    HTTP: makeHTTPDriver(),
    Time: timeDriver,
    history: makeHistoryDriver()
};
/// #else
driverFn = () => ({
    DOM: restartable(makeDOMDriver('#app'), {
        pauseSinksWhileReplaying: false
    }),
    HTTP: restartable(makeHTTPDriver()),
    Time: timeDriver,
    history: makeHistoryDriver()
});
/// #endif
export const driverNames: string[] = Object.keys(drivers || driverFn());

const mainWithRouting = routerify(main, switchPath);

/// #if PRODUCTION
run(mainWithRouting as any, drivers);
/// #else
const rerun = rerunner(setup, driverFn, isolate);
rerun(mainWithRouting as any);

if (module.hot) {
    module.hot.accept('./app', () => {
        const newApp = require('./app').App;

        rerun(routerify(onionify(newApp), switchPath));
    });
}
/// #endif

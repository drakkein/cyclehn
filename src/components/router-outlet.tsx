import xs from 'xstream';

import { Test } from './test.component';

import { AppSinks, AppSources } from '../interfaces';
import { ListComponent } from './list.component';

export function RouterOutlet(sources: AppSources): AppSinks {
    const routes = {
        '/': ListComponent,
        '/news/:page': (page: string) => (srcs: AppSources) => ListComponent({props$: xs.of({page, max: 10, list: 'news'}),  ...srcs}),
        '/newest' : (srcs: AppSources) => { console.log('trorlololol');return ListComponent({props$: xs.of({page: 1, max: 12, list: 'newest'}),  ...srcs}); },
        '/newest/:page': (page: string) => (srcs: AppSources) => ListComponent({props$: xs.of({page, max: 12, list: 'newest'}),  ...srcs}),
        '/ask/:page': (page: string) => (srcs: AppSources) => ListComponent({props$: xs.of({page, max: 3, list: 'ask'}),  ...srcs}),
        '/show/:page': (page: string) => (srcs: AppSources) => ListComponent({props$: xs.of({page, max: 2, list: 'show'}),  ...srcs}),
        '/jobs/:page': (page: string) => (srcs: AppSources) => ListComponent({props$: xs.of({page, max: 1, list: 'jobs'}),  ...srcs})
    };
    const match$ = sources.router.define(routes);

    const page$ = match$.map(({ path, value }: any) => {
        return value({
            ...sources,
            router: sources.router.path(path)
        });
    });

// naive filtering
    const navigation$ = sources.DOM.select('a[href^="/"]:not([disabled]')
        .events('click')
        .debug((e: MouseEvent) => e.preventDefault())
        .map((e: MouseEvent) => (e.currentTarget as HTMLAnchorElement).pathname);

    return {
        DOM: page$.map((c: AppSinks) => c.DOM).flatten(),
        onion: page$.map((c: AppSinks) => c.onion).flatten(),
        HTTP: page$.map((c: AppSinks) => c.HTTP).flatten(),
        router: navigation$
    };
}

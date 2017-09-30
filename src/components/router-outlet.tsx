import xs, { Stream } from 'xstream';

import { AppSinks, AppSources } from '../interfaces';
import { ListComponent } from './list.component';
import { ItemComponent } from './item.component';
import { UserComponent } from './user.component';

export function RouterOutlet(sources: AppSources): AppSinks {
    const routes = {
        '/': ListComponent,
        '/news': (srcs: AppSources) => redirect('news/1'),
        '/news/:page': (page: string) => (srcs: AppSources) => ListComponent({ props$: xs.of({ page, max: 10, list: 'news' }), ...srcs }),
        '/newest': (srcs: AppSources) => redirect('newest/1'),
        '/newest/:page': (page: string) => (srcs: AppSources) => ListComponent({ props$: xs.of({ page, max: 12, list: 'newest' }), ...srcs }),
        '/ask': (srcs: AppSources) => redirect('ask/1'),
        '/ask/:page': (page: string) => (srcs: AppSources) => ListComponent({ props$: xs.of({ page, max: 3, list: 'ask' }), ...srcs }),
        '/show': (srcs: AppSources) => redirect('show/1'),
        '/show/:page': (page: string) => (srcs: AppSources) => ListComponent({ props$: xs.of({ page, max: 2, list: 'show' }), ...srcs }),
        '/jobs': (srcs: AppSources) => redirect('jobs/1'),
        '/jobs/:page': (page: string) => (srcs: AppSources) => ListComponent({ props$: xs.of({ page, max: 1, list: 'jobs' }), ...srcs }),
        '/item/:id': (id: string) => (srcs: AppSources) => ItemComponent({ props$: xs.of({ id, max: 1, list: 'jobs' }), ...srcs }),
        '/user/:name': (name: string) => (srcs: AppSources) => UserComponent({ props$: xs.of({ name }), ...srcs })
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
        .map((e: MouseEvent) => {
            // as always in IE currentTarget points to whole first parent div
            const pathname = (e.currentTarget as HTMLAnchorElement).pathname || (e.target as HTMLAnchorElement).pathname;
            // would be to easy if IE would work with strings instead of PushHistoryInput
            return {
                type: 'push',
                pathname
            };
        });

    /*
    Every sink is returned as correct stream or empty stream in case when component is not operating on this streams
     */
    return {
        DOM: page$.map((c: AppSinks) => c.DOM || xs.empty()).flatten(),
        onion: page$.map((c: AppSinks) => c.onion || xs.empty()).flatten(),
        HTTP: page$.map((c: AppSinks) => c.HTTP || xs.empty()).flatten(),
        // This is kind a way to handle redirection to first page in case of missing page param in routing
        router: page$.map((c: AppSinks) => c.router ? xs.merge(navigation$, c.router) : navigation$).flatten()
    };
}

function redirect(path: string): { router: Stream<string> } {
    return { router: xs.of(path) };
}
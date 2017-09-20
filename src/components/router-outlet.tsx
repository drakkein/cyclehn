import { Home } from './home.component';
import { Test } from './test.component';

import { AppSinks, AppSources } from '../interfaces';
import xs from 'xstream';
import isolate from '@cycle/isolate';

export function RouterOutlet(sources: AppSources): AppSinks {
    const routes = {
        '/': Home,
        '/test': Test
    };
    const match$ = sources.router.define(routes);

    const page$ = match$.map(({ path, value }: any) => {
        return value({
            ...sources,
            router: sources.router.path(path) // notice use of 'router' source name,
                                              // which proxies raw 'history' source with
                                              // additional functionality
        });

    });

// naive filtering
    const navigation$ = sources.DOM.select('a[href^="/"]')
        .events('click')
        .debug((e: MouseEvent) => e.preventDefault())
        .map((e: MouseEvent) => (e.currentTarget as HTMLAnchorElement).pathname);

    return {
        DOM: page$.map((c: AppSinks) => c.DOM).flatten(),
        onion: page$.map((c: AppSinks) => c.onion).flatten(),
        router: navigation$
    };
}

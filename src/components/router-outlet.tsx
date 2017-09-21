import xs from 'xstream';

import { Test } from './test.component';

import { AppSinks, AppSources } from '../interfaces';
import { ListComponent } from './list.component';

export function RouterOutlet(sources: AppSources): AppSinks {
    const routes = {
        '/': ListComponent,
        '/test': Test,
        '/news/:page': (page: string) => (srcs: AppSources) => ListComponent({props$: xs.of({page}),  ...srcs})
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

import xs, { Stream } from 'xstream';
import { VNode, DOMSource } from '@cycle/dom';

import { AppSources, AppState, Reducer, AppSinks } from '../interfaces';

export function NavbarComponent(sources: AppSources): AppSinks {
    const action$ = intent(sources.DOM);
    return {
        DOM: view(sources.router.history$, sources.onion.state$),
        onion: action$
    };
}

export function intent(DOM: DOMSource): Stream<Reducer> {
    const init$: Stream<Reducer> = xs.of<Reducer>(state => ({ ...state, hamburgerActive: false }));

    const hamburgerMenu$ = DOM
        .select('.navbar-burger')
        .events('click')
        .mapTo<Reducer>(state => ({ ...state, hamburgerActive: !state.hamburgerActive }));

    return xs.merge(init$, hamburgerMenu$);
}

export function view(active$: Stream<any>, state$: Stream<AppState>): Stream<VNode> {
    return xs.combine(active$, state$)
        .map(([a, menuActive]) => <div className="navbar is-primary" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <a className="navbar-item" href="https://cycle.js.org">
                        <img src="/public/cyclejs_logo.svg"
                             alt="Cycle.js PWA HackerNews reader" width="112" height="28" />
                    </a>
                    <div className={`navbar-burger burger ${menuActive.hamburgerActive ? 'is-active' : ''}`}
                         data-target="navMenu">
                        <span/>
                        <span/>
                        <span/>
                    </div>
                </div>
                <div id="navMenu" className={`navbar-menu ${menuActive.hamburgerActive ? 'is-active' : ''}`}>
                    <div className="navbar-start">
                        <a className={`navbar-item ${isActive(a.pathname, ['/$', '/news/\\d'])}`} href="/">
                            News
                        </a>
                        <a className={`navbar-item ${isActive(a.pathname, ['/newest/\\d'])}`} href="/newest/1">
                            Newest
                        </a>
                        <a className={`navbar-item ${isActive(a.pathname, ['/ask/\\d'])}`} href="/ask/1">
                            Ask
                        </a>
                        <a className={`navbar-item ${isActive(a.pathname, ['/show/\\d'])}`} href="/show/1">
                            Show
                        </a>
                        <a className={`navbar-item ${isActive(a.pathname, ['/jobs/\\d'])}`} href="/jobs/1">
                            Jobs
                        </a>
                    </div>
                </div>
            </div>
        );
}

function isActive(activated: string, path: string | string[]): string {
    if (typeof path !== 'string') {
        if (path.some(v => !!activated.match(RegExp(v)))) {
            return 'is-active';
        } else {
            return '';
        }
    }

    if (activated === path ) {
        return 'is-active';
    } else {
        return '';
    }
}
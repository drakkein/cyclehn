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
                    <a className="navbar-item" href="http://bulma.io">
                        <img src="http://bulma.io/images/bulma-logo.png"
                             alt="Bulma: a modern CSS framework based on Flexbox" width="112" height="28"/>
                    </a>
                    <div className={`navbar-burger burger ${menuActive.hamburgerActive ? 'is-active' : ''}`} data-target="navMenu">
                        <span/>
                        <span/>
                        <span/>
                    </div>
                </div>
                <div id="navMenu" className={`navbar-menu ${menuActive.hamburgerActive ? 'is-active' : ''}`}>
                    <div className="navbar-start">
                        <a className="navbar-item " href="/">
                            <span className="bd-emoji">⭐</span>
                            Home
                        </a>
                        <a className="navbar-item " href="/test">
                            <span className="bd-emoji">⭐</span>
                            Test {a}
                        </a>
                    </div>
                </div>
            </div>
        );
}
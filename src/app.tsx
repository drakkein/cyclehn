import xs, { Stream } from 'xstream';
import { VNode, div } from '@cycle/dom';

import { AppSinks, AppSources, Reducer } from './interfaces';
import { RouterOutlet } from './components/router-outlet';
import { NavbarComponent } from './components/navbar.component';

export function App(sources: AppSources): AppSinks {
    const routerSinks = RouterOutlet(sources);
    const navbarSinks = NavbarComponent(sources);

    const reducer$: Stream<Reducer> = xs.merge(routerSinks.onion, navbarSinks.onion);

    const routerDOM = routerSinks!.DOM as Stream<VNode>;
    const navbarDOM = navbarSinks.DOM as Stream<VNode>;

    const vdom$: Stream<VNode> = view(routerDOM, navbarDOM);

    return {
        DOM: vdom$,
        onion: reducer$,
        HTTP: routerSinks.HTTP,
        router: routerSinks.router
    };
}

function view(routerVDom$: Stream<VNode>, navbarVNode$: Stream<VNode>): Stream<VNode> {
    return xs.combine(routerVDom$, navbarVNode$).map(([routerVDOM, navbarVNode]) => {
        return div('.app', [
            navbarVNode,
            div('.container', [
                routerVDOM
            ])
        ]);
    });
}
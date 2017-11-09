import { Sources } from '../interfaces';

import xs, { Stream } from 'xstream';
import { DOMSource, VNode } from '@cycle/dom';
import { StateSource } from 'cycle-onionify';

type AppSources = Sources & { onion: StateSource<AppState> };
type Reducer = (prev: AppState) => AppState;
type AppState = {
    count: number;
};

export function Home(sources: AppSources): any {
    const action$: Stream<Reducer> = intent(sources.DOM);
    const vdom$: Stream<VNode> = view(sources.onion.state$);

    return {
        DOM: vdom$,
        onion: action$
    };
}

function intent(DOM: DOMSource): Stream<Reducer> {
    const init$: Stream<Reducer> = xs.of<Reducer>(() => ({ count: 0 }));

    const add$: Stream<Reducer> = DOM.select('.add')
        .events('click')
        .mapTo<Reducer>(state => ({ ...state, count: state.count + 1 }));

    const subtract$: Stream<Reducer> = DOM.select('.subtract')
        .events('click')
        .mapTo<Reducer>(state => ({ ...state, count: state.count - 1 }));

    return xs.merge(init$, add$, subtract$);
}

function view(state$: Stream<AppState>): Stream<VNode> {
    return state$.map(s => s.count).map(count =>
        <div>
            { count }
            <button className="add button">Add</button>
        </div>
    );
}
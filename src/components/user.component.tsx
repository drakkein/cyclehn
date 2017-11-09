import xs, { Stream } from 'xstream';
import { VNode } from '@cycle/dom';

import { AppSources, AppSinks, AppState, Reducer, User } from '../interfaces';
import { LoaderComponent } from './loader.component';
import { API_USER } from '../config';

export function UserComponent(sources: AppSources): AppSinks {
    const vdom$ = sources.onion.state$
        .map(s => s.user)
        .map(u => u ? view(u) : LoaderComponent());

    const action$ = intent(sources);

    const http$ = sources.props$!
        .map((props: { name: string }) => ({
            url: API_USER(props.name),
            category: 'user'
        }));

    return {
        DOM: vdom$,
        onion: action$,
        HTTP: http$
    };
}

export function intent({ HTTP }: AppSources): Stream<Reducer> {
    const init$: Stream<Reducer> = xs.of<Reducer>(state => ({ ...state, user: undefined }));

    const user$ = HTTP.select('user')
        .flatten()
        .map(res => res.body)
        .map(res => (state: AppState) => ({ ...state, user: res } as AppState));

    return xs.merge(init$, user$);
}

function view(user: User): VNode {
    return (
        <div className="app-container">
            <section className="hero is-primary">
                <div className="hero-body">
                    <div className="container">
                        <h1 className="title">
                            {user.id}
                        </h1>
                        <span className="meta">
                            Karma: {user.karma} |
                            Created: {user.created}
                        </span>
                    </div>
                </div>
            </section>
            <div className="box  is-radiusless" innerHTML={user.about}>
            </div>
        </div>
    );
}
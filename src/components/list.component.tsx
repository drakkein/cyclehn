import xs, { Stream } from 'xstream';
import { a } from '@cycle/dom';

import { AppSources, AppSinks, AppState, Reducer } from '../interfaces';
import { VNode } from '@cycle/dom';

import { listItemComponent } from './list-item.component';

const maxPages = 10;

export function ListComponent(sources: AppSources): AppSinks {
    const props$ = sources.props$ || xs.of({ page: 1 });
    const vdom$ = view(sources.onion.state$, props$);
    const action$ = intent(sources);

    const http$ = props$
        .map((query: any) => ({
            url: 'https://hnpwa.com/api/v0/news.json',
            category: 'news',
            query: query
        }));

    return {
        DOM: vdom$,
        onion: action$,
        HTTP: http$
    };
}

export function intent({ DOM, HTTP }: AppSources): Stream<Reducer> {
    const init$: Stream<Reducer> = xs.of<Reducer>(state => ({ ...state, list: Array(30).fill('skeleton') }));

    const news$ = HTTP.select('news')
        .flatten()
        .map(res => res.body)
        .map(res => (state: AppState) => ({ ...state, list: res } as AppState));

    return xs.merge(init$, news$);
}

export function view(state$: Stream<AppState>, props$: Stream<any>): Stream<VNode> {
    return xs.combine(state$.map(state => state.list), props$)
        .map(([list, props]) => {
            const items = list
                .map((item, index) => listItemComponent(item));

            const pagination = {
                previous: Number(props.page) - 1,
                actual: props.page,
                next: Number(props.page) + 1
            };
            return <div className="box is-radiusless">
                {items}
                <nav className="pagination is-centered" role="navigation" aria-label="pagination">
                    <a href={`/news/${pagination.previous}`}
                       className={`pagination-previous ${pagination.previous <= 0 ? 'pagination-disabled' : ''}`}>Previous</a>
                    <a href={`/news/${pagination.next}`}
                       className={`pagination-next ${pagination.next > maxPages ? 'pagination-disabled' : ''}`}>Next
                        page</a>
                    <span className="pagination-indicator">Page {pagination.actual}</span>
                </nav>
            </div>;
        });
}
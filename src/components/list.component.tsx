import xs, { Stream } from 'xstream';
import { VNode } from '@cycle/dom';

import { AppSources, AppSinks, AppState, Reducer } from '../interfaces';
import { listItemComponent } from './list-item.component';
import { API_NEWS } from '../config';

export function ListComponent(sources: AppSources): AppSinks {
    const props$ = sources.props$ || xs.of({ page: 1, list: 'news', max: 10 });

    const vdom$ = view(sources.onion.state$, props$);
    const action$ = intent(sources);

    const http$ = props$
        .map((props: any) => ({
            url: API_NEWS(props.list),
            category: 'news',
            query: { page: props.page }
        }));

    return {
        DOM: vdom$,
        onion: action$,
        HTTP: http$
    };
}

export function intent({ HTTP }: AppSources): Stream<Reducer> {
    const skeletonList = Array.apply(0, { length: 30 }).map(() => 'skeleton');
    const init$: Stream<Reducer> = xs.of<Reducer>(state => ({ ...state, list: skeletonList }));

    const news$ = HTTP.select('news')
        .flatten()
        .map(res => res.body)
        .map(res => (state: AppState) => ({ ...state, list: res } as AppState));

    return xs.merge(init$, news$);
}

export function view(state$: Stream<AppState>, props$: Stream<any>): Stream<VNode> {
    return xs.combine(state$.map(state => state.list), props$)
        .map(([list, props]) => {
            const items = list ? list
                .map((item, index) => listItemComponent(item)) : [];

            const pagination = {
                previous: Number(props.page) - 1,
                actual: props.page,
                next: Number(props.page) + 1,
                max: Number(props.max)
            };
            return <div className="box is-radiusless">
                {items}
                <nav className="pagination is-centered" role="navigation" aria-label="pagination">
                    <a href={`/${props.list}/${pagination.previous}`}
                       className={`pagination-previous ${pagination.previous <= 0 ? 'pagination-disabled' : ''}`}>Previous</a>
                    <a href={`/${props.list}/${pagination.next}`}
                       className={`pagination-next ${pagination.next > pagination.max ? 'pagination-disabled' : ''}`}>Next
                        page</a>
                    <span className="pagination-indicator">Page {pagination.actual}</span>
                </nav>
            </div>;
        });
}
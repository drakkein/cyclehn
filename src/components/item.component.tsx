import { VNode } from '@cycle/dom';
import xs, { Stream } from 'xstream';

import { AppSinks, AppSources, AppState, Item, Reducer } from '../interfaces';
import { CommentComponent } from './comment.component';
import { LoaderComponent } from './loader.component';

export function ItemComponent(sources: AppSources): AppSinks {
    const action$ = intent(sources);
    const vdom$ = view(sources.onion.state$);
    const props$ = sources.props$ || xs.empty();

    const http$ = props$
        .map((props: any) => ({
            url: `https://hnpwa.com/api/v0/item/${props.id}.json`,
            category: 'item'
        }));

    return {
        DOM: vdom$,
        onion: action$,
        HTTP: http$
    };
}

function intent({ HTTP }: AppSources): Stream<Reducer> {
    const init$: Stream<Reducer> = xs.of<Reducer>(state => ({ ...state, item: undefined }));

    const item$ = HTTP.select('item')
        .flatten()
        .map(res => res.body)
        .map(res => (state: AppState) => ({ ...state, item: res } as AppState));

    return xs.merge(item$, init$);
}

function view(state$: Stream<AppState>): Stream<VNode> {
    return state$
        .map(state => state.item)
        .map((item: Item) => {
            if (!item) {
                return LoaderComponent();
            }

            const comments = item.comments
                .map(comment => CommentComponent(comment));

            const metaString = !!item.title ? <span>
                {item.points} Points | Posted by <a href={`/user/${item.user}`}>{item.user || 'job'}</a></span> : '';

            return <div className="app-container">
                <section className="hero is-primary">
                    <div className="hero-body">
                        <div className="container">
                            <h1 className="title">
                                <a href={item.url}>{item.title} <span
                                    className="has-text-grey-lighter">({item.domain})</span></a>
                            </h1>
                            <span className="meta">
                                {metaString}
                            </span>
                        </div>
                    </div>
                </section>
                <div className="box is-radiusless">
                    <div className="comments">
                        <h3>Comments ({item.comments_count})</h3>
                        {comments}
                    </div>
                </div>
            </div>;
        });
}
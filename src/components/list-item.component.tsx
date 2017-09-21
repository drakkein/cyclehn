import { FeedItem } from '../interfaces';

import { VNode } from '@cycle/dom';

export function listItemComponent(props: FeedItem): any {
    return view(props);
}

function view(props: FeedItem): VNode {
    return <article className="media">
        <div className="media-left">
            <span className="has-text-info points is-size-4">
                {props.points || '-'}
            </span>
        </div>
        <div className="media-content">
            <div className="content">
                <a href={props.url}>
                    <span className="is-pulled-right has-text-grey">{props.time_ago}</span>
                    <h5>{props.title} <span className="has-text-grey-light">({props.domain || '-'})</span></h5>
                </a>
            </div>
            <div className="meta is-size-7">
                Posted by <a href={`/user/${props.user}`}>{props.user || '-'}</a>
                | <a className="has-text-dark has-text-underlined" href={`/item/${props.id}`}>{props.comments_count} comments</a>
            </div>
        </div>
    </article>;
}
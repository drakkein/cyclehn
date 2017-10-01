import { FeedItem } from '../interfaces';

import { VNode } from '@cycle/dom';

export function listItemComponent(props: FeedItem): any {
    return view(props);
}

function view(props: FeedItem | 'skeleton'): VNode {
    const item = props as FeedItem;
    const domainString = !!item.domain ? <span className="has-text-grey-light">({item.domain})</span> : '';
    const postedBy = item.user ? <a href={`user/${item.user}`}>{item.user}</a> : <span className="has-text-primary">job</span>;
    const metaString = !!item.title ? <span>
                Posted by {postedBy} | <a
        className="has-text-dark has-text-underlined" href={`/item/${item.id}`}>{item.comments_count} comments</a>
                </span> : '';

    return <article className={`media ${props === 'skeleton' ? 'skeleton' : 'app-container'}`}>
        <div data-skeletonprimary className="media-left">
            <span className="has-text-info points is-size-4">
                {item.points}{!item.points && item.title ? <span className="bd-emoji">📢</span> : ''}
            </span>
        </div>
        <div className="media-content">
            <div className="content">
                <a href={item.url}>
                    <span className="is-pulled-right has-text-grey time">{item.time_ago}</span>
                    <h5 data-skeleton>{item.title} {domainString}</h5>
                </a>
            </div>
            <div data-skeleton className="meta is-size-7">
                {metaString}
            </div>
        </div>
    </article>;
}
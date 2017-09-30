import { VNode } from '@cycle/dom';

import { Item } from '../interfaces';

export function CommentComponent(comment: Item): VNode {
    const comments = comment.comments
        .map(innerComment => CommentComponent(innerComment));
    return <article className="media comment">
        <div className="media-content">
            <div className="content">
                <p>
                    <strong>{comment.user}</strong> <small className="is-pulled-right">{comment.time_ago}</small>
                    <br />
                    <div className="text" innerHTML={comment.content}>
                    </div>
                </p>
            </div>
            {comments}
        </div>
    </article>;
}
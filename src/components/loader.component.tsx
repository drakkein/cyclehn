import { VNode } from '@cycle/dom';

export function LoaderComponent(): VNode {
    return (
        <div className="loader">
            <div className="spinner"></div>
        </div>
    );
}
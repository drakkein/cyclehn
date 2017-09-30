import { Stream } from 'xstream';
import { VNode, DOMSource } from '@cycle/dom';
import { HTTPSource, RequestOptions } from '@cycle/http';
import { RouterSink, RouterSource } from 'cyclic-router';
import { StateSource } from 'cycle-onionify';

export type Sources = {
    props$?: Stream<any>;
    DOM: DOMSource;
    HTTP: HTTPSource;
    router: RouterSource,
};

export type RootSinks = {
    DOM: Stream<VNode>;
    HTTP: Stream<RequestOptions>;
    router: RouterSink;
};

export type Sinks = Partial<RootSinks>;
export type Component = (s: Sources) => Sinks;

export type AppSources = Sources & { onion: StateSource<any> };
export type AppSinks = Sinks & { onion: Stream<Reducer> };
export type Reducer = (prev: AppState) => AppState;
export type AppState = {
    hamburgerActive: boolean;
    list: FeedItem[],
    item: Item | undefined,
    user: User | undefined,
};

export interface FeedItem {
    index: number;
    id: number;
    title: string;
    points?: number | null;
    user?: string | null;
    time: number;
    time_ago: string;
    comments_count: number;
    type: string;
    url?: string;
    domain?: string;
}

export interface User {
    id: string;
    about: string;
    created: string;
    karma: string;
}

export interface Item {
    id: number;
    title: string;
    points: number | null;
    user: string | null;
    time: number;
    time_ago: string;
    content: string;
    deleted?: boolean;
    dead?: boolean;
    type: string;
    url?: string;
    domain?: string;
    comments: Item[]; // Comments are items too
    level: number;
    comments_count: number;
}

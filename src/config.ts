export const API = '//hnpwa.com/api/v0';

export const API_NEWS = (list: string) => `${API}/${list}.json`;
export const API_ITEM = (id: string) => `${API}/item/${id}.json`;
export const API_USER = (id: string) => `${API}/user/${id}.json`;
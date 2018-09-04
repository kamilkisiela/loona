import { ApolloClient } from 'apollo-client';
export declare class Loona {
    constructor(client: ApolloClient<any>, states: any[]);
    dispatch(action: any): void;
}

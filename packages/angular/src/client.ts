import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { WatchQueryOptions } from 'apollo-client';

@Injectable({
  providedIn: 'root',
})
export class ApolloFlux {
  constructor(private apollo: Apollo) {}

  query(options: WatchQueryOptions): QueryRef<any> {
    return this.apollo.watchQuery(options);
  }

  mutate(name: string, variables: any) {
    const found = this.link.manager.mutations.get(name);

    if (found) {
      this.apollo.mutate({
        mutation: found.mutation,
        variables,
      });
    } else {
      throw new Error(
        `[@apollo-flex/angular] Mutation '${name}' was not found`,
      );
    }
  }
}

import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { WatchQueryOptions } from 'apollo-client';
import { Manager } from '@apollo-flux/core';

@Injectable({
  providedIn: 'root',
})
export class ApolloFlux {
  constructor(private apollo: Apollo, private manager: Manager) {}

  query(options: WatchQueryOptions): QueryRef<any> {
    return this.apollo.watchQuery(options);
  }

  mutate(name: string, variables: any): void {
    const def = this.manager.mutations.get(name);

    if (def) {
      this.apollo.mutate({
        mutation: def.mutation,
        variables,
      });
    } else {
      throw new Error(`Mutation '${name}' was not found`);
    }
  }
}

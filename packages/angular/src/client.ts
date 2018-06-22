import { Injectable, OnDestroy } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { WatchQueryOptions } from 'apollo-client';
import { Manager, Mutation, getNameOfMutation } from '@apollo-flux/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export const INIT: '@apollo-flux/angular/init' = '@apollo-flux/angular/init';

@Injectable()
export class MutationsSubject extends BehaviorSubject<Mutation>
  implements OnDestroy {
  constructor() {
    super({ name: INIT });
  }

  next(mutation: Mutation): void {
    super.next(mutation);
  }

  complete() {}

  ngOnDestroy() {
    super.complete();
  }
}

@Injectable({
  providedIn: 'root',
})
export class ApolloFlux {
  constructor(
    private apollo: Apollo,
    private manager: Manager,
    private mutations: MutationsSubject,
  ) {}

  query<T = {}>(options: WatchQueryOptions): QueryRef<any> {
    return this.apollo.watchQuery<T>(options);
  }

  dispatch(mutation: Mutation): void;
  dispatch(name: string, variables: any): void;
  dispatch(nameOrMutation: string | Mutation, variables?: any): void {
    let name: string;

    if (typeof nameOrMutation === 'string') {
      name = nameOrMutation;
    } else {
      name = nameOrMutation.name;
      variables = nameOrMutation.variables;
    }

    const def = this.manager.mutations.get(name);

    if (def) {
      this.apollo
        .mutate({
          mutation: def.mutation,
          variables,
        })
        .subscribe(this.emit(name, variables));
    } else {
      throw new Error(`Mutation '${name}' was not found`);
    }
  }

  mutate(options: any): void {
    this.apollo
      .mutate(options)
      .pipe(
        tap(this.emit(getNameOfMutation(options.mutation), options.variables)),
      )
      .subscribe();
  }

  private emit(name: string, variables?: any) {
    return {
      next: () => {
        this.mutations.next({
          name,
          variables,
        });
      },
      error: () => {
        this.mutations.error({
          name,
          variables,
        });
      },
    };
  }
}

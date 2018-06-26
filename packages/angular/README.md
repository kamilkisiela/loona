# @loona/angular

App State Management done with GraphQL

## Installation

```bash
npm install @loona/angular --save
// or
yarn add @loona/angular
```

## API

### State

```ts
import { State } from '@loona/angular';

@State({
  defaults: {
    currentGame: {
      __typename: 'CurrentGame',
      teamAScore: 0,
      teamBScore: 0,
      teamAName: 'Team A',
      teamBName: 'Team B',
    },
  },
})
export class GameState {}
```

### Mutation

Define an action:

```ts
import gql from 'graphql-tag';

export class Goal {
  static mutation = gql`
    mutation goal($team: String!) {
      goal(team: $team) @client
    }
  `;
  variables: any;
  constructor(team: 'A' | 'B') {
    this.variables = { team };
  }
}
```

Define a mutation:

```ts
import { Mutation } from '@loona/angular';
import { Goal } from './game.actions';

@State({ ... })
export class GameState {
    @Mutation(Goal)
    goal(root, args, context) {
        // ...
    }
}
```

### Query

Define a query:

```ts
import { Query } from '@loona/angular';
import { Goal } from './game.actions';

@State({ ... })
export class GameState {
    @Query()
    gameStatus(root, args, context) {
        // query gameStatus { gameStatus { ... } }
        return {...};
    }
}
```

### Action

Define an action:

```ts
export class StartGame {
  static type = '[Game] start';
}
```

And apply it to a state:

```ts
import { Query } from '@loona/angular';
import { of } from 'rxjs';
import { StartGame, GameStarted } from './game.actions';

@State({ ... })
export class GameState {
    @Action(StartGame)
    onStartGame(state, args) {
        return of(new GameStarted())
    }
}
```

### Loona

How to dispatch an action:

```ts
import { Loona } from '@loona/angular';

import { Goal } from './game.actions';

@Component({...})
export class AppComponent {
    constructor(private loona: Loona) {}

    ngOnInit() {
        this.
    }

    goal() {
        this.loona.dispatch(new Goal('A'))
    }
}
```

How to query data:

```ts
import { Loona } from '@loona/angular';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

import { currentGameQuery } from './graphql';
import { CurrentGame } from './interfaces';

@Component({...})
export class AppComponent {
    game: Observable<CurrentGame>;

    constructor(private loona: Loona) {}

    ngOnInit() {
        this.game = this.loona.query({ query: currentGameQuery })
            .valueChanges
            .pipe(pluck('data', 'currentGame'));
    }
}
```

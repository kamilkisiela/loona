# @luna/angular

App State Management done with GraphQL

## Installation

```bash
npm install @luna/angular --save
// or
yarn add @luna/angular
```

## API

### State

```ts
import { State } from '@luna/angular';

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
import { Mutation } from '@luna/angular';
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
import { Query } from '@luna/angular';
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
import { Query } from '@luna/angular';
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

### Luna

How to dispatch an action:

```ts
import { Luna } from '@luna/angular';

import { Goal } from './game.actions';

@Component({...})
export class AppComponent {
    constructor(private luna: Luna) {}

    ngOnInit() {
        this.
    }

    goal() {
        this.luna.dispatch(new Goal('A'))
    }
}
```

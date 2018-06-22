import { IMutation } from '@apollo-flux/angular';

export class UpdateName implements IMutation {
  name = 'updateName';

  constructor(
    public variables: {
      team: 'A' | 'B';
      name: string;
    },
  ) {}
}

export class Goal implements IMutation {
  name = 'goal';

  constructor(
    public variables: {
      team: 'A' | 'B';
    },
  ) {}
}

export class ResetCurrentGame implements IMutation {
  name = 'resetCurrentGame';
}

export class GameCreationSuccess implements IMutation {
  name = 'updateGameStatus';
  variables = {
    created: true,
  };
}

export class GameCreationFailure implements IMutation {
  name = 'updateGameStatus';
  variables = {
    error: false,
  };
}

import {mapStates} from '../src/effects';

describe('mapStates', () => {
  class BooksState {}

  test(`should extract state's name from constructor`, () => {
    const {add, names} = mapStates();

    add(new BooksState());

    expect(names).toContain('BooksState');
  });
});

import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import {Schema as StateOptions} from '../src/state/schema';
import {getTestProjectPath, createWorkspace} from './testing';

describe('State Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@loona/schematics',
    path.join(__dirname, '../collection.json'),
  );
  const defaultOptions: StateOptions = {
    name: 'foo',
    project: 'bar',
    module: undefined,
    flat: false,
    root: true,
  };

  const projectPath = getTestProjectPath();

  let appTree: UnitTestTree;

  beforeEach(() => {
    appTree = createWorkspace(schematicRunner, appTree);
  });

  it('should create the initial state file', () => {
    const options = {...defaultOptions};

    const tree = schematicRunner.runSchematic('state', options, appTree);
    const files = tree.files;

    expect(
      files.indexOf(`${projectPath}/src/app/foo.state.ts`),
    ).toBeGreaterThanOrEqual(0);
  });

  it('should not be provided by default', () => {
    const options = {...defaultOptions};

    const tree = schematicRunner.runSchematic('state', options, appTree);
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);
    expect(content).not.toMatch(/import { FooState } from '\.\/foo.state';/);
  });

  it('should import into a specified module', () => {
    const options = {...defaultOptions, module: 'app.module.ts'};

    const tree = schematicRunner.runSchematic('state', options, appTree);
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);
    expect(content).toMatch(/import { FooState } from '\.\/foo.state';/);
  });

  it('should import into a specified module', () => {
    const options = {...defaultOptions, module: 'app.module.ts'};

    schematicRunner.runSchematic('state', options, appTree);
    const tree = schematicRunner.runSchematic(
      'state',
      {
        ...options,
        name: 'bar',
      },
      appTree,
    );

    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);

    expect(content).toMatch(/import { FooState } from '\.\/foo.state';/);
    expect(content).toMatch(/import { BarState } from '\.\/bar.state';/);
    expect(content).toMatch(/LoonaModule\.forRoot\(\[FooState, BarState\]\)/);
  });

  it('should fail if specified module does not exist', () => {
    const options = {...defaultOptions, module: '/src/app/app.moduleXXX.ts'};
    let thrownError: Error | null = null;
    try {
      schematicRunner.runSchematic('state', options, appTree);
    } catch (err) {
      thrownError = err;
    }
    expect(thrownError).toBeDefined();
  });

  it('should import a child in a specified module', () => {
    const options = {...defaultOptions, root: false, module: 'app.module.ts'};

    const tree = schematicRunner.runSchematic('state', options, appTree);
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);

    expect(content).toMatch(/LoonaModule\.forChild\(\[FooState\]\)/);
  });

  it('use typeDefs based on graphql', () => {
    const options = {
      ...defaultOptions,
      root: false,
      graphql: 'foo.graphql',
      module: 'app.module.ts',
    };
    const schema = `
      type Book {
        id: ID
        title: String
      }

      type Query {
        books: [Book]
      }

      type Mutation {
        addBook(title: String!): Book
      }
    `;
    appTree.create(`${projectPath}/src/app/foo.graphql`, schema);

    const tree = schematicRunner.runSchematic('state', options, appTree);
    const content = tree.readContent(`${projectPath}/src/app/foo.state.ts`);

    expect(content).toMatch(schema.trim());
  });

  test('import State, Mutation, Context', () => {
    const options = {...defaultOptions};

    const tree = schematicRunner.runSchematic('state', options, appTree);
    const content = tree.readContent(`${projectPath}/src/app/foo.state.ts`);

    expect(content).toMatch(
      `import { State, Mutation, Context } from '@loona/angular';`,
    );
  });

  test('add mutation based on schema', () => {
    const options = {
      ...defaultOptions,
      root: false,
      graphql: 'foo.graphql',
      module: 'app.module.ts',
    };
    const schema = `
      type Book {
        id: ID
        title: String
      }

      type Query {
        books: [Book]
      }

      type Mutation {
        addBook(title: String!): Book
      }
    `;
    appTree.create(`${projectPath}/src/app/foo.graphql`, schema);

    const tree = schematicRunner.runSchematic('state', options, appTree);
    const content = tree.readContent(`${projectPath}/src/app/foo.state.ts`);

    expect(content).toMatch(
      /\@Mutation\(\'addBook\'\)\s+addBook\(_, args, context\: Context\) {}/,
    );
  });
});

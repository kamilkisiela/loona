import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import {ChildOptions} from '../src/child-state/schema';
import {getTestProjectPath, createWorkspace} from './testing';

describe('Child State Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@loona/schematics',
    path.join(__dirname, '../collection.json'),
  );
  const defaultOptions: ChildOptions = {
    name: 'foo',
    project: 'bar',
    module: undefined,
    flat: false,
  };

  const projectPath = getTestProjectPath();

  let appTree: UnitTestTree;

  beforeEach(() => {
    appTree = createWorkspace(schematicRunner, appTree);
  });

  it('should create all files of a child', () => {
    const options = {...defaultOptions};

    const tree = schematicRunner.runSchematic('child', options, appTree);
    const files = tree.files;
    expect(
      files.indexOf(`${projectPath}/src/app/foo.state.ts`),
    ).toBeGreaterThanOrEqual(0);
  });

  it('should respect the path provided for the child name', () => {
    const options = {
      ...defaultOptions,
      name: 'foo/Foo',
      module: '../app.module.ts',
    };

    const tree = schematicRunner.runSchematic('child', options, appTree);
    const moduleFileContent = tree.readContent(
      `${projectPath}/src/app/app.module.ts`,
    );

    expect(moduleFileContent).toMatch(
      `import { FooState } from './foo/foo.state';`,
    );
  });
});

import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  apply,
  branchAndMerge,
  chain,
  mergeWith,
  template,
  url,
  move,
} from '@angular-devkit/schematics';
import {Path, dirname} from '@angular-devkit/core';
import * as ts from 'typescript';
import {GraphQLSchema, buildSchema} from 'graphql';

import * as stringUtils from '../utility/strings';
import {buildRelativePath, findModuleFromOptions} from '../utility/find-module';
import {addImportToModule} from '../utility/ast-utils';
import {insertImport} from '../utility/route-utils';
import {Change, InsertChange} from '../utility/change';
import {getProjectPath, isLib} from '../utility/project';
import {parseName} from '../utility/parse-name';

import {Schema as StateOptions} from './schema';

function addImportToNgModule(options: StateOptions): Rule {
  return (host: Tree) => {
    const modulePath = options.module;

    if (!modulePath) {
      return host;
    }

    if (!host.exists(modulePath)) {
      throw new Error(`Specified module path ${modulePath} does not exist`);
    }

    const text = host.read(modulePath);
    if (text === null) {
      throw new SchematicsException(`File ${modulePath} does not exist.`);
    }
    const sourceText = text.toString('utf-8');

    const source = ts.createSourceFile(
      modulePath,
      sourceText,
      ts.ScriptTarget.Latest,
      true,
    );

    const statePath = `${options.path}/${stringUtils.dasherize(
      options.name,
    )}.state.ts`;
    const relativePath = buildRelativePath(modulePath, statePath);
    const stateClassName = `${stringUtils.classify(options.name)}State`;

    const stateNgModuleImport = addImportToModule(
      source,
      modulePath,
      `LoonaModule.${
        options.root ? 'forRoot' : 'forChild'
      }([${stateClassName}])`,
      relativePath,
    ).shift();

    let commonImports: any[] = [
      insertImport(source, modulePath, 'LoonaModule', '@loona/angular'),
      insertImport(source, modulePath, stateClassName, relativePath),
      stateNgModuleImport,
    ];

    let rootImports: (Change | undefined)[] = [];

    const changes = [...commonImports, ...rootImports];
    const recorder = host.beginUpdate(modulePath);
    for (const change of changes) {
      if (change instanceof InsertChange) {
        recorder.insertLeft(change.pos, change.toAdd);
      }
    }
    host.commitUpdate(recorder);

    return host;
  };
}

export default function(options: StateOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    const received: any = {};
    options.path = getProjectPath(host, options);

    const parsedPath = parseName(options.path, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;

    if (options.module) {
      options.module = findModuleFromOptions(host, options);
    }

    const statePath = `/${options.path}/index.ts`;
    const srcPath = dirname(options.path as Path);
    const environmentsPath = buildRelativePath(
      statePath,
      `${srcPath}/environments/environment`,
    );

    if (options.graphql) {
      const graphqlPath = `${options.path}/${options.graphql}`;
      const text = host.read(graphqlPath);

      if (text === null) {
        throw new SchematicsException(
          `GraphQL file ${graphqlPath} does not exist.`,
        );
      }

      received.schema = text.toString('utf-8').trim();
      received.mutations = getMutations(buildSchema(received.schema));
    }

    const templateSource = apply(url('./files'), [
      template({
        ...stringUtils,
        ...(options as object),
        received,
        isLib: isLib(host, options),
        environmentsPath,
      } as any),
      move(parsedPath.path),
    ]);

    return chain([
      branchAndMerge(
        chain([addImportToNgModule(options), mergeWith(templateSource)]),
      ),
    ])(host, context);
  };
}

function getMutations(schema: GraphQLSchema): Array<string> | undefined {
  const mutation = schema.getMutationType();

  if (!mutation) {
    return;
  }

  return Object.keys(mutation.getFields());
}

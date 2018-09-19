import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  schematic,
} from '@angular-devkit/schematics';
import {ChildOptions} from './schema';

export default function(options: ChildOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    return chain([
      schematic('state', {
        flat: options.flat,
        module: options.module,
        name: options.name,
        path: options.path,
        project: options.project,
        root: false,
      }),
    ])(host, context);
  };
}

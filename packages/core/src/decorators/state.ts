import {setStateMetadata} from '../metadata/state';
import {StateOptions} from '../types/state';

export function State<T>(options: StateOptions<T>) {
  return (target: any) => {
    setStateMetadata(target, options);

    return target;
  };
}

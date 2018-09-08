import {EffectDef, EffectMethod} from '../types/effect';
import {setEffectMetadata} from '../metadata/effect';

export function Effect(effects: EffectDef | EffectDef[], options?: any) {
  return function(
    target: any,
    name: string,
    _descriptor: TypedPropertyDescriptor<EffectMethod>,
  ) {
    setEffectMetadata(
      target,
      name,
      Array.isArray(effects) ? effects : [effects],
      options,
    );
  };
}

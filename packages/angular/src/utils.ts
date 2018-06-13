import { from } from 'rxjs';
import { first } from 'rxjs/operators';

export const createResolver = (instance: any, propName: string) => (
  _: any,
  args: any,
  context: any,
) =>
  new Promise<any>((resolve, reject) => {
    let result: any;

    try {
      result = instance[propName].call(instance, _, args, context);
    } catch (e) {
      reject(e);
    }

    from(result)
      .pipe(first())
      .subscribe({
        next: resolve,
        error: reject,
      });
  });

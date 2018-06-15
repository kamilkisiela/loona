import { from } from 'rxjs';
import { first } from 'rxjs/operators';

function wrapObservable(instance: any, propName: string) {
  return (...args: any[]) =>
    new Promise<any>((resolve, reject) => {
      let result: any;

      try {
        result = instance[propName].apply(instance, args);
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
}

export const createResolver = wrapObservable;

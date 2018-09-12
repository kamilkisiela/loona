import * as React from 'react';
import {LoonaContext} from '../context';
import {Loona} from '../client';
import {Dispatch} from '../types';

export function connect(
  factory: ((
    dispatch: Dispatch,
  ) => {
    [propName: string]: (...args: any[]) => any;
  }),
) {
  return function wrapWithConnect(WrappedComponent: React.ComponentType) {
    const wrappedComponentName =
      WrappedComponent.displayName || WrappedComponent.name || 'Component';
    const displayName = `Connect(${wrappedComponentName})`;

    function wrapWithDispatch(props: any, loona?: Loona) {
      if (!loona) {
        throw new Error('No Loona no fun!');
      }

      const childProps = factory(loona.dispatch.bind(loona));

      return <WrappedComponent {...props} {...childProps} />;
    }

    function Connect(props: any) {
      return (
        <LoonaContext.Consumer>
          {({loona}) => wrapWithDispatch(props, loona)}
        </LoonaContext.Consumer>
      );
    }

    (Connect as any).displayName = displayName;
    (Connect as any).WrappedComponent = WrappedComponent;

    return Connect;
  };
}

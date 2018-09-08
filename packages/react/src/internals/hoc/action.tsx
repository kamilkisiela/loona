import * as React from 'react';
import {Action} from '../component/action';

export function action(action?: string, alias?: string) {
  return (Component: React.ComponentType<any>) =>
    class extends React.Component {
      render() {
        return (
          <Action action={action}>
            {dispatch => {
              const childProps = {
                [alias || 'dispatch']: dispatch,
              };
              return <Component {...this.props} {...childProps} />;
            }}
          </Action>
        );
      }
    };
}

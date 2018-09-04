import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Loona } from '../internals/client';
export interface ActionProps {
    action: any;
    children: (dispatchFn: (action?: any) => void) => React.ReactNode;
}
export declare class Action extends React.Component<ActionProps> {
    static propTypes: {
        action: PropTypes.Requireable<any>;
        children: PropTypes.Validator<(...args: any[]) => any>;
    };
    createDispatch(loona?: Loona): (action: any) => void;
    render(): JSX.Element;
}

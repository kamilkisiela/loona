import * as React from 'react';
import * as PropTypes from 'prop-types';
export interface LoonaProviderProps {
    children: React.ReactNode;
    states: any[];
}
export declare class LoonaProvider extends React.Component<LoonaProviderProps> {
    static propTypes: {
        states: PropTypes.Requireable<any[]>;
        children: PropTypes.Validator<string | number | boolean | {} | React.ReactElement<any> | React.ReactNodeArray | React.ReactPortal>;
    };
    render(): JSX.Element;
}

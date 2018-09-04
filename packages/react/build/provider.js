var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as React from 'react';
import * as PropTypes from 'prop-types';
import { ApolloConsumer } from 'react-apollo';
import { Loona } from './internals/client';
import { LoonaContext } from './internals/context';
var LoonaProvider = /** @class */ (function (_super) {
    __extends(LoonaProvider, _super);
    function LoonaProvider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LoonaProvider.prototype.render = function () {
        var _a = this.props, children = _a.children, states = _a.states;
        return (React.createElement(ApolloConsumer, null, function (client) {
            return (React.createElement(LoonaContext.Provider, { value: {
                    loona: new Loona(client, states),
                } }, children));
        }));
    };
    LoonaProvider.propTypes = {
        states: PropTypes.array,
        children: PropTypes.node.isRequired,
    };
    return LoonaProvider;
}(React.Component));
export { LoonaProvider };
//# sourceMappingURL=provider.js.map
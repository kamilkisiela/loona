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
import { LoonaContext } from '../internals/context';
var Action = /** @class */ (function (_super) {
    __extends(Action, _super);
    function Action() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Action.prototype.createDispatch = function (loona) {
        var _this = this;
        return function (action) {
            if (!loona) {
                throw new Error('No Loona no fun!');
            }
            loona.dispatch(_this.props.action || action);
        };
    };
    Action.prototype.render = function () {
        var _this = this;
        var children = this.props.children;
        return (React.createElement(LoonaContext.Consumer, null, function (_a) {
            var loona = _a.loona;
            return children(_this.createDispatch(loona));
        }));
    };
    Action.propTypes = {
        action: PropTypes.any,
        children: PropTypes.func.isRequired,
    };
    return Action;
}(React.Component));
export { Action };
//# sourceMappingURL=action.js.map
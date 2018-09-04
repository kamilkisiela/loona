var Loona = /** @class */ (function () {
    function Loona(client, states) {
        console.log('[Loona::client]', client);
        console.log('[Loona::states]', states);
    }
    Loona.prototype.dispatch = function (action) {
        console.log('[Loona::dispatch] Dispatched', action);
        console.error('[Loona::dispatch] Not yet implemented');
    };
    return Loona;
}());
export { Loona };
//# sourceMappingURL=client.js.map
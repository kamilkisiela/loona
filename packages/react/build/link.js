import { LoonaLink } from '@loona/core';
export function createLoona(cache, states) {
    console.log('states', states);
    return new LoonaLink({
        cache: cache,
    });
}
//# sourceMappingURL=link.js.map
import type { PortPosition } from 'types'

export const groupBy = (arr: PortPosition[], mapValues: Record<string, string | undefined>, property?: string): Record<string, PortPosition[]> => {
    return arr.reduce(function (memo: Record<string, PortPosition[]>, x: PortPosition) {
        const value = mapValues[x.s2id] ?? ''
        if (!memo[value]) { memo[value] = []; }
        memo[value].push(x);
        return memo;
    }, {});
}
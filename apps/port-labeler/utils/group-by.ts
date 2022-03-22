export const groupBy = (arr, mapValues, property) => {
    return arr.reduce(function (memo, x) {
        const value = mapValues[x.s2id]
        if (!memo[value]) { memo[value] = []; }
        memo[value].push(x);
        return memo;
    }, {});
}
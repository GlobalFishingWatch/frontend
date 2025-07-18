// Regex that uniquely matches http://localhost:3003/map (with optional /index and query parameters)
const regex = /^https?:\/\/localhost:3003\/map(?:\/index)?(?:\?.*)?$/

// Test cases
const testCases = [
  'http://localhost:3003/map', // ✅ Should match
  'https://localhost:3003/map', // ✅ Should match
  'http://localhost:3003/map/index', // ✅ Should match
  'http://localhost:3003/map/index?longitude=26&latitude=19&zoom=1.49', // ✅ Should match
  'http://localhost:3003/map?longitude=26&latitude=19&zoom=1.49', // ✅ Should match
  'http://localhost:3003/map/', // ❌ Should not match (trailing slash)
  'http://localhost:3003/map/extra', // ❌ Should not match (extra path)
  'http://localhost:3003/maps', // ❌ Should not match (different path)
  'http://localhost:3004/map', // ❌ Should not match (different port)
  'http://example.com:3003/map', // ❌ Should not match (different host)
  'http://localhost:3003', // ❌ Should not match (no path)
  'localhost:3003/map', // ❌ Should not match (no protocol)
]

// Test the regex
testCases.forEach((testCase) => {
  const matches = regex.test(testCase)
  console.log(`${testCase} -> ${matches ? '✅ MATCH' : '❌ NO MATCH'}`)
})

// Alternative more strict version (only http, not https)
const strictRegex = /^http:\/\/localhost:3003\/map$/

// Alternative version that allows optional trailing slash
const flexibleRegex = /^https?:\/\/localhost:3003\/map\/?$/

// Alternative version that matches the exact string with word boundaries
const wordBoundaryRegex = /\bhttps?:\/\/localhost:3003\/map\b/

/**
 * Seed script — run once to populate the database with problems.
 * HOW TO RUN:  cd backend && node src/seed.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Problem from './models/Problem.js';

dotenv.config();

const problems = [
  // ─── EASY ────────────────────────────────────────────────────────────────
  {
    title: 'Hello World',
    slug: 'hello-world',
    difficulty: 'Easy', order: 1, tags: ['basics'],
    description: `## Hello World\n\nWrite a C++ program that prints \`Hello, World!\` to standard output.\n\n### Output\n\`\`\`\nHello, World!\n\`\`\``,
    starterCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Print Hello, World!\n    return 0;\n}`,
    testCases: [
      { input: '', expectedOutput: 'Hello, World!', isHidden: false },
      { input: '', expectedOutput: 'Hello, World!', isHidden: true },
    ],
  },
  {
    title: 'Sum of Two Numbers',
    slug: 'sum-of-two-numbers',
    difficulty: 'Easy', order: 2, tags: ['math', 'basics'],
    description: `## Sum of Two Numbers\n\nRead two integers and print their sum.\n\n### Input\nTwo space-separated integers.\n\n### Output\nTheir sum.\n\n### Example\n**Input:** \`3 5\`\n**Output:** \`8\``,
    starterCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    // print the sum\n    return 0;\n}`,
    testCases: [
      { input: '3 5',     expectedOutput: '8',    isHidden: false },
      { input: '0 0',     expectedOutput: '0',    isHidden: false },
      { input: '-1 1',    expectedOutput: '0',    isHidden: true  },
      { input: '100 200', expectedOutput: '300',  isHidden: true  },
      { input: '-50 -50', expectedOutput: '-100', isHidden: true  },
      { input: '999 1',   expectedOutput: '1000', isHidden: true  },
    ],
  },
  {
    title: 'Reverse a String',
    slug: 'reverse-a-string',
    difficulty: 'Easy', order: 3, tags: ['strings'],
    description: `## Reverse a String\n\nGiven a string (no spaces), print it reversed.\n\n### Example\n**Input:** \`hello\`\n**Output:** \`olleh\``,
    starterCode: `#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n    // reverse and print\n    return 0;\n}`,
    testCases: [
      { input: 'hello',    expectedOutput: 'olleh',    isHidden: false },
      { input: 'abcde',    expectedOutput: 'edcba',    isHidden: false },
      { input: 'racecar',  expectedOutput: 'racecar',  isHidden: true  },
      { input: 'a',        expectedOutput: 'a',        isHidden: true  },
      { input: 'abcdefgh', expectedOutput: 'hgfedcba', isHidden: true  },
    ],
  },
  {
    title: 'FizzBuzz',
    slug: 'fizzbuzz',
    difficulty: 'Easy', order: 4, tags: ['math', 'loops'],
    description: `## FizzBuzz\n\nGiven N, print 1 to N. Multiples of 3 → \`Fizz\`, multiples of 5 → \`Buzz\`, both → \`FizzBuzz\`.\n\n### Example (N=5)\n\`\`\`\n1\n2\nFizz\n4\nBuzz\n\`\`\``,
    starterCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 1; i <= n; i++) {\n        // your logic here\n    }\n    return 0;\n}`,
    testCases: [
      { input: '5',  expectedOutput: '1\n2\nFizz\n4\nBuzz', isHidden: false },
      { input: '1',  expectedOutput: '1', isHidden: false },
      { input: '3',  expectedOutput: '1\n2\nFizz', isHidden: true },
      { input: '15', expectedOutput: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz', isHidden: true },
    ],
  },
  {
    title: 'Count Vowels',
    slug: 'count-vowels',
    difficulty: 'Easy', order: 5, tags: ['strings'],
    description: `## Count Vowels\n\nCount vowels (a,e,i,o,u — case insensitive) in the input string.\n\n### Example\n**Input:** \`Hello World\`\n**Output:** \`3\``,
    starterCode: `#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s;\n    getline(cin, s);\n    int count = 0;\n    // count vowels\n    cout << count << endl;\n    return 0;\n}`,
    testCases: [
      { input: 'Hello World', expectedOutput: '3', isHidden: false },
      { input: 'aeiou',       expectedOutput: '5', isHidden: false },
      { input: 'rhythm',      expectedOutput: '0', isHidden: true  },
      { input: 'AEIOU',       expectedOutput: '5', isHidden: true  },
      { input: 'The quick brown fox', expectedOutput: '5', isHidden: true },
    ],
  },
  {
    title: 'Even or Odd',
    slug: 'even-or-odd',
    difficulty: 'Easy', order: 6, tags: ['math', 'basics'],
    description: `## Even or Odd\n\nGiven an integer, print \`Even\` or \`Odd\`.\n\n### Example\n**Input:** \`4\`\n**Output:** \`Even\``,
    starterCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // check even or odd\n    return 0;\n}`,
    testCases: [
      { input: '4',  expectedOutput: 'Even', isHidden: false },
      { input: '7',  expectedOutput: 'Odd',  isHidden: false },
      { input: '0',  expectedOutput: 'Even', isHidden: true  },
      { input: '-3', expectedOutput: 'Odd',  isHidden: true  },
      { input: '-8', expectedOutput: 'Even', isHidden: true  },
    ],
  },
  {
    title: 'Factorial',
    slug: 'factorial',
    difficulty: 'Easy', order: 7, tags: ['math', 'recursion'],
    description: `## Factorial\n\nCompute N! for a given N (0 ≤ N ≤ 12).\n\n### Example\n**Input:** \`5\`\n**Output:** \`120\``,
    starterCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    long long result = 1;\n    // compute factorial\n    cout << result << endl;\n    return 0;\n}`,
    testCases: [
      { input: '5',  expectedOutput: '120',       isHidden: false },
      { input: '0',  expectedOutput: '1',         isHidden: false },
      { input: '1',  expectedOutput: '1',         isHidden: true  },
      { input: '10', expectedOutput: '3628800',   isHidden: true  },
      { input: '12', expectedOutput: '479001600', isHidden: true  },
    ],
  },

  // ─── MEDIUM ───────────────────────────────────────────────────────────────
  {
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Medium', order: 8, tags: ['arrays', 'hash-map'],
    description: `## Two Sum\n\nFind two indices in the array that add up to target. Print smaller index first.\n\n### Input\nLine 1: N target\nLine 2: N integers\n\n### Example\n**Input:**\n\`\`\`\n4 9\n2 7 11 15\n\`\`\`\n**Output:** \`0 1\``,
    starterCode: `#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nint main() {\n    int n, target;\n    cin >> n >> target;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    // find two indices\n    return 0;\n}`,
    testCases: [
      { input: '4 9\n2 7 11 15',  expectedOutput: '0 1', isHidden: false },
      { input: '3 6\n3 2 4',      expectedOutput: '1 2', isHidden: false },
      { input: '2 6\n3 3',        expectedOutput: '0 1', isHidden: true  },
      { input: '5 10\n1 2 3 4 6', expectedOutput: '3 4', isHidden: true  },
      { input: '4 0\n-3 4 3 90',  expectedOutput: '0 2', isHidden: true  },
    ],
  },
  {
    title: 'Palindrome Check',
    slug: 'palindrome-check',
    difficulty: 'Medium', order: 9, tags: ['strings', 'two-pointers'],
    description: `## Palindrome Check\n\nCheck if a string is a palindrome (case insensitive). Print \`YES\` or \`NO\`.\n\n### Example\n**Input:** \`Racecar\`\n**Output:** \`YES\``,
    starterCode: `#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n    // check palindrome\n    return 0;\n}`,
    testCases: [
      { input: 'Racecar', expectedOutput: 'YES', isHidden: false },
      { input: 'hello',   expectedOutput: 'NO',  isHidden: false },
      { input: 'Madam',   expectedOutput: 'YES', isHidden: true  },
      { input: 'abcba',   expectedOutput: 'YES', isHidden: true  },
      { input: 'abcd',    expectedOutput: 'NO',  isHidden: true  },
      { input: 'a',       expectedOutput: 'YES', isHidden: true  },
    ],
  },
  {
    title: 'Maximum Subarray',
    slug: 'maximum-subarray',
    difficulty: 'Medium', order: 10, tags: ['arrays', 'dynamic-programming'],
    description: `## Maximum Subarray\n\nFind the contiguous subarray with the largest sum (Kadane's Algorithm).\n\n### Input\nLine 1: N\nLine 2: N integers\n\n### Example\n**Input:**\n\`\`\`\n9\n-2 1 -3 4 -1 2 1 -5 4\n\`\`\`\n**Output:** \`6\``,
    starterCode: `#include <iostream>\n#include <vector>\n#include <climits>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    int maxSum = INT_MIN, cur = 0;\n    // Kadane's algorithm\n    cout << maxSum << endl;\n    return 0;\n}`,
    testCases: [
      { input: '9\n-2 1 -3 4 -1 2 1 -5 4', expectedOutput: '6',  isHidden: false },
      { input: '1\n1',                       expectedOutput: '1',  isHidden: false },
      { input: '4\n-1 -2 -3 -4',            expectedOutput: '-1', isHidden: true  },
      { input: '5\n5 4 -1 7 8',             expectedOutput: '23', isHidden: true  },
      { input: '3\n-2 -1 -3',               expectedOutput: '-1', isHidden: true  },
    ],
  },
  {
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'Medium', order: 11, tags: ['stack', 'strings'],
    description: `## Valid Parentheses\n\nGiven a string of brackets \`()[]{}\`, check if it is valid. Print \`YES\` or \`NO\`.\n\n### Example\n**Input:** \`()[]{}\`\n**Output:** \`YES\``,
    starterCode: `#include <iostream>\n#include <string>\n#include <stack>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n    stack<char> st;\n    // validate brackets\n    return 0;\n}`,
    testCases: [
      { input: '()[]{}', expectedOutput: 'YES', isHidden: false },
      { input: '(]',     expectedOutput: 'NO',  isHidden: false },
      { input: '([)]',   expectedOutput: 'NO',  isHidden: true  },
      { input: '{[]}',   expectedOutput: 'YES', isHidden: true  },
      { input: '(((',    expectedOutput: 'NO',  isHidden: true  },
    ],
  },
  {
    title: 'Binary Search',
    slug: 'binary-search',
    difficulty: 'Medium', order: 12, tags: ['arrays', 'binary-search'],
    description: `## Binary Search\n\nReturn the index of target in a sorted array, or \`-1\` if not found.\n\n### Input\nLine 1: N target\nLine 2: N sorted integers\n\n### Example\n**Input:**\n\`\`\`\n6 9\n-1 0 3 5 9 12\n\`\`\`\n**Output:** \`4\``,
    starterCode: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n, target;\n    cin >> n >> target;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    // binary search\n    cout << -1 << endl;\n    return 0;\n}`,
    testCases: [
      { input: '6 9\n-1 0 3 5 9 12', expectedOutput: '4',  isHidden: false },
      { input: '6 2\n-1 0 3 5 9 12', expectedOutput: '-1', isHidden: false },
      { input: '1 0\n0',             expectedOutput: '0',  isHidden: true  },
      { input: '4 3\n1 2 3 4',       expectedOutput: '2',  isHidden: true  },
      { input: '3 5\n1 3 7',         expectedOutput: '-1', isHidden: true  },
    ],
  },
  {
    title: 'Count Inversions',
    slug: 'count-inversions',
    difficulty: 'Medium', order: 13, tags: ['arrays', 'sorting'],
    description: `## Count Inversions\n\nCount pairs (i,j) where i < j but arr[i] > arr[j].\n\n### Input\nLine 1: N\nLine 2: N integers\n\n### Example\n**Input:**\n\`\`\`\n5\n2 4 1 3 5\n\`\`\`\n**Output:** \`3\``,
    starterCode: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nlong long mergeCount(vector<int>& arr, int l, int r) {\n    if (l >= r) return 0;\n    int mid = (l + r) / 2;\n    long long inv = mergeCount(arr, l, mid) + mergeCount(arr, mid+1, r);\n    // merge and count split inversions\n    return inv;\n}\n\nint main() {\n    int n; cin >> n;\n    vector<int> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    cout << mergeCount(arr, 0, n-1) << endl;\n    return 0;\n}`,
    testCases: [
      { input: '5\n2 4 1 3 5', expectedOutput: '3', isHidden: false },
      { input: '3\n1 2 3',     expectedOutput: '0', isHidden: false },
      { input: '3\n3 2 1',     expectedOutput: '3', isHidden: true  },
      { input: '4\n1 3 2 4',   expectedOutput: '1', isHidden: true  },
      { input: '1\n5',         expectedOutput: '0', isHidden: true  },
    ],
  },

  // ─── HARD ─────────────────────────────────────────────────────────────────
  {
    title: 'Longest Common Subsequence',
    slug: 'longest-common-subsequence',
    difficulty: 'Hard', order: 14, tags: ['dynamic-programming', 'strings'],
    description: `## Longest Common Subsequence\n\nFind the length of the LCS of two strings.\n\n### Input\nLine 1: string A\nLine 2: string B\n\n### Example\n**Input:**\n\`\`\`\nabcde\nace\n\`\`\`\n**Output:** \`3\``,
    starterCode: `#include <iostream>\n#include <string>\n#include <vector>\nusing namespace std;\n\nint main() {\n    string a, b;\n    cin >> a >> b;\n    int m = a.size(), n = b.size();\n    vector<vector<int>> dp(m+1, vector<int>(n+1, 0));\n    // fill dp table\n    cout << dp[m][n] << endl;\n    return 0;\n}`,
    testCases: [
      { input: 'abcde\nace',      expectedOutput: '3', isHidden: false },
      { input: 'abc\nabc',        expectedOutput: '3', isHidden: false },
      { input: 'abc\ndef',        expectedOutput: '0', isHidden: true  },
      { input: 'AGGTAB\nGXTXAYB', expectedOutput: '4', isHidden: true  },
      { input: 'a\na',            expectedOutput: '1', isHidden: true  },
    ],
  },
  {
    title: '0/1 Knapsack',
    slug: '0-1-knapsack',
    difficulty: 'Hard', order: 15, tags: ['dynamic-programming'],
    description: `## 0/1 Knapsack\n\nGiven N items (weight, value) and capacity W, find the maximum value.\n\n### Input\nLine 1: N W\nNext N lines: weight value\n\n### Example\n**Input:**\n\`\`\`\n4 8\n2 3\n3 4\n4 5\n5 6\n\`\`\`\n**Output:** \`10\``,
    starterCode: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n, W;\n    cin >> n >> W;\n    vector<int> wt(n), val(n);\n    for (int i = 0; i < n; i++) cin >> wt[i] >> val[i];\n    // dp knapsack\n    cout << 0 << endl;\n    return 0;\n}`,
    testCases: [
      { input: '4 8\n2 3\n3 4\n4 5\n5 6',     expectedOutput: '10',  isHidden: false },
      { input: '3 50\n10 60\n20 100\n30 120',  expectedOutput: '220', isHidden: false },
      { input: '1 0\n1 10',                    expectedOutput: '0',   isHidden: true  },
      { input: '2 3\n3 4\n2 3',               expectedOutput: '3',   isHidden: true  },
      { input: '3 10\n5 10\n4 40\n3 30',      expectedOutput: '70',  isHidden: true  },
    ],
  },
  {
    title: 'Longest Increasing Subsequence',
    slug: 'longest-increasing-subsequence',
    difficulty: 'Hard', order: 16, tags: ['dynamic-programming', 'binary-search'],
    description: `## Longest Increasing Subsequence\n\nFind the length of the LIS (strictly increasing).\n\n### Input\nLine 1: N\nLine 2: N integers\n\n### Example\n**Input:**\n\`\`\`\n8\n10 9 2 5 3 7 101 18\n\`\`\`\n**Output:** \`4\``,
    starterCode: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    vector<int> tails;\n    for (int x : nums) {\n        auto it = lower_bound(tails.begin(), tails.end(), x);\n        if (it == tails.end()) tails.push_back(x);\n        else *it = x;\n    }\n    cout << tails.size() << endl;\n    return 0;\n}`,
    testCases: [
      { input: '8\n10 9 2 5 3 7 101 18', expectedOutput: '4', isHidden: false },
      { input: '3\n0 1 0',              expectedOutput: '2', isHidden: false },
      { input: '1\n0',                  expectedOutput: '1', isHidden: true  },
      { input: '6\n3 10 2 1 20 5',      expectedOutput: '3', isHidden: true  },
      { input: '5\n1 2 3 4 5',          expectedOutput: '5', isHidden: true  },
    ],
  },
  {
    title: 'Word Break',
    slug: 'word-break',
    difficulty: 'Hard', order: 17, tags: ['dynamic-programming', 'strings'],
    description: `## Word Break\n\nCan string s be segmented using dictionary words? Print \`YES\` or \`NO\`.\n\n### Input\nLine 1: s\nLine 2: N\nNext N lines: one word each\n\n### Example\n**Input:**\n\`\`\`\nleetcode\n2\nleet\ncode\n\`\`\`\n**Output:** \`YES\``,
    starterCode: `#include <iostream>\n#include <string>\n#include <vector>\n#include <unordered_set>\nusing namespace std;\n\nint main() {\n    string s; cin >> s;\n    int n; cin >> n;\n    unordered_set<string> dict;\n    for (int i = 0; i < n; i++) { string w; cin >> w; dict.insert(w); }\n    int len = s.size();\n    vector<bool> dp(len+1, false);\n    dp[0] = true;\n    // fill dp\n    cout << (dp[len] ? "YES" : "NO") << endl;\n    return 0;\n}`,
    testCases: [
      { input: 'leetcode\n2\nleet\ncode',          expectedOutput: 'YES', isHidden: false },
      { input: 'applepenapple\n2\napple\npen',      expectedOutput: 'YES', isHidden: false },
      { input: 'catsandog\n3\ncats\ndog\nsand',     expectedOutput: 'NO',  isHidden: true  },
      { input: 'cars\n2\ncar\ncars',                expectedOutput: 'YES', isHidden: true  },
      { input: 'hello\n1\nworld',                   expectedOutput: 'NO',  isHidden: true  },
    ],
  },
  {
    title: 'Number of Islands',
    slug: 'number-of-islands',
    difficulty: 'Hard', order: 18, tags: ['graphs', 'DFS'],
    description: `## Number of Islands\n\nCount islands in a 2D grid of 1s (land) and 0s (water).\n\n### Input\nLine 1: R C\nNext R lines: C space-separated integers (0 or 1)\n\n### Example\n**Input:**\n\`\`\`\n4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0\n\`\`\`\n**Output:** \`1\``,
    starterCode: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nvoid dfs(vector<vector<int>>& g, int r, int c) {\n    int R=g.size(), C=g[0].size();\n    if (r<0||r>=R||c<0||c>=C||g[r][c]==0) return;\n    g[r][c]=0;\n    dfs(g,r+1,c); dfs(g,r-1,c); dfs(g,r,c+1); dfs(g,r,c-1);\n}\n\nint main() {\n    int R, C; cin >> R >> C;\n    vector<vector<int>> g(R, vector<int>(C));\n    for (int i=0;i<R;i++) for (int j=0;j<C;j++) cin>>g[i][j];\n    int count = 0;\n    // count islands\n    cout << count << endl;\n    return 0;\n}`,
    testCases: [
      { input: '4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0', expectedOutput: '1', isHidden: false },
      { input: '4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1', expectedOutput: '3', isHidden: false },
      { input: '1 1\n1',                                             expectedOutput: '1', isHidden: true  },
      { input: '1 1\n0',                                             expectedOutput: '0', isHidden: true  },
      { input: '3 3\n1 0 1\n0 1 0\n1 0 1',                         expectedOutput: '5', isHidden: true  },
    ],
  },
  {
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    difficulty: 'Hard', order: 19, tags: ['arrays', 'two-pointers'],
    description: `## Trapping Rain Water\n\nGiven elevation heights, compute total water trapped.\n\n### Input\nLine 1: N\nLine 2: N heights\n\n### Example\n**Input:**\n\`\`\`\n12\n0 1 0 2 1 0 1 3 2 1 2 1\n\`\`\`\n**Output:** \`6\``,
    starterCode: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<int> h(n);\n    for (int i=0;i<n;i++) cin>>h[i];\n    int water = 0;\n    // two pointer approach\n    cout << water << endl;\n    return 0;\n}`,
    testCases: [
      { input: '12\n0 1 0 2 1 0 1 3 2 1 2 1', expectedOutput: '6', isHidden: false },
      { input: '6\n4 2 0 3 2 5',              expectedOutput: '9', isHidden: false },
      { input: '1\n0',                         expectedOutput: '0', isHidden: true  },
      { input: '3\n3 0 3',                     expectedOutput: '3', isHidden: true  },
      { input: '4\n0 1 0 2',                   expectedOutput: '1', isHidden: true  },
    ],
  },
  {
    title: 'Median of Two Sorted Arrays',
    slug: 'median-of-two-sorted-arrays',
    difficulty: 'Hard', order: 20, tags: ['arrays', 'binary-search'],
    description: `## Median of Two Sorted Arrays\n\nFind the median of two sorted arrays combined. Output as integer or decimal (e.g. \`2\` or \`2.5\`).\n\n### Input\nLine 1: N M\nLine 2: N sorted integers\nLine 3: M sorted integers\n\n### Example\n**Input:**\n\`\`\`\n2 2\n1 3\n2 4\n\`\`\`\n**Output:** \`2.5\``,
    starterCode: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n, m; cin >> n >> m;\n    vector<int> a(n), b(m);\n    for (int i=0;i<n;i++) cin>>a[i];\n    for (int i=0;i<m;i++) cin>>b[i];\n    vector<int> merged;\n    // merge and find median\n    double median = 0;\n    cout << median << endl;\n    return 0;\n}`,
    testCases: [
      { input: '2 2\n1 3\n2 4',   expectedOutput: '2.5', isHidden: false },
      { input: '2 1\n1 2\n3',     expectedOutput: '2',   isHidden: false },
      { input: '1 1\n1\n1',       expectedOutput: '1',   isHidden: true  },
      { input: '3 2\n1 3 5\n2 4', expectedOutput: '3',   isHidden: true  },
      { input: '1 3\n2\n1 3 4',   expectedOutput: '2.5', isHidden: true  },
    ],
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  await Problem.deleteMany({});
  await Problem.insertMany(problems);
  console.log(`✅ Seeded ${problems.length} problems`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });

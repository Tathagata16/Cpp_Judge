import { exec } from 'child_process';
import { writeFile, mkdir, rm } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

const TIMEOUT_MS = 5000; // 5 seconds max per test case
const TMP_DIR = '/tmp/cppjudge';

/**
 * Runs C++ code against an array of test cases.
 *
 * @param {string} code       - The C++ source code
 * @param {Array}  testCases  - [{ input: string, expectedOutput: string }]
 * @returns {{ passed: boolean, results: Array, error?: string }}
 */
export async function runCppCode(code, testCases) {
  const jobId = randomUUID();
  const jobDir = join(TMP_DIR, jobId);

  try {
    await mkdir(jobDir, { recursive: true });
    const srcFile = join(jobDir, 'solution.cpp');
    const binFile = join(jobDir, 'solution');
    await writeFile(srcFile, code);

    // ── Step 1: Compile ──────────────────────────────────
    const compileError = await compile(srcFile, binFile, jobDir);
    if (compileError) {
      return { passed: false, results: [], error: compileError };
    }

    // ── Step 2: Run each test case ───────────────────────
    const results = [];
    let allPassed = true;

    for (const tc of testCases) {
      const result = await runTestCase(binFile, tc.input, tc.expectedOutput, jobDir);
      results.push(result);
      if (!result.passed) allPassed = false;
    }

    return { passed: allPassed, results };
  } catch (err) {
    return { passed: false, results: [], error: err.message };
  } finally {
    // Cleanup temp files
    await rm(jobDir, { recursive: true, force: true });
  }
}

function compile(srcFile, binFile, jobDir) {
  return new Promise((resolve) => {
    // ── DOCKER version (recommended for production) ──────
    // Uncomment and use this in production for sandboxed execution:
    //
    // const cmd = `docker run --rm --network none --memory 256m \
    //   -v ${jobDir}:/code:rw alpine-cpp \
    //   g++ -o /code/solution /code/solution.cpp -std=c++17 2>&1`;
    //
    // ── Local version (for development) ─────────────────
    // Make sure g++ is installed: sudo apt install g++ (Linux)
    //                             brew install gcc (Mac)
    const cmd = `g++ -o ${binFile} ${srcFile} -std=c++17 2>&1`;

    exec(cmd, { timeout: 10000 }, (err, stdout) => {
      if (err) resolve(stdout || err.message);
      else resolve(null);
    });
  });
}

function runTestCase(binFile, input, expectedOutput, jobDir) {
  return new Promise((resolve) => {
    // ── DOCKER version (recommended for production) ──────
    // const cmd = `echo "${input}" | docker run --rm --network none \
    //   --memory 256m --cpus 0.5 -i -v ${jobDir}:/code:ro \
    //   alpine-cpp /code/solution`;
    //
    // ── Local version ────────────────────────────────────
    const cmd = `echo "${input.replace(/"/g, '\\"')}" | ${binFile}`;

    exec(cmd, { timeout: TIMEOUT_MS }, (err, stdout, stderr) => {
      if (err && err.killed) {
        return resolve({ passed: false, input, expected: expectedOutput, got: 'Time Limit Exceeded' });
      }
      if (err) {
        return resolve({ passed: false, input, expected: expectedOutput, got: stderr || 'Runtime Error' });
      }
      const got = stdout.trim();
      const expected = expectedOutput.trim();
      resolve({ passed: got === expected, input, expected, got });
    });
  });
}

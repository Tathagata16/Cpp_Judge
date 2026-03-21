//Judge0 api for execution


const JUDGE0_URL = "https://ce.judge0.com";
const CPP_LANGUAGE_ID = 54; // C++ (GCC 9.2.0)

export async function runCppCode(code, testCases) {
  try {
    const results = await Promise.all(
      testCases.map(tc => runTestCase(code, tc.input, tc.expectedOutput))
    );

    const compileError = results.find(r => r.isCompileError);
    if (compileError) {
      return { passed: false, results, error: compileError.error };
    }

    const allPassed = results.every(r => r.passed);
    return { passed: allPassed, results };
  } catch (err) {
    return { passed: false, results: [], error: err.message };
  }
}

async function runTestCase(code, input, expectedOutput) {
  const controller = new AbortController();
  const fetchTimer = setTimeout(() => controller.abort(), 15000);

  try {
    // Step 1: Submit to Judge0
    const submitRes = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        language_id: CPP_LANGUAGE_ID,
        source_code: code,
        stdin: input || "",
        cpu_time_limit: 2,
        memory_limit: 262144, // 256MB in KB
      }),
    });

    clearTimeout(fetchTimer);
    const data = await submitRes.json();

    // Status IDs: 3=Accepted, 4=Wrong Answer, 5=TLE, 6=Compile Error, 11=Runtime Error
    const statusId = data.status?.id;

    if (statusId === 6) {
      // Compile Error
      return {
        passed: false,
        input,
        expected: expectedOutput,
        got: "Compile Error",
        error: data.compile_output || "Compile Error",
        isCompileError: true,
      };
    }

    if (statusId === 5) {
      return {
        passed: false,
        input,
        expected: expectedOutput,
        got: "Time Limit Exceeded",
      };
    }

    if (statusId >= 7) {
      // Runtime errors (7-12)
      return {
        passed: false,
        input,
        expected: expectedOutput,
        got: "Runtime Error",
        error: data.stderr || "Runtime Error",
      };
    }

    const got = (data.stdout || "").trim();
    const expected = expectedOutput.trim();

    return { passed: got === expected, input, expected, got };

  } catch (err) {
    clearTimeout(fetchTimer);

    if (err.name === "AbortError") {
      return {
        passed: false,
        input,
        expected: expectedOutput,
        got: "Judge Unavailable (timeout)",
      };
    }

    return {
      passed: false,
      input,
      expected: expectedOutput,
      got: "Execution Error",
      error: err.message,
    };
  }
}
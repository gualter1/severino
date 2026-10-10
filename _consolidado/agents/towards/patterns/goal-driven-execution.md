# Goal-Driven Execution Guidelines
Based on Andrej Karpathy's observations on LLM coding pitfalls

## Core Principle
**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

### Goal Transformation Table
| Instead of... | Transform to... |
|--------------|-----------------|
| "Add validation" | "Write tests for invalid inputs, then make them pass" |
| "Fix the bug" | "Write a test that reproduces it, then make it pass" |
| "Refactor X" | "Ensure tests pass before and after" |

### Plan Structure for Multi-Step Tasks
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

### Strong vs Weak Success Criteria
- **Strong**: Let the LLM loop independently (e.g., "100 requests → first 10 succeed, rest get 429")
- **Weak**: "Make it work" requires constant clarification

### Example Progression: Rate Limiting
1. **Step 1**: Add basic in-memory rate limiting → Verify: 100 requests, first 10 succeed, rest get 429
2. **Step 2**: Extract to middleware → Verify: Rate limits apply to all endpoints, existing tests still pass
3. **Step 3**: Add Redis backend → Verify: Rate limit persists across app restarts
4. **Step 4**: Add configuration → Verify: Different rates per endpoint

### Test-First Verification Pattern
1. **Reproduce the bug first** — Write test that fails with the issue
2. **Verify** — Run test multiple times to confirm the bug
3. **Implement fix** — Make the test pass
4. **Verify no regression** — Ensure existing tests still pass

### Key Insight
LLMs are exceptionally good at looping until they meet specific goals. Don't tell it what to do — give it success criteria and watch it go.

---
*Guideline extracted from andrej-karpathy-skills repo. Score: 5/5 relevance.*
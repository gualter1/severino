# Surgical Changes Guidelines
Based on Andrej Karpathy's observations on LLM coding pitfalls

## Core Principle
**Touch only what you must. Clean up only your own mess.**

When editing existing code:

### Surgical Change Checklist
- [ ] Only change lines directly related to the reported issue
- [ ] Don't "improve" adjacent code, comments, or formatting
- [ ] Don't refactor things that aren't broken
- [ ] Match existing style, even if you'd do it differently

### When You Notice Orphans
- Remove imports/variables/functions that YOUR changes made unused
- Don't remove pre-existing dead code unless explicitly asked

### The Test: Every changed line should trace directly to the user's request.

### Common LLM Pitfalls (❌ vs ✅)

#### Drive-by Refactoring
```
❌ "Improves" email validation beyond the bug fix
   Adds username validation nobody asked for
   Changes comments
   Adds docstring

✅ Only changes the specific lines that fix the reported issue
```

#### Style Drift
```
❌ Changes quote style ('' to "")
   Adds type hints nobody asked for
   Reformats whitespace
   Changes boolean return logic

✅ Matches existing style: single quotes, no type hints if not used, existing patterns
```

### Red Flags
- Changing quote styles without request
- Adding type hints beyond what's existing in the codebase
- Reformatting whitespace "for consistency"
- Adding docstrings/comments orthogonal to the fix
- Return logic changes beyond the bug fix

---
*Guideline extracted from andrej-karpathy-skills repo. Score: 5/5 relevance.*
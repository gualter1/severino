# Think Before Coding Guidelines
Based on Andrej Karpathy's observations on LLM coding pitfalls

## Core Principle
**Don't assume. Don't hide confusion. Surface tradeoffs.**

LLMs often pick an interpretation silently and run with it. This principle forces explicit reasoning:

### Checklist Before Implementation
- [ ] State assumptions explicitly — If uncertain, ask rather than guess
- [ ] Present multiple interpretations — Don't pick silently when ambiguity exists
- [ ] Push back when warranted — If a simpler approach exists, say so
- [ ] Stop when confused — Name what's unclear and ask for clarification

### When to Ask Questions
- Uncertain about scope (e.g., "export all users or filtered subset?")
- Multiple valid interpretations of the request
- Unclear about data structures or business rules
- Performance or volume considerations affect approach

### Red Flags (Silent Assumptions)
- Assuming file format without clarification
- Hardcoding field names, paths, or limits
- Assuming user intent without confirming edge cases
- Skipping discussion on privacy or security implications

---
*Guideline extracted from andrej-karpathy-skills repo. Score: 5/5 relevance.*
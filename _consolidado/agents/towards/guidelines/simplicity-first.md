# Simplicity First Guidelines
Based on Andrej Karpathy's observations on LLM coding pitfalls

## Core Principle
**Minimum code that solves the problem. Nothing speculative.**

Combat the tendency toward overengineering:

### Anti-Patterns to Avoid
- ❌ Features beyond what was asked
- ❌ Abstractions for single-use code
- ❌ "Flexibility" or "configurability" that wasn't requested
- ❌ Error handling for impossible scenarios
- ❌ Complex patterns (strategy, factory, etc.) for trivial problems

### The Simplicity Test
> Would a senior engineer say this is overcomplicated? If yes, simplify.

### When to Add Complexity
Only when you actually need it. If the requirement emerges later, refactor then.

### Simple First Approach
1. Write the simplest possible function
2. Test it works
3. Only add complexity when the problem actually requires it

### Examples from the Wild
- **Discount calculation**: One function instead of strategy pattern for single use case
- **Save preferences**: Direct DB update instead of manager with cache, validator, notification
- **Search optimization**: Indexes before full Redis + async + monitoring stack

---
*Guideline extracted from andrej-karpathy-skills repo. Score: 5/5 relevance.*
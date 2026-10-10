# LLM Pitfalls and Fixes — Code Examples
Based on Andrej Karpathy's observations from andrej-karpathy-skills repo

## Collection of Anti-Patterns vs Correct Approaches

### 1. Hidden Assumptions in Export Function
**❌ What LLMs Do (Wrong Assumptions)**
```python
def export_users(format='json'):
    users = User.query.all()
    if format == 'json':
        with open('users.json', 'w') as f:
            json.dump([u.to_dict() for u in users], f)
    elif format == 'csv':
        ...
    return f"Exported {len(users)} users"
```
**Problems:**
- Assumes export ALL users (privacy, pagination?)
- Assumes file location
- Assumes which fields to include
- Assumes CSV fieldnames

**✅ What Should Happen**
```
Before implementing, I need to clarify:
1. Scope: Export all users or filtered subset?
2. Format: Download file? Background job? API endpoint?
3. Fields: Which user fields? (sensitive data?)
4. Volume: How many users typically?

Simplest approach: Add an API endpoint that returns paginated JSON.
```

### 2. Over-abstraction — Discount Calculation
**❌ What LLMs Do (Overengineered)**
```python
from abc import ABC, abstractmethod
from enum import Enum
from typing import Protocol, Union
from dataclasses import dataclass

class DiscountStrategy(ABC):
    @abstractmethod
    def calculate(self, amount: float) -> float:
        pass

class PercentageDiscount(DiscountStrategy):
    def __init__(self, percentage: float):
        self.percentage = percentage
    def calculate(self, amount: float) -> float:
        return amount * (self.percentage / 100)

class FixedDiscount(DiscountStrategy):
    def __init__(self, fixed_amount: float):
        self.fixed_amount = fixed_amount
    def calculate(self, amount: float) -> float:
        return min(self.fixed_amount, amount)

@dataclass
class DiscountConfig:
    strategy: DiscountStrategy
    min_purchase: float = 0.0
    max_discount: float = float('inf')

class DiscountCalculator:
    def __init__(self, config: DiscountConfig):
        self.config = config
    def apply_discount(self, amount: float) -> float:
        if amount < self.config.min_purchase:
            return 0
        discount = self.config.strategy.calculate(amount)
        return min(discount, self.config.max_discount)
```

**✅ What Should Happen (Simple)**
```python
def calculate_discount(amount: float, percent: float) -> float:
    """Calculate discount amount. percent should be 0-100."""
    return amount * (percent / 100)

# Usage
discount = calculate_discount(100.0, 10.0)  # $10 off
```

### 3. Speculative Features — Preference Manager
**❌ What LLMs Do (Unnecessary Features)**
```python
class PreferenceManager:
    def __init__(self, db, cache=None, validator=None):
        self.db = db
        self.cache = cache or InMemoryCache()
        self.validator = validator or DefaultValidator()
    def save(self, user_id: int, prefs: dict, merge=True, validate=True, notify=False) -> bool:
        # ... 30+ lines with cache, validation, notification
        pass
```

**✅ What Should Happen (Just What Was Asked)**
```python
def save_preferences(db, user_id: int, preferences: dict):
    """Save user preferences to database."""
    db.execute(
        "UPDATE users SET preferences = ? WHERE id = ?",
        (json.dumps(preferences), user_id)
    )
# Add later if needed: Caching, validation, merging
```

### 4. Drive-by Refactoring — Validator Bug Fix
**❌ What LLMs Do (Too Much)**
```diff
 def validate_user(user_data):
-    # Check email format
-    if not user_data.get('email'):
+     """Validate user data."""
+     email = user_data.get('email', '').strip()
+     
+     # Validate email
+     if not email:
           raise ValueError("Email required")
-    
-    # Basic email validation
-    if '@' not in user_data['email']:
+     if '@' not in email or '.' not in email.split('@')[1]:
           raise ValueError("Invalid email")
-     
-    # Check username
-    if not user_data.get('username'):
+     # Validate username
+     username = user_data.get('username', '').strip()
+     if not username:
           raise ValueError("Username required")
+     if len(username) < 3:
+         raise ValueError("Username too short")
+     if not username.isalnum():
+         raise ValueError("Username must be alphanumeric")
       
   return True
```

**Problems:**
- "Improved" email validation beyond the bug fix
- Added username validation nobody asked for
- Changed comments
- Added docstring

**✅ What Should Happen (Surgical)**
```diff
 def validate_user(user_data):
     # Check email format
-    if not user_data.get('email'):
+     email = user_data.get('email', '')
+     if not email or not email.strip():
           raise ValueError("Email required")
   
   # Basic email validation
-    if '@' not in user_data['email']:
+     if '@' not in email:
           raise ValueError("Invalid email")
   
   # Check username
   if not user_data.get('username'):
       raise ValueError("Username required")
   
   return True
```

**Only changed:** The specific lines that fix empty email handling.

### 5. Style Drift — Upload Function Logging
**❌ What LLMs Do (Reformat Everything)**
```diff
- def upload_file(file_path, destination):
+ def upload_file(file_path: str, destination: str) -> bool:
+     """Upload file to destination with logging."""
+     logger.info(f"Uploading {file_path} to {destination}")
+     
+   try:
-         with open(file_path, 'rb') as f:
-             data = f.read()
-         
-         response = requests.post(destination, files={'file': data})
-         
-         if response.status_code == 200:
-             return True
-         else:
-             return False
+         with open(file_path, "rb") as f:
+             data = f.read()
+         response = requests.post(destination, files={"file": data})
+         success = response.status_code == 200
+         
+         if success:
+             logger.info(f"Upload successful: {file_path}")
+         else:
+             logger.error(f"Upload failed: {file_path}, status={response.status_code}")
+         
+         return success
+       except Exception as e:
-         print(f"Error: {e}")
+         logger.exception(f"Upload error for {file_path}: {e}")
-           return False
```

**Problems:**
- Changed quote style ('' to "")
- Added type hints nobody asked for
- Added docstring
- Reformatted whitespace
- Changed boolean return logic

**✅ What Should Happen (Match Existing Style)**
```diff
+ import logging
+ 
+ logger = logging.getLogger(__name__)
+ 
   def upload_file(file_path, destination):
+     logger.info(f'Starting upload: {file_path}')
       try:
           with open(file_path, 'rb') as f:
               data = f.read()
           
           response = requests.post(destination, files={'file': data})
           
           if response.status_code == 200:
+             logger.info(f'Upload successful: {file_path}')
               return True
           else:
+             logger.error(f'Upload failed: {file_path}, status={response.status_code}')
               return False
       except Exception as e:
-         print(f"Error: {e}")
+         logger.exception(f'Upload error: {file_path}')
           return False
```

**Matched:** Single quotes, no type hints, existing boolean pattern, spacing style.

---
*Code examples extracted from andrej-karpathy-skills EXAMPLES.md repo. Score: 5/5 relevance for patterns.*
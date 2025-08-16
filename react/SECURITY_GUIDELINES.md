# 🔒 Security Guidelines for Fidelis React Project

## ⚠️ CRITICAL: Never Hardcode API Keys

### ❌ **NEVER DO THIS:**
```javascript
// DON'T: Hardcoded API keys
const supabase = createClient(
  'https://myrdvcihcqphixvunvkv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // NEVER!
);
```

### ✅ **ALWAYS DO THIS:**
```javascript
// DO: Use environment variables
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
```

## 📋 **Security Checklist for New Scripts**

Before creating any new migration/test/debug scripts:

- [ ] ✅ **Use `.env` variables** - Never hardcode keys
- [ ] ✅ **Check `.gitignore`** - Script patterns are blocked
- [ ] ✅ **Use descriptive names** - Avoid generic names like `script.js`
- [ ] ✅ **Add to temp folder** - Consider `temp/` directory for scripts
- [ ] ✅ **Delete when done** - Remove temporary scripts after use

## 🚫 **Files Automatically Ignored**

The `.gitignore` now blocks these patterns:
```
**/migrate-*.js
**/fix-*.js  
**/test-*.js
**/check-*.js
**/upload-*.js
**/debug-*.js
**/populate-*.js
```

## 🔑 **API Key Management**

### **Current Setup (Secure):**
- **Frontend**: `VITE_SUPABASE_ANON_KEY` (Publishable key)
- **Backend/Scripts**: `SUPABASE_SERVICE_ROLE_KEY` (Secret key)
- **System**: Modern Supabase Secret API keys (not legacy JWT)

### **Key Rotation Process:**
1. Generate new Secret API key in Supabase Dashboard
2. Update `.env` file with new key
3. Test functionality
4. Revoke old key (if possible)

## 🚨 **If API Keys Are Exposed:**

1. **Immediate Actions:**
   - Remove files from git: `git rm --cached filename.js`
   - Commit removal: `git commit -m "Remove exposed keys"`
   - Push: `git push origin branch-name`

2. **Rotate Keys:**
   - Supabase Dashboard → API Keys → Generate new Secret key
   - Update `.env` file
   - Test all functionality

3. **Verify Security:**
   - Check git history: `git log --oneline -10`
   - Confirm .gitignore: `cat react/.gitignore`
   - Test with new keys

## 👥 **Instructions for Future Agents**

### **Before Writing Scripts:**
1. Always check existing patterns in `.gitignore`
2. Use environment variables from `.env` 
3. Never include actual API keys in code
4. Test scripts locally before any commits

### **For Database Operations:**
```javascript
// Template for secure scripts
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
```

### **Red Flags to Watch For:**
- Any string starting with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`
- Hardcoded `https://` URLs with keys
- Scripts without `dotenv.config()`
- Files being committed that shouldn't be tracked

## 📞 **Emergency Contacts**

If security issues are discovered:
1. Stop all development immediately
2. Follow the exposure protocol above
3. Rotate keys as quickly as possible
4. Document the incident

---

**Remember: Security is everyone's responsibility. When in doubt, use environment variables and ask questions!** 🛡️

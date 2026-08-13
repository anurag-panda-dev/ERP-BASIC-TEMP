# MongoDB Connection Troubleshooting

## Error: `querySrv ECONNREFUSED`

This error means the MongoDB server is not responding to connection requests.

---

## Fix 1: Resume/Start Your Cluster (Most Common)

MongoDB Atlas auto-pauses free clusters after 15 days of inactivity.

### Steps:
1. Go to https://cloud.mongodb.com
2. Log in with your account
3. Click "Clusters" in the left sidebar
4. Find your cluster (looks like: `campusflow`)
5. If it shows **"PAUSED"** badge:
   - Click the three dots (...) menu
   - Click "Resume"
   - Wait 3-5 minutes for it to start
6. Status should change to **"RUNNING"** (green)

✅ **Try connecting again after cluster is running**

---

## Fix 2: Configure Network Access (Very Important)

Network access must be configured for your machine to connect.

### Steps:
1. Go to https://cloud.mongodb.com
2. Click "Network Access" in left sidebar
3. Click "Add IP Address"
4. Choose one option:

   **Option A (For Development):**
   - Click "Allow Access from Anywhere"
   - Enter: `0.0.0.0/0`
   - Click "Confirm"

   **Option B (More Secure):**
   - Find your public IP: https://www.whatismyipaddress.com/
   - Enter your IP address
   - Click "Confirm"

5. Wait for status to change to **"ACTIVE"** (green checkmark)

✅ **Try connecting again after network access is enabled**

---

## Fix 3: Verify Connection String Format

Make sure your `.env` has the correct format:

### Current `.env` Content:
```env
MONGODB_URI=mongodb+srv://aritra-erp:aritra-1234@campusflow.4v8e8la.mongodb.net/?appName=campusflow&retryWrites=true&w=majority
```

### Correct Format Should Be:
```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE?retryWrites=true&w=majority
```

### Your Values:
- ✅ Username: `aritra-erp`
- ✅ Password: `aritra-1234`
- ✅ Cluster: `campusflow.4v8e8la`
- ⚠️ Database name: Should add `/campusflow` before `?`

### Fixed Connection String:
```env
MONGODB_URI=mongodb+srv://aritra-erp:aritra-1234@campusflow.4v8e8la.mongodb.net/campusflow?retryWrites=true&w=majority
```

---

## Fix 4: Verify Database User Exists

Check if your database user is properly created:

### Steps:
1. Go to https://cloud.mongodb.com
2. Click "Database Access" in left sidebar
3. You should see user: `aritra-erp`
4. If not found:
   - Click "Add New Database User"
   - Username: `aritra-erp`
   - Password: `aritra-1234`
   - Role: Select "Admin"
   - Click "Add User"

---

## Fix 5: Special Characters in Password

If your password contains special characters, they must be URL-encoded:

| Character | URL Encoded |
|-----------|------------|
| `@` | `%40` |
| `:` | `%3A` |
| `/` | `%2F` |
| `#` | `%23` |
| `?` | `%3F` |
| `=` | `%3D` |

**Example:**
- Original password: `pass@word:123`
- URL-encoded: `pass%40word%3A123`
- Connection string: `mongodb+srv://user:pass%40word%3A123@cluster...`

Your password `aritra-1234` has no special characters, so no encoding needed. ✅

---

## Complete Troubleshooting Checklist

- [ ] **Cluster Status**
  - [ ] Go to MongoDB Atlas Clusters
  - [ ] Cluster status is "RUNNING" (green)
  - [ ] Not showing "PAUSED" badge

- [ ] **Network Access**
  - [ ] "Network Access" configured
  - [ ] Your IP added or 0.0.0.0/0 allowed
  - [ ] Shows green checkmark "ACTIVE"

- [ ] **Database User**
  - [ ] User exists: `aritra-erp`
  - [ ] Password is correct: `aritra-1234`
  - [ ] Role is set to "Admin"

- [ ] **Connection String**
  - [ ] Format: `mongodb+srv://user:pass@cluster.mongodb.net/database?retryWrites=true&w=majority`
  - [ ] No spaces in URL
  - [ ] No missing colons or slashes
  - [ ] Database name included

- [ ] **.env File**
  - [ ] `MONGODB_URI` correctly set
  - [ ] No quotes around value
  - [ ] No trailing/leading spaces

---

## Step-by-Step Video Guide Alternative

If you prefer visual guidance:
1. Search YouTube: "MongoDB Atlas setup 2024"
2. Follow any video about creating free cluster
3. Focus on: Network Access and Database User sections

---

## Test Connection

After making fixes, update `.env` and test:

```bash
npm run seed
```

You should see:
```
[INFO] ✅ MongoDB connected successfully
[INFO] 🌱 Starting database seeding...
```

---

## Quick Reference: MongoDB Atlas URLs

- **Main Dashboard**: https://cloud.mongodb.com
- **Clusters**: https://cloud.mongodb.com/v2/clusters
- **Network Access**: https://cloud.mongodb.com/v2/org/[org-id]/security/networkAccess
- **Database Access**: https://cloud.mongodb.com/v2/org/[org-id]/security/database/users

---

## Still Not Working?

If you've tried all fixes, provide this info:

1. **Cluster Status**: Running or Paused?
2. **Network IP**: What's your public IP from https://www.whatismyipaddress.com/?
3. **Error Message**: Full error from `npm run seed`
4. **Last 3 lines of error**: Copy from terminal

---

## Common Solutions Summary

| Problem | Solution |
|---------|----------|
| "PAUSED" cluster | Click Resume in MongoDB Atlas |
| Network refused | Add IP to "Network Access" |
| Auth failed | Check username/password match |
| DNS error | Wait 2-3 min after network config change |
| Timeout | Try 0.0.0.0/0 instead of specific IP |

---

**Next Steps:**
1. Check MongoDB Atlas dashboard
2. If cluster is PAUSED → Resume it
3. If Network Access missing → Add 0.0.0.0/0
4. Update `.env` with database name in connection string
5. Run `npm run seed` again

Good luck! 🚀

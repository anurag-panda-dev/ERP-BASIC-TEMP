# MongoDB Atlas Setup Guide for CampusFlow

## Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Sign up with:
   - Email
   - Password
   - Accept terms
   - Click "Create Account"

---

## Step 2: Create Organization & Project

1. After login, you'll see the onboarding page
2. Click "Create an Organization"
3. Name: `CampusFlow` (or your preferred name)
4. Click "Next"
5. Click "Create Organization"
6. Skip the "Invite team members" step
7. Click "Create Project"
8. Name: `CampusFlow` (or your preferred name)
9. Click "Create Project"

---

## Step 3: Create Database Cluster

1. After project creation, click "Build a Database"
2. Choose deployment option:
   - **Select: M0 (Free Tier)** ✅ (Recommended for development)
   - Features: 512MB storage, shared cluster
3. Click "Create"
4. Select your cloud provider:
   - **Cloud Provider**: AWS (or your preference)
   - **Region**: Choose nearest to you
     - US East: `us-east-1`
     - Europe: `eu-west-1`
     - Asia: `ap-southeast-1`
   - Click "Create Cluster"
   - **Wait 3-5 minutes for cluster to deploy**

---

## Step 4: Set Up Database Access (Username & Password)

1. In the left sidebar, click "Database Access"
2. Click "Add New Database User"
3. Fill in:
   - **Username**: `campusflow` (or your choice)
   - **Password**: Generate a strong password (or create custom)
     - ✅ **Copy this password somewhere safe!**
   - **Built-in Role**: Select "Admin"
4. Click "Add User"
5. Wait for user to be created (usually instant)

---

## Step 5: Configure Network Access

1. In the left sidebar, click "Network Access"
2. Click "Add IP Address"
3. Choose one of:
   - **Option A (Development)**: 
     - Click "Allow Access from Anywhere"
     - Enter `0.0.0.0/0` (allows all IPs)
     - **⚠️ Only for development, not production**
   - **Option B (Recommended)**: 
     - Enter your machine's public IP
     - Find your IP: https://www.whatismyipaddress.com/
4. Click "Confirm"
5. Click "Add Entry" if needed

---

## Step 6: Get Connection String

1. Go back to "Databases" in the left sidebar
2. Click "Connect" button on your cluster
3. Choose connection method:
   - Click "Drivers"
   - **Driver**: Node.js
   - **Version**: 4.x or higher
4. Copy the connection string (you'll see something like):
   ```
   mongodb+srv://campusflow:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
   ```

---

## Step 7: Create .env File

Create `.env` file in `server/` directory with:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://campusflow:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/campusflow?retryWrites=true&w=majority
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
JWT_EXPIRY=7d
BCRYPT_ROUNDS=10
```

### Replace these values:
- `YOUR_PASSWORD` - Database user password you created
- `YOUR_CLUSTER` - Your cluster name (e.g., `cluster0.mongodb.net`)
- `CLERK_PUBLISHABLE_KEY` - From Clerk dashboard
- `CLERK_SECRET_KEY` - From Clerk dashboard

---

## Step 8: Verify Connection

Run this command to test:
```bash
npm run seed
```

You should see:
```
✅ Connected to MongoDB
🌱 Starting database seeding...
```

---

## Connection String Format Explained

```
mongodb+srv://username:password@cluster.mongodb.net/database?options
└─ Protocol     └─ User credentials  └─ Cluster  └─ Database └─ Query params
```

- **mongodb+srv**: Secure connection protocol
- **username**: Your database user (e.g., `campusflow`)
- **password**: Database user password (URL-encoded)
- **cluster**: Your MongoDB Atlas cluster hostname
- **database**: Database name (optional, defaults to admin)
- **options**: Connection parameters (retryWrites, w=majority)

---

## Troubleshooting

### Error: "ECONNREFUSED"
**Cause**: Network access not configured
**Fix**: 
1. Go to "Network Access"
2. Make sure your IP is whitelisted
3. Or add `0.0.0.0/0` for development

### Error: "Invalid password"
**Cause**: Wrong password or special characters not escaped
**Fix**:
1. Check password is correct
2. If it has special characters, URL-encode it
3. Example: `@` becomes `%40`, `:` becomes `%3A`

### Error: "Database not found"
**Cause**: Database name in connection string doesn't exist
**Fix**:
1. MongoDB Atlas creates database automatically
2. Or remove database name from connection string
3. It will use `admin` database by default

### Error: "Authentication failed"
**Cause**: Invalid username/password
**Fix**:
1. Go to "Database Access"
2. Verify username and password
3. Create new user if needed

### Connection times out
**Cause**: Firewall or regional issues
**Fix**:
1. Try different AWS region
2. Check firewall settings
3. Try `0.0.0.0/0` temporarily to test

---

## MongoDB Atlas UI Tour

### Collections Tab
- Shows all collections in your database
- View documents
- Add/Edit/Delete data
- Monitor collection size

### Overview Tab
- Cluster status
- Connection info
- Performance metrics

### Backup Tab
- Automated backups
- Restore options
- Backup schedule

---

## Best Practices

✅ **Do:**
- Use strong passwords (20+ characters)
- Rotate credentials quarterly
- Use separate users for dev/production
- Enable two-factor authentication
- Monitor cluster usage
- Set up alerts

❌ **Don't:**
- Share passwords via email
- Use `0.0.0.0/0` in production
- Hardcode credentials in code
- Use same password for multiple services
- Grant unnecessary permissions

---

## Upgrade to Paid Plan (Optional)

When ready for production, upgrade from M0 to:

| Plan | Storage | Monthly Cost | Best For |
|------|---------|--------------|----------|
| M0 | 512 MB | Free | Development |
| M2 | 2 GB | $9 | Small production |
| M5 | 5 GB | $57 | Medium production |
| M10+ | 10+ GB | $95+ | Large production |

---

## What Gets Seeded

When you run `npm run seed`, it creates:
- ✅ 5 departments
- ✅ 15 faculty members (3 per dept)
- ✅ 250 students (50 per dept)
- ✅ 60 subjects
- ✅ 30 days of attendance records
- ✅ Multiple assessments with marks
- ✅ System notices
- ✅ Complete timetables

**Total data**: ~2,000+ documents

---

## Database Cleanup

To clear all data and start fresh:

```bash
# Delete everything and reseed
npm run seed

# Or manually:
# 1. Go to MongoDB Atlas Collections tab
# 2. Select each collection
# 3. Click "Drop Collection"
# 4. Run npm run seed again
```

---

## Monitoring & Alerts

In MongoDB Atlas dashboard:
1. Click "Alerts" (left sidebar)
2. Click "Create Alert"
3. Set up alerts for:
   - Cluster restart
   - Replica set issues
   - Disk usage
   - Connection errors

---

## Getting Clerk Keys

1. Go to https://dashboard.clerk.com
2. Sign in / Create account
3. Create new application
4. Get keys from "API Keys" section:
   - `CLERK_PUBLISHABLE_KEY` (starts with `pk_`)
   - `CLERK_SECRET_KEY` (starts with `sk_`)
5. Add to `.env` file

---

## Common .env Mistakes

❌ **Wrong format**:
```env
MONGODB_URI = mongodb+srv://...  # Remove spaces
MONGODB_URI='mongodb+srv://...'  # Remove quotes
MONGODB_URI="mongodb+srv://..."  # Remove quotes
```

✅ **Correct format**:
```env
MONGODB_URI=mongodb+srv://campusflow:password@cluster0.mongodb.net/campusflow?retryWrites=true&w=majority
```

---

## Quick Checklist

- [ ] Created MongoDB Atlas account
- [ ] Created cluster (M0 Free)
- [ ] Created database user (username/password)
- [ ] Configured network access (0.0.0.0/0 or your IP)
- [ ] Got connection string
- [ ] Created .env file in server/
- [ ] Filled in MONGODB_URI with correct credentials
- [ ] Filled in Clerk keys
- [ ] Tested: `npm run seed`
- [ ] See confirmation: "✅ Connected to MongoDB"

---

## Next Steps

After successful setup:

```bash
# 1. Verify connection
npm run seed

# 2. Start development server
npm run dev

# 3. Server should run on http://localhost:5000
# 4. Test endpoint: curl http://localhost:5000/health
```

---

## Support Resources

- MongoDB Docs: https://docs.mongodb.com
- MongoDB Atlas Help: https://www.mongodb.com/docs/atlas/
- Connection String Format: https://docs.mongodb.com/manual/reference/connection-string/
- Troubleshooting: https://www.mongodb.com/docs/atlas/troubleshoot-connection/

---

**Questions?** Refer to MongoDB Atlas documentation or check error logs in terminal.

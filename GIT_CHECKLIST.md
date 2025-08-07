# Git Commit Checklist for DeafSo Backend

## ✅ Files That SHOULD Be Committed

### 📁 Core Application Files
- `server.js` - Main application entry point
- `package.json` - Dependencies and scripts
- `README.md` - Project documentation
- `GIT_CHECKLIST.md` - This file

### 📁 Configuration Files
- `config/database.js` - Database configuration
- `lib/prisma.js` - Prisma client configuration

### 📁 Controllers
- `controllers/authController.js` - Authentication logic
- `controllers/dashboardController.js` - Dashboard operations

### 📁 Middleware
- `middleware/authMiddleware.js` - JWT authentication
- `middleware/errorMiddleware.js` - Error handling
- `middleware/validationMiddleware.js` - Input validation

### 📁 Routes
- `routes/authRoutes.js` - Authentication routes
- `routes/dashboardRoutes.js` - Dashboard routes

### 📁 Database Schema
- `prisma/schema.prisma` - Prisma schema definition
- `prisma/seed.js` - Database seeding script
- `database/postgres_schema.sql` - PostgreSQL schema
- `database/README.md` - Database documentation

### 📁 Testing
- `test-api.js` - API testing suite

### 📁 Git Configuration
- `.gitignore` - Git ignore rules

## ❌ Files That SHOULD NOT Be Committed

### 🔐 Environment & Secrets
- `.env` - Environment variables (contains secrets)
- `.env.local` - Local environment variables
- `.env.development` - Development environment
- `.env.production` - Production environment
- `.env.backup` - Environment backup files
- `*.env` - Any environment files

### 📦 Dependencies
- `node_modules/` - Node.js dependencies
- `package-lock.json` - Lock file (optional, but usually ignored)
- `yarn.lock` - Yarn lock file

### 📝 Logs & Runtime
- `logs/` - Application logs
- `*.log` - Log files
- `npm-debug.log*` - NPM debug logs
- `yarn-debug.log*` - Yarn debug logs

### 🗄️ Database Files
- `*.sqlite` - SQLite database files
- `*.sqlite3` - SQLite database files
- `*.db` - Database files

### 🔧 Generated Files
- `dist/` - Build output
- `build/` - Build output
- `.pm2/` - PM2 process files

### 💻 IDE & Editor Files
- `.vscode/` - VS Code settings
- `.idea/` - IntelliJ IDEA settings
- `*.swp` - Vim swap files
- `*.swo` - Vim swap files

### 🖥️ OS Files
- `.DS_Store` - macOS system files
- `Thumbs.db` - Windows thumbnail cache
- `desktop.ini` - Windows desktop settings

### 🔒 Security Files
- `*.pem` - SSL certificates
- `*.key` - Private keys
- `*.crt` - Certificates
- `*.csr` - Certificate signing requests

## 🚀 Recommended Git Commands

### Initial Setup
```bash
# Add all files that should be committed
git add .

# Check what will be committed
git status

# Make initial commit
git commit -m "Initial commit: DeafSo Backend API with Prisma and PostgreSQL"
```

### Regular Development
```bash
# Check status before committing
git status

# Add specific files
git add package.json
git add server.js
git add controllers/
git add middleware/
git add routes/

# Commit with descriptive message
git commit -m "feat: add student authentication endpoints"
```

### Before Pushing
```bash
# Check what files are staged
git diff --cached

# Verify no sensitive files are included
git ls-files | grep -E "\.(env|key|pem|crt)$"

# Push to remote
git push origin main
```

## 🔍 Verification Commands

### Check for Sensitive Files
```bash
# Check if .env is being tracked
git ls-files | grep "\.env"

# Check for any environment files
find . -name "*.env*" -type f

# Check for database files
find . -name "*.db" -o -name "*.sqlite*" -type f
```

### Check Git Status
```bash
# See what's tracked vs untracked
git status

# See what's staged for commit
git diff --cached --name-only

# See all tracked files
git ls-files
```

## ⚠️ Important Notes

1. **Never commit `.env` files** - They contain sensitive information
2. **Always check `git status`** before committing
3. **Use descriptive commit messages** following conventional commits
4. **Test your changes** before pushing to production
5. **Keep dependencies updated** but test thoroughly
6. **Document any new environment variables** in README.md

## 🆘 If You Accidentally Commit Sensitive Files

```bash
# Remove file from git tracking but keep it locally
git rm --cached .env

# Commit the removal
git commit -m "remove: accidentally committed .env file"

# Update .gitignore to prevent future commits
echo ".env" >> .gitignore

# Force push if already pushed to remote (be careful!)
git push origin main --force
``` 
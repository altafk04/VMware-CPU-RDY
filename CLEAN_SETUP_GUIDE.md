# Clean Uninstall & Repository Update Guide

This guide provides step-by-step instructions for completely removing your local installation and pulling the latest changes from the repository with a fresh setup.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Complete System Cleanup](#complete-system-cleanup)
- [Fresh Repository Clone](#fresh-repository-clone)
- [Dependency Installation](#dependency-installation)
- [Configuration Setup](#configuration-setup)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:
- Git installed (`git --version`)
- Node.js v18.0.0+ installed (`node --version`)
- Administrator/sudo access (may be needed for some operations)
- Internet connection for downloading dependencies

---

## Complete System Cleanup

### Step 1: Navigate to Your Project Directory

```bash
# Example - replace with your actual project path
cd ~/projects/VMware-CPU-RDY
# or
cd C:\Users\YourName\projects\VMware-CPU-RDY  # Windows
```

### Step 2: Remove Node Modules and Lock Files

Choose the command appropriate for your operating system:

#### **macOS / Linux (Bash/Zsh)**

```bash
# Remove all node_modules, lock files, and cache
rm -rf node_modules bun.lock package-lock.json yarn.lock
rm -rf .npm  # Clear npm cache
rm -rf dist  # Remove build artifacts
rm -rf .vite_cache  # Remove Vite cache

echo "✓ Cleanup complete: node_modules and lock files removed"
```

#### **Windows (PowerShell)**

```powershell
# Remove node_modules and lock files
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue node_modules, bun.lock, package-lock.json, yarn.lock, dist, .vite_cache

Write-Host "✓ Cleanup complete: node_modules and lock files removed"
```

#### **Windows (Command Prompt)**

```cmd
REM Remove node_modules and lock files
rmdir /s /q node_modules 2>nul
del /q bun.lock package-lock.json yarn.lock 2>nul
rmdir /s /q dist 2>nul
rmdir /s /q .vite_cache 2>nul

echo Cleanup complete: node_modules and lock files removed
```

### Step 3: Verify Cleanup

```bash
# Verify node_modules is gone
ls -la  # macOS/Linux
# or
dir     # Windows

# Should NOT see: node_modules, bun.lock, package-lock.json, yarn.lock
```

### Step 4: Optional - Clear Package Manager Cache

#### **For Bun:**
```bash
bun pm cache rm
```

#### **For npm:**
```bash
npm cache clean --force
```

#### **For yarn:**
```bash
yarn cache clean
```

---

## Fresh Repository Clone

### Step 1: Backup Current State (Optional)

If you want to preserve your `.env.local` file:

```bash
# Copy your environment file to a safe location
cp .env.local .env.local.backup  # macOS/Linux
# or
copy .env.local .env.local.backup  # Windows
```

### Step 2: Go to Parent Directory

```bash
cd ..  # Go up one level
```

### Step 3: Remove Entire Project Folder (Optional)

```bash
# Remove the entire local repository
rm -rf VMware-CPU-RDY  # macOS/Linux
# or
rmdir /s /q VMware-CPU-RDY  # Windows
```

### Step 4: Clone Fresh Repository

```bash
# Clone the latest version from GitHub
git clone https://github.com/altafk04/VMware-CPU-RDY.git
cd VMware-CPU-RDY
```

#### **Alternative: Clone with depth (faster)**

```bash
# Faster clone (without full history)
git clone --depth 1 https://github.com/altafk04/VMware-CPU-RDY.git
cd VMware-CPU-RDY
```

### Step 5: Verify Clone

```bash
# Check git status
git status

# Verify remote is correct
git remote -v

# Check current branch
git branch
```

---

## Dependency Installation

### Step 1: Install Dependencies

Choose your preferred package manager:

#### **Using Bun (Recommended)**

```bash
# Install all dependencies
bun install

# This will:
# - Read package.json
# - Download all dependencies
# - Create bun.lock
# - Install to node_modules/
```

#### **Using npm**

```bash
npm install
```

#### **Using yarn**

```bash
yarn install
```

### Step 2: Verify Installation

```bash
# List installed packages
bun ls  # or: npm list --depth=0

# Check Node version
node --version  # Should be v18.0.0+

# Check package manager version
bun --version   # if using Bun
npm --version   # if using npm
yarn --version  # if using yarn
```

---

## Configuration Setup

### Step 1: Restore or Create .env.local

#### **If you backed up .env.local:**

```bash
# Copy your backup
cp .env.local.backup .env.local  # macOS/Linux
# or
copy .env.local.backup .env.local  # Windows
```

#### **If creating new .env.local:**

```bash
# Copy from example
cp .env.example .env.local  # macOS/Linux
# or
copy .env.example .env.local  # Windows
```

### Step 2: Edit .env.local with Your Values

```bash
# Open with your favorite editor
nano .env.local      # macOS/Linux
# or
notepad .env.local   # Windows
```

Add your configuration:

```dotenv
# Required: Your Gemini API key
GEMINI_API_KEY="your_actual_api_key_here"

# Required: Application URL
APP_URL="http://localhost:3000"
```

### Step 3: Verify Environment Variables

```bash
# Verify the file exists and has content
cat .env.local        # macOS/Linux
# or
type .env.local       # Windows

# Should show your API key and APP_URL
```

---

## Verification

### Step 1: Type Checking

```bash
# Run TypeScript type checking
bun run lint
# or: npm run lint

# Should complete without errors
```

### Step 2: Build Test

```bash
# Build the project
bun run build
# or: npm run build

# Verify build succeeded and dist/ folder created
ls dist/  # macOS/Linux
# or
dir dist  # Windows
```

### Step 3: Start Development Server

```bash
# Start the development server
bun run dev
# or: npm run dev

# Wait for output like:
# VITE v6.2.3 ready in XX ms
# ➜  Local:   http://localhost:3000/
```

### Step 4: Test Application

```
1. Open browser: http://localhost:3000
2. Verify the application loads without errors
3. Check browser console for errors (F12)
4. Close server: Ctrl+C
```

---

## Verification Checklist

```
Before considering the setup complete:

□ node_modules folder exists and is populated
□ bun.lock (or package-lock.json/yarn.lock) exists
□ .env.local file exists with GEMINI_API_KEY set
□ git status shows clean working directory
□ bun run lint passes without errors
□ bun run build succeeds and creates dist/
□ bun run dev starts without errors
□ Application loads at http://localhost:3000
□ No console errors in browser DevTools
```

---

## Troubleshooting

### Issue: "node_modules still exists after cleanup"

**Solution:**
```bash
# Force remove with elevated privileges
sudo rm -rf node_modules  # macOS/Linux
# or run PowerShell as Administrator and use:
Remove-Item -Recurse -Force node_modules
```

### Issue: "Git clone fails - permission denied"

**Solution:**
```bash
# Use HTTPS instead of SSH (no key needed)
git clone https://github.com/altafk04/VMware-CPU-RDY.git

# Or configure SSH keys:
ssh-keygen -t ed25519 -C "your_email@example.com"
# Then add the public key to GitHub settings
```

### Issue: "bun install fails - connection timeout"

**Solution:**
```bash
# Try npm instead
npm install

# Or retry with:
bun install --timeout 60000

# Check internet connection
ping github.com
```

### Issue: ".env.local not being read"

**Solution:**
```bash
# Verify file exists in project root
ls .env.local  # macOS/Linux
# or
dir .env.local  # Windows

# Verify it has correct permissions (readable)
# Restart the development server after creating .env.local
```

### Issue: "Port 3000 already in use"

**Solution:**
```bash
# Kill process using port 3000 (macOS/Linux):
lsof -ti:3000 | xargs kill -9

# Or use different port (Windows/all):
# Edit vite.config.ts and change port to 3001:
# server: { port: 3001 }

# Then run:
bun run dev
```

### Issue: "TypeScript errors after update"

**Solution:**
```bash
# Clear TypeScript cache and reinstall
rm -rf node_modules/.vite  # macOS/Linux
bun install
bun run lint
```

### Issue: "Dependencies conflict after cleanup"

**Solution:**
```bash
# Completely remove and reinstall
rm -rf node_modules bun.lock package-lock.json yarn.lock
bun install  # Fresh install

# Or use different lock file:
npm install  # Uses npm, creates package-lock.json
```

---

## Summary of Clean Update Process

### Quick Reference Command

**macOS/Linux:**
```bash
# Complete clean install in one sequence
cd ~/projects/VMware-CPU-RDY && \
rm -rf node_modules bun.lock package-lock.json yarn.lock dist .vite_cache && \
cd .. && \
rm -rf VMware-CPU-RDY && \
git clone https://github.com/altafk04/VMware-CPU-RDY.git && \
cd VMware-CPU-RDY && \
cp .env.example .env.local && \
bun install && \
bun run lint && \
echo "✓ Clean setup complete!"
```

**Windows (PowerShell - Run as Administrator):**
```powershell
# Navigate to parent directory
cd $env:USERPROFILE\projects

# Remove old directory
Remove-Item -Recurse -Force VMware-CPU-RDY -ErrorAction SilentlyContinue

# Clone fresh repository
git clone https://github.com/altafk04/VMware-CPU-RDY.git
cd VMware-CPU-RDY

# Setup environment
Copy-Item .env.example .env.local
bun install
bun run lint

Write-Host "✓ Clean setup complete!"
```

---

## Additional Resources

- [Repository](https://github.com/altafk04/VMware-CPU-RDY)
- [README.md](https://github.com/altafk04/VMware-CPU-RDY/blob/main/README.md)
- [Git Documentation](https://git-scm.com/doc)
- [Node.js Documentation](https://nodejs.org/docs/)
- [Bun Package Manager](https://bun.sh/docs)

---

**Last Updated**: 2026-08-22
**Version**: 1.0.0
**Status**: Active
**Maintainer**: [altafk04](https://github.com/altafk04)

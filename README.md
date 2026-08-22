# CPU Analyzer - VMware CPU RDY Analysis Tool

A vSphere %RDY CPU Contention Analyzer & Virtual Machine Performance Diagnostic Suite powered by Google Gemini AI. This tool helps analyze CPU Ready time metrics and provides performance diagnostic[...]

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Getting Started](#getting-started)
- [System Requirements](#system-requirements)
- [Git Installation](#git-installation)
- [Dependencies](#dependencies)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Standard Operating Procedures (SOP)](#standard-operating-procedures-sop)
- [Project Structure](#project-structure)
- [Development](#development)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

The **CPU Analyzer** is a web-based application designed to help VMware administrators and DevOps engineers analyze CPU Ready (CPU RDY) metrics and performance contention in their virtualized envi[...]

### Key Features

- 📊 **Real-time CPU Analysis**: Analyze CPU Ready metrics for virtual machines
- 🤖 **AI-Powered Diagnostics**: Leverages Google Gemini AI for intelligent performance analysis
- 📈 **Interactive Dashboard**: Visual representation of performance data using Recharts
- 🔧 **Performance Tuning**: Get actionable recommendations for resolving CPU contention
- ⚡ **Modern Tech Stack**: Built with React, TypeScript, Vite, and TailwindCSS
- 🌐 **Cloud-Ready**: Deployable on Google Cloud Run

---

## Getting Started

### System Requirements

- **Node.js**: v18.0.0 or higher
- **Bun**: v1.0.0 or higher (recommended as package manager)
- **npm** or **yarn**: v6.0.0+ (alternative package managers)
- **Git**: For version control
- **Modern Web Browser**: Chrome, Firefox, Safari, or Edge (latest versions)

### Prerequisites

- Google Cloud Project with Gemini API enabled
- Valid Gemini API key
- Cloud Run access (for deployment)

---

## Git Installation

### Installing Git

Git is essential for cloning the repository. Follow the instructions for your operating system:

#### **Windows**

**Option 1: Using Git for Windows (Recommended)**
1. Visit [git-scm.com](https://git-scm.com/download/win)
2. Download the latest installer
3. Run the installer and follow the default prompts
4. Open Command Prompt or PowerShell
5. Verify installation:
   ```bash
   git --version
   ```

**Option 2: Using Chocolatey**
```bash
choco install git
```

**Option 3: Using Windows Package Manager**
```bash
winget install --id Git.Git -e --latest
```

#### **macOS**

**Option 1: Using Homebrew (Recommended)**
```bash
# Install Homebrew first if not installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Git
brew install git
```

**Option 2: Using MacPorts**
```bash
sudo port install git +svn +doc +bash_completion +gitweb
```

**Option 3: Using Xcode Command Line Tools**
```bash
xcode-select --install
```

**Verify installation:**
```bash
git --version
```

#### **Linux**

**Ubuntu/Debian**
```bash
sudo apt update
sudo apt install git
```

**Fedora/RHEL/CentOS**
```bash
sudo dnf install git
```

**Arch Linux**
```bash
sudo pacman -S git
```

**Verify installation:**
```bash
git --version
```

### Configure Git (After Installation)

After installing Git, configure your identity:

```bash
# Set your name
git config --global user.name "Your Name"

# Set your email
git config --global user.email "your.email@example.com"

# View your configuration
git config --global --list
```

---

## Dependencies

### Project Dependencies

This project uses the following key dependencies. All are specified in `package.json`:

#### **Core UI Framework**
| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.0.1 | UI framework for building interactive components |
| `react-dom` | ^19.0.1 | React DOM rendering for web applications |
| `typescript` | ~5.8.2 | TypeScript for type-safe JavaScript development |

#### **Build & Development Tools**
| Package | Version | Purpose |
|---------|---------|---------|
| `vite` | ^6.2.3 | Modern build tool and dev server |
| `@vitejs/plugin-react` | ^5.0.4 | React plugin for Vite |
| `esbuild` | ^0.25.0 | JavaScript bundler used by Vite |
| `tsx` | ^4.21.0 | TypeScript executor for Node.js |

#### **Styling & UI**
| Package | Version | Purpose |
|---------|---------|---------|
| `@tailwindcss/vite` | ^4.1.14 | TailwindCSS Vite integration |
| `tailwindcss` | ^4.1.14 | Utility-first CSS framework |
| `autoprefixer` | ^10.4.21 | PostCSS plugin for vendor prefixes |
| `lucide-react` | ^0.546.0 | Beautiful icon library for React |

#### **Data Visualization**
| Package | Version | Purpose |
|---------|---------|---------|
| `recharts` | ^3.10.1 | Composable charting library for React |

#### **Animation**
| Package | Version | Purpose |
|---------|---------|---------|
| `motion` | ^12.23.24 | Animation library for web and React |

#### **Backend & API**
| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^4.21.2 | Node.js web application framework |
| `@google/genai` | ^2.4.0 | Google Gemini AI API client |
| `dotenv` | ^17.2.3 | Load environment variables from .env files |

#### **Development Dependencies**
| Package | Version | Purpose |
|---------|---------|---------|
| `@types/node` | ^22.14.0 | TypeScript type definitions for Node.js |
| `@types/express` | ^4.17.21 | TypeScript type definitions for Express |

### Total Dependency Count
- **Direct Dependencies**: 12
- **Dev Dependencies**: 8
- **Total**: 20 packages

### Dependency Tree

```
VMware-CPU-RDY/
├── React Core
│   ├── react@^19.0.1
│   ├── react-dom@^19.0.1
│   └── @vitejs/plugin-react@^5.0.4
│
├── Build & Tooling
│   ├── vite@^6.2.3
│   ├── esbuild@^0.25.0
│   ├── tsx@^4.21.0
│   └── typescript@~5.8.2
│
├── Styling
│   ├── @tailwindcss/vite@^4.1.14
│   ├── tailwindcss@^4.1.14
│   ├── autoprefixer@^10.4.21
│   └── lucide-react@^0.546.0
│
├── Data & Visualization
│   └── recharts@^3.10.1
│
├── Animation
│   └── motion@^12.23.24
│
├── Backend
│   ├── express@^4.21.2
│   └── dotenv@^17.2.3
│
└── AI Integration
    └── @google/genai@^2.4.0
```

### Dependency Installation Order

The package manager will handle installation order automatically. When you run `bun install` or `npm install`, dependencies are installed in the following categories:

1. **Production dependencies** (required for runtime)
2. **Development dependencies** (required for development)
3. **Lock file** is generated to ensure consistent versions

---

## Installation

### 1. Clone the Repository

Before cloning, ensure Git is installed. Then run:

```bash
git clone https://github.com/altafk04/VMware-CPU-RDY.git
cd VMware-CPU-RDY
```

**Clone Options:**

```bash
# Clone with depth (faster for large repos)
git clone --depth 1 https://github.com/altafk04/VMware-CPU-RDY.git

# Clone to a specific directory
git clone https://github.com/altafk04/VMware-CPU-RDY.git my-project-name

# Clone with branch
git clone -b main https://github.com/altafk04/VMware-CPU-RDY.git
```

### 2. Install Node.js and Package Manager

**Install Node.js** (if not already installed):

- **Windows/macOS**: Download from [nodejs.org](https://nodejs.org/) (LTS version recommended)
- **Linux**: Use your package manager (see Git installation section for commands)

**Install Bun** (recommended package manager):
```bash
# Using npm
npm install -g bun

# Using curl
curl -fsSL https://bun.sh/install | bash

# Using Homebrew (macOS)
brew install oven-sh/bun/bun
```

**Or use npm/yarn** (already bundled with Node.js):
```bash
# Verify npm
npm --version

# Verify yarn (if installed)
yarn --version
```

### 3. Install Project Dependencies

Navigate to the project directory and install all dependencies:

**Using Bun (recommended):**
```bash
bun install
```

**Or using npm:**
```bash
npm install
```

**Or using yarn:**
```bash
yarn install
```

This command will:
- Read `package.json`
- Download all dependencies (production and dev)
- Generate a lock file (`bun.lock`, `package-lock.json`, or `yarn.lock`)
- Install all packages in `node_modules/`

### 4. Verify Installation

Verify that all tools are correctly installed:

```bash
# Check Node.js version (v18.0.0+)
node --version

# Check npm version (v6.0.0+)
npm --version

# Check Bun version (v1.0.0+)
bun --version

# Check Git version
git --version

# List installed project dependencies
bun ls
# or
npm list --depth=0
```

### 5. Expected Output

After successful installation, you should see:
```
✓ Node.js v18.x.x or higher
✓ npm/Bun/Yarn installed
✓ Git configured
✓ node_modules/ directory created
✓ Package lock file generated
✓ All dependencies listed in package.json installed
```

### Complete Installation Checklist

- [ ] Git installed and configured
- [ ] Node.js v18.0.0+ installed
- [ ] Package manager (Bun/npm/yarn) installed
- [ ] Repository cloned successfully
- [ ] All dependencies installed (`bun install` completed)
- [ ] Environment variables configured (see Configuration section)
- [ ] API keys obtained (see Prerequisites section)

---

## Configuration

### Environment Variables

1. **Copy the example environment file**:
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local` with your settings**:
   ```dotenv
   # GEMINI_API_KEY: Required for Gemini AI API calls
   # Obtain this from Google Cloud Console
   GEMINI_API_KEY="your_gemini_api_key_here"
   
   # APP_URL: The URL where this application is hosted
   # For local development: http://localhost:3000
   # For production: https://your-cloud-run-url.com
   APP_URL="http://localhost:3000"
   ```

### Environment Variable Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `GEMINI_API_KEY` | Yes | Google Gemini API key for AI features | `AIzaSyD...` |
| `APP_URL` | Yes | Application URL for self-referential links and OAuth callbacks | `http://localhost:3000` |

---

## Usage

### Local Development

#### Start Development Server

```bash
bun run dev
```

The application will start at `http://localhost:3000`

#### Build for Production

```bash
bun run build
```

#### Preview Production Build

```bash
bun run preview
```

#### Type Checking

```bash
bun run lint
```

#### Clean Build Artifacts

```bash
bun run clean
```

### Application Features

1. **Upload CPU Metrics**: Import CPU RDY data for analysis
2. **Run Diagnosis**: Process metrics through Gemini AI
3. **View Recommendations**: Get detailed performance tuning suggestions
4. **Export Results**: Save analysis reports

---

## Standard Operating Procedures (SOP)

### SOP 1: Initial Setup and Configuration

**Objective**: Properly configure the application for operational use

**Steps**:
1. Clone the repository to your deployment environment
2. Install Git if not already installed
3. Install Node.js v18.0.0 or higher
4. Install dependencies using `bun install`
5. Configure environment variables in `.env.local`
6. Verify Gemini API key validity
7. Test API connectivity: `bun run lint`
8. Start the development server: `bun run dev`
9. Verify the application loads at http://localhost:3000

**Validation**: Application loads without errors and UI is accessible

---

### SOP 2: Daily Operations

**Objective**: Operate the CPU Analyzer tool for performance diagnostics

**Pre-Checks**:
- Verify environment variables are correctly set
- Check Gemini API service status
- Ensure sufficient API quota

**Procedure**:
1. Access the application at configured APP_URL
2. Upload or input CPU RDY metrics
3. Select virtual machines for analysis
4. Execute AI-powered diagnostic analysis
5. Review recommendations and performance insights
6. Document findings and actions taken
7. Export report if needed

**Post-Checks**:
- Verify all recommendations logged
- Confirm no API errors occurred
- Backup analysis reports

---

### SOP 3: Performance Monitoring and Optimization

**Objective**: Monitor application health and optimize performance

**Monitoring Tasks** (Daily):
- Check application response times
- Monitor API usage and quota consumption
- Verify error logs for issues
- Monitor CPU and memory usage

**Optimization Steps** (Weekly):
1. Review slow operation logs
2. Optimize database queries if applicable
3. Clear old cached data
4. Update dependencies: `bun update`
5. Run type checking: `bun run lint`
6. Test with sample datasets

---

### SOP 4: Deployment to Production

**Objective**: Deploy application to Google Cloud Run

**Prerequisites**:
- Google Cloud Project access
- `gcloud` CLI installed and authenticated
- Application builds successfully
- All tests pass

**Deployment Steps**:
1. Build the application:
   ```bash
   bun run build
   ```

2. Verify build output in `dist/` directory

3. Deploy to Cloud Run:
   ```bash
   gcloud run deploy cpu-analyzer \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars GEMINI_API_KEY=<your_key>,APP_URL=<cloud_run_url>
   ```

4. Verify deployment:
   - Test the Cloud Run URL
   - Check logs: `gcloud run logs read cpu-analyzer`

5. Update DNS/routing if needed

6. Notify stakeholders of deployment

**Post-Deployment**:
- Monitor error rates
- Check API quotas
- Verify performance metrics
- Document deployment details

---

### SOP 5: Troubleshooting and Support

**Objective**: Diagnose and resolve issues

**Common Issues**:

| Issue | Cause | Solution |
|-------|-------|----------|
| Git not found | Git not installed | Install Git from git-scm.com or package manager |
| Cannot clone repo | SSH key issues | Use HTTPS URL or configure SSH keys |
| Module not found | Dependencies not installed | Run `bun install` or `npm install` |
| API Key Error | Invalid or missing GEMINI_API_KEY | Verify API key in Google Cloud Console |
| Connection Timeout | Network issues or service down | Check APP_URL configuration |
| Build Failures | Dependency issues | Run `bun install` and `bun run clean` |
| Performance Slow | High API load | Check quota usage, optimize queries |
| Type Errors | TypeScript compilation issues | Run `bun run lint` and fix errors |

**Troubleshooting Steps**:
1. Verify Git is installed: `git --version`
2. Verify Node.js is installed: `node --version`
3. Check environment variables: `echo $GEMINI_API_KEY`
4. Verify network connectivity
5. Check application logs
6. Review error messages
7. Test with sample data
8. Restart application services

**Escalation**:
- Contact Google Cloud Support for API issues
- Review GitHub issues for known problems
- Submit bug reports with reproduction steps

---

### SOP 6: Maintenance and Updates

**Objective**: Keep application secure and up-to-date

**Weekly Maintenance**:
- Update dependencies: `bun update`
- Review security advisories
- Check for deprecated libraries
- Run type checking: `bun run lint`

**Monthly Maintenance**:
- Full dependency audit
- Performance review
- Log analysis
- Backup critical data

**Quarterly Maintenance**:
- Major version updates
- Infrastructure review
- Capacity planning
- Security audit

---

## Project Structure

```
VMware-CPU-RDY/
├── src/                          # Source code
│   └── components/               # React components
│   └── pages/                    # Page components
│   └── services/                 # API and utility services
│   └── types/                    # TypeScript type definitions
│   └── App.tsx                   # Main application component
│   └── main.tsx                  # Entry point
├── assets/                       # Static assets (images, icons, etc.)
├── public/                       # Public files
├── dist/                         # Production build output
├── index.html                    # HTML entry point
├── package.json                  # Project dependencies
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts                # Vite configuration
├── tailwind.config.ts            # TailwindCSS configuration
├── .env.example                  # Example environment variables
├── .gitignore                    # Git ignore rules
├── bun.lock                      # Bun lock file
└── README.md                     # This file
```

---

## Development

### Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.0.1 | UI framework |
| TypeScript | ~5.8.2 | Type safety |
| Vite | 6.2.3 | Build tool |
| TailwindCSS | 4.1.14 | Styling |
| Recharts | 3.10.1 | Data visualization |
| Express | 4.21.2 | Backend server |
| Gemini API | 2.4.0 | AI analysis |

### Development Commands

```bash
# Start development server (port 3000)
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Type checking
bun run lint

# Clean build artifacts
bun run clean

# Update dependencies
bun update

# List dependencies
bun ls
```

---

## Uninstall & Update Commands

This project supports common package managers (Bun, npm, yarn). Use the commands below to update or uninstall dependencies and to remove installed artifacts.

Uninstall (remove installed dependencies and lockfiles):

- Bun / macOS / Linux (POSIX shells):
```bash
rm -rf node_modules bun.lock package-lock.json yarn.lock && echo "Removed node_modules and lock files"
```

- npm / macOS / Linux (POSIX shells):
```bash
rm -rf node_modules package-lock.json && echo "Removed node_modules and package-lock.json"
```

- yarn / macOS / Linux (POSIX shells):
```bash
rm -rf node_modules yarn.lock && echo "Removed node_modules and yarn.lock"
```

- Windows (PowerShell):
```powershell
Remove-Item -Recurse -Force node_modules, package-lock.json, yarn.lock, bun.lock
Write-Host "Removed node_modules and lock files"
```

Run the repository-provided uninstall script (if you prefer the npm/bun script):

```bash
# Using Bun
bun run uninstall

# Using npm
npm run uninstall

# Using yarn
yarn run uninstall
```

Update (upgrade dependencies):

- Bun (recommended):
```bash
bun update
```

- npm:
```bash
npm update
```

- yarn:
```bash
yarn upgrade
```

Run the repository-provided update script:

```bash
# Using Bun
bun run update

# Using npm
npm run update

# Using yarn
yarn run update
```

Notes:
- Removing `node_modules` and lock files is destructive and will require reinstalling dependencies (`bun install` / `npm install` / `yarn install`) to restore the project.
- For cross-platform scripting in CI or dev environments, prefer platform-aware tools like `rimraf` (not included here) or run commands inside a POSIX shell.

---

## Deployment

### Local Deployment

```bash
bun run build
bun run preview
```

### Cloud Run Deployment

See **SOP 4: Deployment to Production** above.

### Environment-Specific Configurations

**Development**:
```
APP_URL=http://localhost:3000
GEMINI_API_KEY=<your_dev_key>
```

**Production**:
```
APP_URL=https://your-cloud-run-url.com
GEMINI_API_KEY=<your_prod_key>
```

---

## Troubleshooting

### Common Issues and Solutions

**Issue**: "git: command not found" or "Git is not installed"
- **Solution**: Install Git from [git-scm.com](https://git-scm.com) or your OS package manager

**Issue**: "Cannot find module '@google/genai'"
- **Solution**: Run `bun install` to install all dependencies

**Issue**: "Gemini API key is invalid"
- **Solution**: Verify your API key in Google Cloud Console

**Issue**: Application won't start
- **Solution**: Check port 3000 is available, review error logs

**Issue**: Type errors during build
- **Solution**: Run `bun run lint` and fix TypeScript errors

**Issue**: Slow performance
- **Solution**: Check API quotas, optimize queries, review server logs

### Getting Help

1. Check this README for common solutions
2. Review the project's GitHub Issues
3. Check Google Cloud Run documentation
4. Contact project maintainer: [altafk04](https://github.com/altafk04)

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Run type checking: `bun run lint`
5. Commit with clear messages: `git commit -m "Add feature description"`
6. Push to your fork: `git push origin feature/your-feature`
7. Submit a Pull Request

### Development Guidelines

- Write TypeScript for all code
- Follow existing code style
- Add type definitions for new code
- Test your changes locally
- Update documentation as needed

---

## License

This project is open source. Please check the LICENSE file for details.

---

## Support and Contact

- **Repository**: [altafk04/VMware-CPU-RDY](https://github.com/altafk04/VMware-CPU-RDY)
- **Issues**: [GitHub Issues](https://github.com/altafk04/VMware-CPU-RDY/issues)
- **Author**: [altafk04](https://github.com/altafk04)

---

## Quick Reference

### Essential Commands

```bash
# Git
git clone https://github.com/altafk04/VMware-CPU-RDY.git
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Installation
bun install          # Install all dependencies
bun update          # Update all dependencies
bun ls              # List installed packages

# Development
bun run dev          # Start dev server at http://localhost:3000
bun run lint         # Type check
bun run build        # Production build

# Cleanup
bun run clean        # Remove build artifacts
```

### Key Files

- `.env.local` - Environment configuration (create from .env.example)
- `package.json` - Project dependencies and scripts
- `src/` - Application source code
- `dist/` - Production build output
- `node_modules/` - Installed dependencies

### Dependency Installation Troubleshooting

| Error | Solution |
|-------|----------|
| `npm ERR! code EACCES` | Use `sudo` or fix npm permissions |
| `ENOTFOUND registry.npmjs.org` | Check internet connection and npm registry |
| `Module not found` | Run `bun install` or `npm install` again |
| `Package-lock.json conflicts` | Delete `node_modules/` and lock file, then reinstall |

---

**Last Updated**: 2026-08-22
**Version**: 1.0.1
**Status**: Active
**Maintainer**: [altafk04](https://github.com/altafk04)

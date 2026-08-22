# CPU Analyzer - VMware CPU RDY Analysis Tool

A vSphere %RDY CPU Contention Analyzer & Virtual Machine Performance Diagnostic Suite powered by Google Gemini AI. This tool helps analyze CPU Ready time metrics and provides performance diagnostic recommendations for VMware virtual machines.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Getting Started](#getting-started)
- [System Requirements](#system-requirements)
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

The **CPU Analyzer** is a web-based application designed to help VMware administrators and DevOps engineers analyze CPU Ready (CPU RDY) metrics and performance contention in their virtualized environments. 

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

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/altafk04/VMware-CPU-RDY.git
cd VMware-CPU-RDY
```

### 2. Install Dependencies

Using Bun (recommended):
```bash
bun install
```

Or using npm:
```bash
npm install
```

Or using yarn:
```bash
yarn install
```

### 3. Verify Installation

```bash
bun --version  # or npm --version / yarn --version
node --version
```

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
2. Install dependencies using `bun install`
3. Configure environment variables in `.env.local`
4. Verify Gemini API key validity
5. Test API connectivity: `bun run lint`
6. Start the development server: `bun run dev`
7. Verify the application loads at http://localhost:3000

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
| API Key Error | Invalid or missing GEMINI_API_KEY | Verify API key in Google Cloud Console |
| Connection Timeout | Network issues or service down | Check APP_URL configuration |
| Build Failures | Dependency issues | Run `bun install` and `bun run clean` |
| Performance Slow | High API load | Check quota usage, optimize queries |
| Type Errors | TypeScript compilation issues | Run `bun run lint` and fix errors |

**Troubleshooting Steps**:
1. Check environment variables: `echo $GEMINI_API_KEY`
2. Verify network connectivity
3. Check application logs
4. Review error messages
5. Test with sample data
6. Restart application services

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
```

### Code Style

- Use TypeScript for type safety
- Follow React best practices
- Use functional components and hooks
- Style with TailwindCSS utilities
- Keep components modular and reusable

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

**Issue**: "Cannot find module '@google/genai'"
- **Solution**: Run `bun install` to install dependencies

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
# Installation
bun install

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

---

**Last Updated**: 2026-08-22
**Version**: 1.0.0
**Status**: Active

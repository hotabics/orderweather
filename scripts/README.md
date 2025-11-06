# Scripts

Utility scripts for OrderWeather development.

## Available Scripts

### setup.sh

Sets up the development environment:
- Installs backend dependencies
- Installs frontend dependencies
- Creates .env files from templates
- Checks for required tools

**Usage:**
```bash
./scripts/setup.sh
```

### start-dev.sh

Starts both backend and frontend in development mode:
- Starts MongoDB (via docker-compose if needed)
- Starts backend server on port 5000
- Starts frontend on port 3000

**Usage:**
```bash
./scripts/start-dev.sh
```

**Stop:** Press Ctrl+C

### test-api.sh

Tests API endpoints:
- Health check
- Create order
- Get order
- Get user orders

**Prerequisites:**
- Backend must be running
- MongoDB must be running

**Usage:**
```bash
./scripts/test-api.sh
```

## Requirements

- Bash shell
- Node.js and npm
- MongoDB or Docker
- jq (for test-api.sh - `brew install jq` or `apt install jq`)

## Notes

- Make sure scripts are executable: `chmod +x scripts/*.sh`
- Scripts should be run from the project root directory
- Edit .env files with your API keys after running setup.sh

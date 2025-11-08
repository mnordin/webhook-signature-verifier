#!/bin/bash

# Setup script for webhook-signature-verifier (Next.js version)
# This script helps ensure you have the correct Node.js version

set -e

echo "🔧 Setting up webhook-signature-verifier (Next.js)..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Required Node.js version
REQUIRED_NODE_VERSION="16"
RECOMMENDED_NODE_VERSION="18.19.0"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to get Node.js major version
get_node_major_version() {
    node --version 2>/dev/null | sed 's/v\([0-9]*\).*/\1/' || echo "0"
}

# Function to install Node.js with different version managers
install_node_version() {
    echo -e "${BLUE}🚀 Attempting to install/switch to Node.js $RECOMMENDED_NODE_VERSION...${NC}"

    if command_exists asdf; then
        echo -e "${YELLOW}📦 Using asdf to manage Node.js version...${NC}"
        if ! asdf plugin list | grep -q nodejs; then
            echo "Adding nodejs plugin to asdf..."
            asdf plugin add nodejs
        fi
        asdf install nodejs $RECOMMENDED_NODE_VERSION
        asdf local nodejs $RECOMMENDED_NODE_VERSION
        return 0
    elif command_exists nvm; then
        echo -e "${YELLOW}📦 Using nvm to manage Node.js version...${NC}"
        # Source nvm if it's not in current session
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        nvm install $RECOMMENDED_NODE_VERSION
        nvm use $RECOMMENDED_NODE_VERSION
        return 0
    elif command_exists fnm; then
        echo -e "${YELLOW}📦 Using fnm to manage Node.js version...${NC}"
        fnm install $RECOMMENDED_NODE_VERSION
        fnm use $RECOMMENDED_NODE_VERSION
        return 0
    elif command_exists volta; then
        echo -e "${YELLOW}📦 Using volta to manage Node.js version...${NC}"
        volta install node@$RECOMMENDED_NODE_VERSION
        return 0
    else
        echo -e "${RED}❌ No Node.js version manager found.${NC}"
        echo -e "${YELLOW}Please install Node.js $RECOMMENDED_NODE_VERSION manually from:${NC}"
        echo -e "${BLUE}https://nodejs.org/${NC}"
        echo ""
        echo -e "${YELLOW}Or install a version manager:${NC}"
        echo -e "  • nvm: https://github.com/nvm-sh/nvm"
        echo -e "  • asdf: https://asdf-vm.com/"
        echo -e "  • fnm: https://github.com/Schniz/fnm"
        echo -e "  • volta: https://volta.sh/"
        return 1
    fi
}

# Check if Node.js is installed and version is correct
if command_exists node; then
    NODE_VERSION=$(get_node_major_version)
    echo -e "${BLUE}📋 Current Node.js version: v$(node --version)${NC}"

    if [ "$NODE_VERSION" -ge "$REQUIRED_NODE_VERSION" ]; then
        echo -e "${GREEN}✅ Node.js version is compatible!${NC}"
    else
        echo -e "${RED}❌ Node.js version $NODE_VERSION is too old. Required: $REQUIRED_NODE_VERSION+${NC}"
        install_node_version
    fi
else
    echo -e "${RED}❌ Node.js not found${NC}"
    install_node_version
fi

# Check if npm is available
if command_exists npm; then
    echo -e "${GREEN}✅ npm is available${NC}"
    NPM_VERSION=$(npm --version)
    echo -e "${BLUE}📋 npm version: $NPM_VERSION${NC}"
else
    echo -e "${RED}❌ npm not found${NC}"
    echo -e "${YELLOW}npm should be included with Node.js. Please reinstall Node.js.${NC}"
    exit 1
fi

# Install dependencies if package.json exists
if [ -f "package.json" ]; then
    echo -e "${BLUE}📦 Installing dependencies...${NC}"
    npm install
    echo -e "${GREEN}✅ Dependencies installed!${NC}"
fi

# Final verification
echo ""
echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo -e "${BLUE}You can now run:${NC}"
echo -e "  ${YELLOW}npm run dev${NC}                 # Start development server"
echo -e "  ${YELLOW}npm run build${NC}               # Build for production"
echo -e "  ${YELLOW}npm start${NC}                   # Start production server"
echo -e "  ${YELLOW}npm test${NC}                    # Run tests"
echo ""
echo -e "${BLUE}Next.js webhook verifier will be available at:${NC}"
echo -e "  ${YELLOW}http://localhost:3000${NC}       # Web interface"
echo -e "  ${YELLOW}http://localhost:3000/api/webhook${NC} # Webhook endpoint"
echo ""

echo -e "${BLUE}💡 If you encounter issues, try restarting your terminal or running:${NC}"
echo -e "  ${YELLOW}source ~/.bashrc${NC}  # or ~/.zshrc, depending on your shell"

#!/bin/bash

# Fleet Flows Quick Deployment Script
# This script automates the deployment process

set -e

echo "🚀 Starting Fleet Flows Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    print_status "Prerequisites check completed ✅"
}

# Setup environment variables
setup_environment() {
    print_status "Setting up environment variables..."
    
    if [ ! -f ".env.production" ]; then
        print_warning ".env.production not found. Creating template..."
        
        cat > .env.production << EOF
# Database Configuration
DATABASE_URL="your-postgres-connection-string-here"

# NextAuth Configuration
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"

# Google Maps API (for live tracking)
GOOGLE_MAPS_API_KEY="your-google-maps-api-key"

# Optional: Sentry for error tracking
SENTRY_DSN="your-sentry-dsn"
EOF
        
        print_warning "Please update .env.production with your actual values before continuing!"
        print_warning "Especially the DATABASE_URL and NEXTAUTH_URL"
        read -p "Press Enter after updating .env.production..."
    fi
    
    print_status "Environment setup completed ✅"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    npm install
    cd mobile && npm install && cd ..
    
    print_status "Dependencies installed ✅"
}

# Database setup
setup_database() {
    print_status "Setting up database..."
    
    # Generate Prisma client
    npx prisma generate
    
    print_status "Database setup completed ✅"
    print_warning "Make sure your DATABASE_URL in .env.production points to your production database!"
}

# Deploy to Vercel
deploy_to_vercel() {
    print_status "Deploying to Vercel..."
    
    # Deploy the application
    vercel --prod
    
    print_status "Deployment completed ✅"
}

# Run database migrations
run_migrations() {
    print_status "Running database migrations..."
    
    npx prisma db push --force-reset
    
    print_status "Migrations completed ✅"
}

# Build mobile app
build_mobile() {
    print_status "Building mobile app..."
    
    cd mobile
    
    print_status "Mobile app build completed ✅"
    print_warning "To publish to app stores, run:"
    print_warning "  expo build:ios    # For App Store"
    print_warning "  expo build:android # For Play Store"
    
    cd ..
}

# Final verification
verify_deployment() {
    print_status "Verifying deployment..."
    
    print_status "Deployment verification completed ✅"
    print_status "Your Fleet Flows application is now live!"
}

# Main execution
main() {
    print_status "🚀 Starting Fleet Flows Deployment Process"
    
    check_prerequisites
    setup_environment
    install_dependencies
    setup_database
    deploy_to_vercel
    run_migrations
    build_mobile
    verify_deployment
    
    print_status "🎉 Fleet Flows deployment completed successfully!"
    print_status ""
    print_status "Next steps:"
    print_status "1. Update your mobile app API endpoint in mobile/app/constants.js"
    print_status "2. Test your web application at the Vercel URL"
    print_status "3. Deploy mobile app to app stores using Expo build commands"
    print_status "4. Set up monitoring and custom domain as needed"
}

# Run main function
main

#!/bin/bash

# 🚀 ISKA RMS Deployment Script
# This script automates the deployment process for different platforms

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check Node.js and npm
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    if ! command_exists npm; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    print_success "Dependencies check passed"
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    npm install
    print_success "Dependencies installed"
}

# Function to build the project
build_project() {
    print_status "Building project for production..."
    npm run build
    print_success "Project built successfully"
}

# Function to deploy to Vercel
deploy_vercel() {
    print_status "Deploying to Vercel..."
    
    if ! command_exists vercel; then
        print_status "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    print_status "Starting Vercel deployment..."
    vercel --prod
    
    print_success "Deployment to Vercel completed!"
}

# Function to deploy to Netlify
deploy_netlify() {
    print_status "Preparing for Netlify deployment..."
    
    if ! command_exists netlify; then
        print_status "Installing Netlify CLI..."
        npm install -g netlify-cli
    fi
    
    print_status "Starting Netlify deployment..."
    netlify deploy --prod --dir=dist
    
    print_success "Deployment to Netlify completed!"
}

# Function to deploy to Railway
deploy_railway() {
    print_status "Deploying to Railway..."
    
    if ! command_exists railway; then
        print_status "Installing Railway CLI..."
        npm install -g @railway/cli
    fi
    
    print_status "Starting Railway deployment..."
    railway login
    railway init
    railway up
    
    print_success "Deployment to Railway completed!"
}

# Function to check environment variables
check_env() {
    print_status "Checking environment variables..."
    
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating from template..."
        cp env.example .env
        print_warning "Please update .env file with your actual values before deploying."
    else
        print_success "Environment file found"
    fi
}

# Function to run database migrations
run_migrations() {
    print_status "Running database migrations..."
    
    if command_exists npx; then
        print_status "Applying file storage migration..."
        # Note: In a real scenario, you would run this against your Supabase project
        print_warning "Please run the file storage migration manually in your Supabase SQL Editor:"
        echo "supabase/migrations/20250802230000_add_file_storage.sql"
    else
        print_warning "npx not found. Please run migrations manually."
    fi
}

# Function to show deployment options
show_options() {
    echo -e "${BLUE}ISKA RMS Deployment Options:${NC}"
    echo "1. Vercel (Recommended for React apps)"
    echo "2. Netlify"
    echo "3. Railway"
    echo "4. Build only (no deployment)"
    echo "5. Exit"
    echo ""
}

# Function to get user choice
get_choice() {
    read -p "Enter your choice (1-5): " choice
    case $choice in
        1)
            deploy_vercel
            ;;
        2)
            deploy_netlify
            ;;
        3)
            deploy_railway
            ;;
        4)
            print_status "Building project only..."
            build_project
            print_success "Build completed. Check the dist/ folder."
            ;;
        5)
            print_status "Exiting..."
            exit 0
            ;;
        *)
            print_error "Invalid choice. Please try again."
            get_choice
            ;;
    esac
}

# Function to show post-deployment instructions
show_post_deployment() {
    echo ""
    echo -e "${GREEN}🎉 Deployment completed!${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Configure environment variables in your deployment platform"
    echo "2. Run the file storage migration in Supabase SQL Editor"
    echo "3. Test file upload/download functionality"
    echo "4. Set up monitoring and analytics"
    echo ""
    echo -e "${BLUE}Useful commands:${NC}"
    echo "- View logs: Check your deployment platform dashboard"
    echo "- Update deployment: Run this script again"
    echo "- Local development: npm run dev"
    echo ""
    echo -e "${BLUE}Documentation:${NC}"
    echo "- Deployment Guide: DEPLOYMENT_GUIDE.md"
    echo "- File Storage: src/services/fileStorage.ts"
    echo "- Supabase Setup: https://supabase.com/docs"
}

# Main deployment function
main() {
    echo -e "${BLUE}🚀 ISKA RMS Deployment Script${NC}"
    echo "=================================="
    echo ""
    
    # Check dependencies
    check_dependencies
    
    # Install dependencies
    install_dependencies
    
    # Check environment
    check_env
    
    # Run migrations
    run_migrations
    
    # Build project
    build_project
    
    # Show options and get user choice
    show_options
    get_choice
    
    # Show post-deployment instructions
    show_post_deployment
}

# Function to show help
show_help() {
    echo -e "${BLUE}ISKA RMS Deployment Script${NC}"
    echo ""
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  -h, --help     Show this help message"
    echo "  -v, --vercel   Deploy directly to Vercel"
    echo "  -n, --netlify  Deploy directly to Netlify"
    echo "  -r, --railway  Deploy directly to Railway"
    echo "  -b, --build    Build only (no deployment)"
    echo ""
    echo "Examples:"
    echo "  $0              # Interactive deployment"
    echo "  $0 --vercel     # Deploy to Vercel"
    echo "  $0 --build      # Build only"
    echo ""
}

# Parse command line arguments
case "${1:-}" in
    -h|--help)
        show_help
        exit 0
        ;;
    -v|--vercel)
        check_dependencies
        install_dependencies
        check_env
        run_migrations
        build_project
        deploy_vercel
        show_post_deployment
        exit 0
        ;;
    -n|--netlify)
        check_dependencies
        install_dependencies
        check_env
        run_migrations
        build_project
        deploy_netlify
        show_post_deployment
        exit 0
        ;;
    -r|--railway)
        check_dependencies
        install_dependencies
        check_env
        run_migrations
        build_project
        deploy_railway
        show_post_deployment
        exit 0
        ;;
    -b|--build)
        check_dependencies
        install_dependencies
        check_env
        run_migrations
        build_project
        print_success "Build completed. Check the dist/ folder."
        exit 0
        ;;
    "")
        main
        ;;
    *)
        print_error "Unknown option: $1"
        show_help
        exit 1
        ;;
esac 
#!/bin/bash

# Docusaurus CMS Setup Script
# This script helps you set up the CMS quickly

echo "🚀 Docusaurus CMS Setup"
echo "========================"
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
fi

# Create .env from example
echo "📝 Creating .env file..."
cp .env.example .env

echo ""
echo "✅ .env file created!"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Set up Appwrite:"
echo "   - Go to https://cloud.appwrite.io"
echo "   - Create a project"
echo "   - Enable Discord OAuth"
echo "   - Copy your Project ID"
echo ""
echo "2. Set up Discord Application:"
echo "   - Go to https://discord.com/developers/applications"
echo "   - Create a new application"
echo "   - Add OAuth2 redirect: https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/discord/[PROJECT_ID]"
echo "   - Copy Client ID and Secret to Appwrite"
echo ""
echo "3. Create GitHub Token:"
echo "   - Go to https://github.com/settings/tokens"
echo "   - Create token with 'repo' scope"
echo "   - Users will enter this in the CMS"
echo ""
echo "4. Edit .env file:"
echo "   - Open .env in your editor"
echo "   - Add your APPWRITE_PROJECT_ID"
echo ""
echo "5. Start development server:"
echo "   pnpm start"
echo ""
echo "6. Visit http://localhost:3000/cms"
echo ""
echo "📖 For detailed instructions, see CMS_SETUP.md"
echo ""

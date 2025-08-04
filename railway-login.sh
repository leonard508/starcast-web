#!/bin/bash
export RAILWAY_CLI_PATH="/mnt/c/Users/Admin/AppData/Roaming/npm/node_modules/@railway/cli/bin/railway.exe"
echo "Railway CLI is installed at: $RAILWAY_CLI_PATH"
echo "To login to Railway, please run the following command manually:"
echo ""
echo '$RAILWAY_CLI_PATH login'
echo ""
echo "This will open your browser to authenticate with Railway."
echo "After logging in, you can verify with:"
echo '$RAILWAY_CLI_PATH whoami'
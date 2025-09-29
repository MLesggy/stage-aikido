#!/bin/bash

# Color for terminal because we're fancy
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if silent mode is requested
SILENT_MODE=false
if [ "$1" = "--silent" ]; then
  SILENT_MODE=true
  echo -e "${YELLOW}Running in silent mode. Only essential messages will be displayed.${NC}"
fi

echo -e "${GREEN}Starting app...${NC}"

# Kill all process when exiting
cleanup() {
  echo -e "\n${GREEN}Stopping process...${NC}"
  kill $CLIENT_PID $SERVER_PID $MAILDEV_PID 2>/dev/null
  exit 0
}

# Intercepting ctrl + c
trap cleanup SIGINT SIGTERM

# Starting MailDev
echo -e "${BLUE}Starting MailDev...${NC}"
if [ "$SILENT_MODE" = true ]; then
  maildev --web 1080 --smtp 1025 --ip 127.0.0.1 2>&1 | grep -E "(MailDev|starting|listening|Error)" &
else
  maildev --web 1080 --smtp 1025 --ip 127.0.0.1 &
fi
MAILDEV_PID=$!

# Wait for MailDev to start properly
echo -e "${BLUE}Waiting for MailDev to start (5 seconds)...${NC}"
sleep 5

# Starting Angular client
echo -e "${BLUE}Starting Angular client...${NC}"
if [ "$SILENT_MODE" = true ]; then
  cd ./client && ng serve 2>&1 | grep -E "(Compiled successfully|Error)" &
else
  cd ./client && ng serve &
fi
CLIENT_PID=$!

# Starting Node.js server
echo -e "${BLUE}Starting Node.js server...${NC}"
if [ "$SILENT_MODE" = true ]; then
  cd ./server && NODE_ENV=development node --watch src/server.js 2>&1 | grep -E "(listening on port|Error|Exception)" &
else
  cd ./server && NODE_ENV=development node --watch src/server.js &
fi
SERVER_PID=$!

echo -e "${GREEN}The 3 services are up and running...${NC}"
echo -e "${YELLOW}MailDev Web UI: http://localhost:1080${NC}"
echo -e "${YELLOW}Angular Client: http://localhost:4200${NC}"
echo -e "${YELLOW}Node.js Server: http://localhost:8000${NC}"
echo -e "${GREEN}Press CTRL+C to exit.${NC}"

# Waiting for user to kill the process
wait
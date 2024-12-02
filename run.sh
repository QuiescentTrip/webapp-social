#!/bin/bash

# Function to check and run npm install if needed
check_and_install_npm() {
    if [ ! -d "frontend/node_modules" ]; then
        echo "Running npm install in the frontend directory..."
        (cd frontend && npm install)
    fi
}

# Function to check and run database migrations if needed
check_and_run_migrations() {
    if [ ! -f "./SocialMediaApi/socialmedia.db" ]; then
        echo "Database file not found. Running migrations..."
        (cd SocialMediaApi && dotnet ef migrations add DBinit && dotnet ef database update)
    fi
}

# Function to run commands in a new tmux pane
run_command() {
    tmux split-window -h
    tmux send-keys "$1" C-m
}

# Start a new tmux session
tmux new-session -d -s webapp_social

# Always run both frontend and backend
check_and_install_npm
check_and_run_migrations
tmux send-keys "cd frontend && npm run dev" C-m
run_command "cd SocialMediaApi && dotnet watch run"

# Attach to the tmux session
tmux attach-session -t webapp_social

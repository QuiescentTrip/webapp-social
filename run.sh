#!/bin/bash

# Function to run commands in a new tmux pane
run_command() {
    tmux split-window -h
    tmux send-keys "$1" C-m
}

# Start a new tmux session
tmux new-session -d -s webapp_social

# Navigate to the frontend directory and run npm run dev
tmux send-keys "cd frontend && npm run dev" C-m

# Run the SocialMediaApi in a new pane
run_command "cd SocialMediaApi && dotnet watch run"

# Attach to the tmux session
tmux attach-session -t webapp_social
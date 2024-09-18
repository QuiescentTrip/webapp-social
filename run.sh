#!/bin/bash

# Check if gum is installed
if ! command -v gum &> /dev/null; then
    echo "Error: gum is not installed. Please install it first."
    echo "To install gum, visit: https://github.com/charmbracelet/gum#installation"
    echo "If you are on a Mac: 'brew install gum'"
    echo "If you are on Linux: 'sudo apt-get install gum' or 'sudo pacman -S gum'"
    exit 1
fi

# Function to check and run npm install if needed
check_and_install_npm() {
    if [ ! -d "frontend/node_modules" ]; then
        echo "Running npm install in the frontend directory..."
        (cd frontend && npm install)
    fi
}

# Function to run commands in a new tmux pane
run_command() {
    tmux split-window -h
    tmux send-keys "$1" C-m
}

# Start a new tmux session
tmux new-session -d -s webapp_social

# Use gum to choose which components to run
CHOICE=$(gum choose --header "Do you want to run the frontend or backend?" --item.foreground 250 "Both (Recommended)" "Frontend" "Backend")

case $CHOICE in
    "Frontend")
        check_and_install_npm
        tmux send-keys "cd frontend && npm run dev" C-m
        ;;
    "Backend")
        tmux send-keys "cd SocialMediaApi && dotnet watch run" C-m
        ;;
    "Both (Recommended)")
        check_and_install_npm
        tmux send-keys "cd frontend && npm run dev" C-m
        run_command "cd SocialMediaApi && dotnet watch run"
        ;;
    *)
        echo "Invalid choice. Exiting."
        tmux kill-session -t webapp_social
        exit 1
        ;;
esac

# Attach to the tmux session
tmux attach-session -t webapp_social
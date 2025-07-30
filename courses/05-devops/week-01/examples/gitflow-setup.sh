#!/bin/bash

# GitFlow Setup Script
# Minimal example for Week 1

echo "Setting up GitFlow workflow..."

# Initialize GitFlow with default branch names
git flow init -d

# Create a sample feature branch
git flow feature start sample-feature

# Make a sample change
echo "# Sample Feature" > feature.md
git add feature.md
git commit -m "feat: add sample feature"

# Finish the feature branch
git flow feature finish sample-feature

echo "GitFlow setup complete!"
echo "Main branch: $(git branch --show-current)" 
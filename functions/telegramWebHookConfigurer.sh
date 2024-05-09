#!/bin/bash

set_webhook() {
    # Construct the URL with the provided token and URL
    webhook_url="https://api.telegram.org/bot${1}/setwebhook?url=${2}"
    # Send the curl request to set the webhook URL
    curl -X POST "$webhook_url"
}

# Main function
main() {
    # Take input from the user
    read -p "Enter your Telegram bot token: " token
    read -p "Enter the URL you want to set as webhook: " url

    # Call the function to set the webhook
    set_webhook "$token" "$url"
}

# Call the main function
main

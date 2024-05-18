# pylint: disable=missing-function-docstring, missing-module-docstring

import os

import psycopg2
from azure.core.credentials import AzureKeyCredential
from azure.eventgrid import EventGridEvent, EventGridPublisherClient

EVENT_VERSION = "1.0"

def create_event(data):
    event_grid_event = EventGridEvent(
        subject="shodan/webhook",
        event_type="Shodan.NewEvent",
        data=data,
        data_version=EVENT_VERSION
    )
    return event_grid_event

def search_chat_id(ip):
    with psycopg2.connect(os.environ["POSTGRESQLCONNSTR_MAIN"]) as conn:
        # Use the cursor as a context manager
        with conn.cursor() as cursor:
            cursor.execute("SELECT token FROM telegram_ip WHERE ip = %s", (ip))
            token = cursor.fetchall()
            return token

def send_value(data):
    key = os.environ["EVENTGRID_KEY"]
    endpoint = os.environ["EVENTGRID_ENDPOINT"]
    credential = AzureKeyCredential(key)
    client = EventGridPublisherClient(endpoint, credential)

    ip = data["ip_str"]
    message = data["data"]

    chat_ids = search_chat_id(ip)
    message_data = map(lambda x: {"token": x, "message": message, "ip": ip}, chat_ids)
    events = map(create_event, message_data)

    # Send the event
    client.send(events)

import os
from datetime import datetime

from azure.core.credentials import AzureKeyCredential
from azure.eventgrid import EventGridEvent, EventGridPublisherClient


def send_value(data):
        key = os.environ["EVENTGRID_KEY"]
        endpoint = os.environ["EVENTGRID_ENDPOINT"]
        event = {
        "data": data,
        "timestamp": datetime.now()
        }

        credential = AzureKeyCredential(key)
        client = EventGridPublisherClient(endpoint, credential)

        # Create an EventGridEvent object
        event_grid_event = EventGridEvent(
            subject="shodan/subject",
            event_type="Shodan.Test",
            data=event,
            data_version="1.1"
        )

        # Send the event
        client.send(event_grid_event)
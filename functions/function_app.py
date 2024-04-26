import logging
import os
from datetime import datetime

import azure.functions as func
from azure.core.credentials import AzureKeyCredential
from azure.eventgrid import EventGridEvent, EventGridPublisherClient

app = func.FunctionApp()

def send_event(data):
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

@app.function_name(name="ShodanProducer")
@app.route(route="publish", auth_level=func.AuthLevel.ANONYMOUS)
def ShodanProducer(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    try:
        logging.info(req.get_json())
        data = req.get_json()
        send_event(data)
        return func.HttpResponse(
            "This HTTP triggered function executed successfully.",
            status_code=200
            )
    except Exception as err:
        return func.HttpResponse(
            f"Error: {err}",
            status_code=500
            )

@app.function_name(name="ShodanConsumer")
@app.event_grid_trigger(arg_name="azeventgrid")
def ShodanConsumer(azeventgrid: func.EventGridEvent):
    logging.info('Python EventGrid trigger processed an event')
    logging.info(azeventgrid.get_json())
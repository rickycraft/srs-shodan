# pylint: disable=missing-function-docstring, missing-module-docstring

import json
import logging
import urllib.request

import azure.functions as func
import producer

app = func.FunctionApp()
WEBHOOK_URL = "https://webhook.rroveri.com/azure"

@app.function_name(name="ShodanProducer")
@app.route(route="publish", auth_level=func.AuthLevel.ANONYMOUS)
def shodan_producer(req: func.HttpRequest) -> func.HttpResponse:
    logging.debug('Python HTTP trigger function processed a request.')
    try:
        data = req.get_json()
        logging.info(json.dumps(data, indent=2))
        producer.send_value(data)
        return func.HttpResponse(
            "This HTTP triggered function executed successfully.\n",
            status_code=200
            )
    except Exception as err:
        return func.HttpResponse(
            f"Error: {err}",
            status_code=500
            )

@app.function_name(name="ShodanConsumer")
@app.event_grid_trigger(arg_name="azeventgrid")
def shodan_consumer(azeventgrid: func.EventGridEvent):
    logging.debug('Python EventGrid trigger processed an event\n')
    data = azeventgrid.get_json()
    logging.info(json.dumps(data, indent=2))

    json_data = json.dumps(data).encode('utf-8')
    req = urllib.request.Request(WEBHOOK_URL, data=json_data, method='POST')
    req.add_header('Content-Type', 'application/json')
    with urllib.request.urlopen(req) as response:
        res = response.read()
        logging.info(res)

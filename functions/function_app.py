import json
import logging
import urllib.request

import azure.functions as func
import producer

app = func.FunctionApp()
webhook_url = "https://webhook.rroveri.com/azure"

@app.function_name(name="ShodanProducer")
@app.route(route="publish", auth_level=func.AuthLevel.ANONYMOUS)
def ShodanProducer(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    try:
        logging.info(req.get_json())
        data = req.get_json()
        producer.send_value(data)
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
    data = azeventgrid.get_json()
    logging.info(data)

    json_data = json.dumps(data).encode('utf-8')
    req = urllib.request.Request(webhook_url, data=json_data, method='POST')
    req.add_header('Content-Type', 'application/json')
    with urllib.request.urlopen(req) as response:
        res = response.read()
        logging.info(res)
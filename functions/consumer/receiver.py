import logging

import azure.functions as func

app = func.FunctionApp()

@app.queue_trigger(arg_name="azqueue", queue_name="queuename",
                               connection="AzureWebJobsStorage")
def queue_trigger1(azqueue: func.QueueMessage):
    logging.info('Python Queue trigger processed a message: %s',
                azqueue.get_body().decode('utf-8'))


@app.event_grid_trigger(arg_name="azeventgrid")
def EventGridTrigger1(azeventgrid: func.EventGridEvent):
    logging.info('Python EventGrid trigger processed an event!')
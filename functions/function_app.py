import json
import logging
import os

import azure.functions as func
import producer
import shodan_api
import telebot
import util

app = func.FunctionApp()
bot = telebot.TeleBot(os.environ["TELEGRAM_API_KEY"])

@app.function_name(name="ShodanProducer")
@app.route(route="publish", auth_level=func.AuthLevel.ANONYMOUS)
def shodan_producer(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('ShodanProducer function processed a request.')
    try:
        logging.info('raw request:\n%s', json.dumps(req.get_json(), indent=2))
        logging.info('headers:\n%s', list(req.headers.items()))
        data = req.get_json()
        producer.send_value(data)

        return func.HttpResponse(
            "ShodanProducer OK\n",
            status_code=200
            )
    except Exception as err:
        logging.error("Error: %s", err)
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

    try:
        # Extract necessary information from the event data
        chat_id = data["chat_id"]  # Ensure this environment variable is set
        text = data["message"]
        ip = data["ip"]
        # Send the message using the Telegram bot
        if chat_id:
            messages = util.tokenize_text(text)
            bot.send_message(chat_id,"New message from Shodan for "+ip)
            for message in messages:
                bot.send_message(chat_id, message)
            logging.info("Message sent to Telegram chat ID %s", chat_id)
        else:
            logging.error("Json error: No Chatid Defined")

    except Exception as e:
        logging.error("Error processing event grid event: %s", e)


@app.function_name(name="Startcommand")
@app.route(route="StartCommand", auth_level=func.AuthLevel.ANONYMOUS)
def start_command(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    data = req.get_json()
    chat_id = data['message']['chat']['id']
    text = data['message']['text']

    if text == '/start':
        bot.send_message(chat_id, "Qui ci sarà il link di registrazione")
    else:
        bot.send_message(chat_id, chat_id)

    return func.HttpResponse("OK",status_code=200)

@app.function_name(name="AuthTest")
@app.route(route="AuthTest", auth_level=func.AuthLevel.FUNCTION)
def auth_test(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('AuthTest success for %s', req.url)
    return func.HttpResponse("OK",status_code=200)

@app.function_name(name="ShodanAPI")
@app.route(route="ShodanAPI", auth_level=func.AuthLevel.FUNCTION)
def shodan_alert_api(req: func.HttpRequest) -> func.HttpResponse:
    ip = req.params.get('ip')
    if not ip:
        return shodan_api.handle_list()
    logging.info('ShodanAPI method %s ip %s', req.method, ip)
    aid = shodan_api.check_alert(ip)
    # handle different http methods
    match req.method:
        case 'GET':
            return shodan_api.handle_get(ip, aid)
        case 'POST':
            return shodan_api.handle_post(ip, aid)
        case 'DELETE':
            return shodan_api.handle_delete(ip, aid)

    return func.HttpResponse("Not supported http method",status_code=405)

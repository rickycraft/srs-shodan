# pylint: disable=missing-function-docstring, missing-module-docstring

import json
import logging
import os
import re
import urllib.request
import urllib
import urllib.parse
import psycopg2
from psycopg2 import OperationalError

import azure.functions as func
import producer
import telebot

app = func.FunctionApp()
bot = telebot.TeleBot(os.environ["TELEGRAM_API_KEY"])


def extract_components(parse_result):
    # Extract user, password, and sslmode from query string
    query_params = urllib.parse.parse_qs(parse_result.query)
    user = query_params.get('user', [None])[0]
    password = query_params.get('password', [None])[0]
    sslmode = query_params.get('sslmode', [None])[0]
    
    # Extract host and port from netloc
    netloc_parts = parse_result.netloc.split(':')
    host = netloc_parts[0] if len(netloc_parts) > 0 else None
    port = netloc_parts[1] if len(netloc_parts) > 1 else None
    
    # Extract database name from path
    database_name = parse_result.path.lstrip('/')
    
    # Quality control checks
    if not user:
        raise ValueError("User is missing in the query string.")
    if not password:
        raise ValueError("Password is missing in the query string.")
    if not host:
        raise ValueError("Host is missing in the netloc.")
    if not port:
        raise ValueError("Port is missing in the netloc.")
    if not database_name:
        raise ValueError("Database name is missing in the path.")
    
    # Check if the port is a valid number
    try:
        port = int(port)
        if not (1 <= port <= 65535):
            raise ValueError("Port number is out of valid range (1-65535).")
    except ValueError:
        raise ValueError("Port is not a valid number.")
    
    return {
        'user': user,
        'password': password,
        'host': host,
        'port': port,
        'database_name': database_name,
        'sslmode': sslmode
    }

def connect_to_db(components):
    try:
        # Connect to the database using the extracted components
        connection = psycopg2.connect(
            dbname=components['database_name'],
            user=components['user'],
            password=components['password'],
            host=components['host'],
            port=components['port'],
            sslmode=components['sslmode']
        )
        print("Connection successful")
        return connection
    except OperationalError as e:
        print(f"An error occurred: {e}")
        return None


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

@app.function_name(name="StartCommand")
@app.route(route="StartCommand", auth_level=func.AuthLevel.ANONYMOUS)
def start_command(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP start command function processed a request.')

    data = req.get_json()
    chat_id= data['message']['chat']['id']
    text = data['message']['text']

    if text == '/start':
        bot.send_message(chat_id,'Qui ci sarà il link di registrazione')
    elif text == '/list':
        components = extract_components(parse_result=os.environ["POSTGRESQLCONNSTR_MAIN"])
        connection = connect_to_db(components=components)
        if connection:
            try:
                cursor = connection.cursor()
                cursor.execute('SELECT * FROM public."userToken";')
                result = cursor.fetchall()
                bot.send_message("Result of the query:", result)
                cursor.close()
                connection.close()
            except Exception as e:
                print(f"An error occurred while executing a query: {e}")
                connection.close()
    return func.HttpResponse("OK", status_code=200)




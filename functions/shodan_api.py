"""Module to interact with the Shodan API"""
import json
import logging
from os import environ

from azure.functions import HttpResponse
from shodan import Shodan

ALL_TRIGGER="industrial_control_system,malware,uncommon,open_database,iot,internet_scanner,ssl_expired,vulnerable,new_service,uncommon_plus,vulnerable_unverified,end_of_life"

logging.basicConfig(level=logging.INFO)
api = Shodan(environ['SHODAN_API_KEY'])

def get_notifier_id():
    """Get the ID of the first webhook notifier in the account."""
    notifiers = api.notifier.list_notifiers()['matches']

    # return the first webhook notifier
    for notifier in notifiers:
        if notifier['provider'] == 'webhook':
            logging.debug("found webhook notifier: %s", notifier['id'])
            return notifier['id']

    logging.error("no webhook notifier found\n %s", notifiers)
    raise RuntimeError('No webhook notifier found')

def add_alert(ip: str, trigger=ALL_TRIGGER):
    """Add an IP to a new alert and link it to a notifier."""
    # create the alert
    alert = api.create_alert(name=ip, ip=[ip], expires=0)

    # add the alert to the trigger
    trigger = api.enable_alert_trigger(aid=alert['id'], trigger=trigger)

    # link the alert to the notifier
    nid = get_notifier_id()
    api.add_alert_notifier(aid=alert['id'], nid=nid)

    # print the alert status
    alert_status = api.alerts(aid=alert['id'])
    logging.info("successfully created alert: %s", alert_status)

    return alert['id']

def del_alert(aid: str):
    """Delete an alert for an ip."""
    logging.info("deleting alert %s", aid)
    return api.delete_alert(aid=aid)

def list_alerts():
    """List all alerts in the account."""
    alerts = api.alerts()
    logging.info("active alerts:\n%s", json.dumps(alerts, indent=2))
    return alerts

def check_alert(ip: str):
    """Check if an alert exists for an ip."""
    alerts = api.alerts()
    for alert in alerts:
        if ip in alert['filters']['ip']:
            logging.info("alert found for %s", ip)
            return str(alert['id'])

    logging.info("no alert found for %s", ip)
    return None

def edit_trigger(url: str):
    """Edit webhook trigger URL."""
    nid = get_notifier_id()
    res = api.notifier.edit(nid=nid, args={'url': url })
    return res

def list_triggers():
    """List all triggers available."""
    triggers = api.alert_triggers()
    logging.info("available triggers:\n%s", json.dumps(triggers, indent=2))
    return triggers

def response(msg: any, status_code: int):
    """Return a response object."""
    if status_code == 200:
        return HttpResponse(json.dumps(msg), mimetype='application/json', status_code=status_code)
    else:
        return HttpResponse(msg, status_code=status_code)

def handle_get(ip: dict, aid: str | None):
    if aid:
        return response({'ip': ip, 'aid': aid}, status_code=200)

    return response(f"no alert found for {ip}", status_code=404)

def handle_post(ip: str, aid: str | None):
    if aid:
        return response({'ip': ip, 'aid': aid}, status_code=200)
    try:
        new_alert = add_alert(ip)
        return response({'ip': ip, 'aid': new_alert}, status_code=200)
    except Exception as err:
        return response(f"error creating alert: {err}", status_code=500)

def handle_delete(ip: str, aid: str | None):
    if aid:
        try:
            del_alert(aid)
            return response({'ip': ip, 'aid': aid}, status_code=200)
        except Exception as err:
            return response(f"error deleting alert: {err}", status_code=500)

    return response(f"no alert found for {ip}", status_code=404)

def handle_list():
    alerts =   list(map(
        lambda x: {'id': x['id'], 'name': x['name'], 'ip': x['filters']['ip'][0]},list_alerts()
    ))
    return response(alerts, status_code=200)

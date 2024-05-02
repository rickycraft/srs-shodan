"""Module to interact with the Shodan API"""
import json
import logging
from os import environ

from shodan import Shodan

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

def add_alert(ip: str, trigger='any'):
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

def del_alert(ip: str):
    """Delete an alert for an ip."""
    return api.delete_alert(aid=ip)

def list_alerts():
    """List all alerts in the account."""
    alerts = api.alerts()
    logging.info("active alerts:\n%s", json.dumps(alerts, indent=2))
    return alerts

def edit_trigger(url: str):
    """Edit webhook trigger URL."""
    nid = get_notifier_id()
    res = api.notifier.edit(nid=nid, args={'url': url })
    return res

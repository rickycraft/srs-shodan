CREATE VIEW telegram_ip AS
  SELECT
    shodan_alert.ip,
    shodan_alert.id AS alertid,
    "userToken"."userId" AS userid,
    "userToken".value AS token
   FROM shodan_alert
     LEFT JOIN notification ON shodan_alert.id = notification."alertId"
     LEFT JOIN "userToken" ON notification."userId" = "userToken"."userId"
   WHERE "userToken".type = 'telegram';
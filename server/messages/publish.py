#!/usr/bin/env python
import pika
import sys

# Name of the Exchange
exchange_name = 'logs'

# Open a connection with localhost
connection = pika.BlockingConnection(
    pika.ConnectionParameters(host='localhost'))

# Open a channel with exchange type as fanout
channel = connection.channel()
channel.exchange_declare(exchange=exchange_name, exchange_type='fanout')

# Publish a message to the same exchange
message = ' '.join(sys.argv[1:]) or "info: Hello World!"

channel.basic_publish(exchange=exchange_name, routing_key='', body=message)

#for num in range(100):
#    channel.basic_publish(exchange=exchange_name, routing_key='', body=str(num))

# Log and close connection
print(" [x] Sent %r" % message)
connection.close()

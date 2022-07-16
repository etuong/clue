#!/usr/bin/env python
import pika

# Name of exchange, must be the same as the name in the publisher
exchange_name = 'logs'

# Open a connection with localhost
credentials = pika.PlainCredentials('clueless', 'clueless')
connection = pika.BlockingConnection(
    pika.ConnectionParameters(
        host='ec2-34-212-82-85.us-west-2.compute.amazonaws.com',
        credentials=credentials))
# Open a channel with exchange type as fanout
channel = connection.channel()
channel.exchange_declare(exchange=exchange_name, exchange_type='fanout')

# Create a queue with a random name, let the server choose a random queue name
# Exclusive flag is to delete the queue if consumer connection is closed
result = channel.queue_declare(queue='', exclusive=True)
queue_name = result.method.queue

# Tell the exchange to send messages to our queue from binding
channel.queue_bind(exchange=exchange_name, queue=queue_name)

# Logging
print(' [*] Waiting for logs. To exit press CTRL+C')


# Callback function
def callback(ch, method, properties, body):
    print(" [x] %r" % body)


# Start consuming messages
channel.basic_consume(queue=queue_name,
                      on_message_callback=callback,
                      auto_ack=True)
channel.start_consuming()

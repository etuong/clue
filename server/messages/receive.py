#!/usr/bin/env python
import pika
import time

connection = pika.BlockingConnection(
    pika.ConnectionParameters(host='localhost'))

print(' [*] Waiting for messages. To exit press CTRL+C')
queue_name = 'queue'


def callback(ch, method, properties, body):
    print(" [x] Received %r" % body)
    time.sleep(body.count(b'.'))
    ch.basic_ack(delivery_tag=method.delivery_tag)


channel = connection.channel()
channel.queue_declare(queue=queue_name, durable=True)
channel.basic_qos(prefetch_count=1)
channel.basic_consume(queue=queue_name, on_message_callback=callback)
channel.start_consuming()
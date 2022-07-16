#!/usr/bin/env python
import sys
import pika


def main():
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(host='localhost'))

    queue_name = 'queue'
    message = ' '.join(sys.argv[1:]) or "This is Ethan!"

    channel = connection.channel()
    channel.queue_declare(queue=queue_name, durable=True)
    channel.basic_publish(exchange='',
                          routing_key=queue_name,
                          body=message,
                          properties=pika.BasicProperties(delivery_mode=2, ))

    print(" [x] Sent %r" % message)
    connection.close()


if __name__ == '__main__':
    main()
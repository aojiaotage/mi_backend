'use strict';

const rmq = require('amqplib');

class BaseConsumer {

  static get ['QUEUE_NAME_PREF']() {
    return 'mi_';
  }

  get ['queueName']() {
    throw new Error('Please define your own queue name');
  }

  async initConn() {
    const conn = await rmq.connect(this.app.config.rabbitmq.url);
    this.conn = conn;
  }

  async initChannel() {
    if (!this.conn) {
      await this.initConn();
    }
    const channel = await this.conn.createChannel(this.queueName);
    await channel.assertQueue(this.queueName, {
      durable: true,
    });
    this.channel = channel;
    return channel;
  }

  onMsg(msg) {
    throw new Error('Please define your own message handler');
  }

  async init(app) {
    if (!this.app) this.app = app;
    if (!this.channel) {
      await this.initChannel();
    }
    this.channel.consume(this.queueName, (msg)=>{this.onMsg(msg)});
  }

}

module.exports = BaseConsumer;


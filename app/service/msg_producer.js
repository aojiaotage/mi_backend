'use strict';

const { Service } = require('egg');

const rmq = require('amqplib');

const QUEUE_NAME_PREF = 'mi_';

class MsgProducer extends Service {

  static get ['QUEUE_NAMES']() {
    return {
      INVENTORY_UNLOCK: QUEUE_NAME_PREF + 'inventory_unlock',
    };
  }

  static get ['EXCHANGE_NAME']() {
    return 'MI_DEFAULT_DELAY_EXCHANGE_NAME';
  }

  async initConn() {
    const conn = await rmq.connect(this.app.config.rabbitmq.url);
    this.conn = conn;
  }

  async initChannel(queueName) {
    if (!this.conn) {
      await this.initConn();
    }
    const channel = await this.conn.createChannel(queueName);
    await channel.assertQueue(queueName, {
      durable: true,
    });
    await channel.assertExchange(MsgProducer.EXCHANGE_NAME, 'x-delayed-message',
      {
        arguments: {
          'x-delayed-type': 'direct',
        },
      });
    await channel.bindQueue(queueName, MsgProducer.EXCHANGE_NAME);
    this.channels[queueName] = channel;
    return channel;
  }

  async sendMsg(queueName, msg, opts) {

    if (!this.channels) {
      this.channels = {};
    }

    let channel = this.channels[queueName];

    if (!channel) {
      channel = await this.initChannel(queueName);
    }

    await channel.publish(MsgProducer.EXCHANGE_NAME, '', Buffer.from(msg), opts);
  }

  async sendInventoryUnlockMsg(inventoryInfo, opts) {
    await this.sendMsg(MsgProducer.QUEUE_NAMES.INVENTORY_UNLOCK,
      JSON.stringify(inventoryInfo), opts);
  }

}

module.exports = MsgProducer;


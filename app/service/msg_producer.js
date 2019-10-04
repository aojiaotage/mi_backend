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
    this.channels[queueName] = channel;
    return channel;
  }

  async sendMsg(queueName, msg) {

    if (!this.channels) {
      this.channels = {};
    }

    let channel = this.channels[queueName];

    if (!channel) {
      channel = await this.initChannel(queueName);
    }

    await channel.sendToQueue(queueName, Buffer.from(msg));
  }

  async sendInventoryUnlockMsg(inventoryInfo) {
    await this.sendMsg(MsgProducer.QUEUE_NAMES.INVENTORY_UNLOCK, JSON.stringify(inventoryInfo));
  }

}

module.exports = MsgProducer;


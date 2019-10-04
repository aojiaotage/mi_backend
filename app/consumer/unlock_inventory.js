'use strict';

const BaseConsumer = require('./base_comsumer');

class UnlockInventory extends BaseConsumer {

  get ['queueName']() {
    return BaseConsumer.QUEUE_NAME_PREF + 'inventory_unlock';
  }

  onMsg(msg) {
    console.log(JSON.parse(msg.content.toString('utf-8')));
    this.channel.ack(msg);
  }

}

module.exports = UnlockInventory;

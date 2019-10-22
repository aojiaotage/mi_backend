'use strict';

const { Service } = require('egg');

class Inventory extends Service {

  static get ['REDIS_GOODS_LOCKS_BY_ORDER_PREF']() {
    return 'goods_inventory_locks_by_order:';
  }

  static get ['REDIS_GOODS_LOCKS_PREF']() {
    return 'goods_inventory_locks:';
  }

  static get ['REDIS_GOODS_LOCKS_BY_ORDER_EXPIRE_PREF']() {
    return 'goods_inventory_locks:';
  }

  static get ['DEFAULT_LOCK_EXPIRE_SECONDS']() {
    return 1 * 60;
  }

  async addLocksByGoodsId(goodsId, subOrderId, amount) {
    const locksKey = Inventory.REDIS_GOODS_LOCKS_PREF + goodsId;
    const locksByOrderHsetKey = Inventory.REDIS_GOODS_LOCKS_BY_ORDER_PREF +
      goodsId;
    // TODO need MQ to do automic release.
    await this.app.redis.incrby(locksKey, amount);
    await this.app.redis.hincrby(locksByOrderHsetKey, subOrderId, amount);
    console.log(`locked:${goodsId} by ${subOrderId} amount: ${amount}`);
  }

  async getLocksByGoodsId(goodsId) {
    const locksKey = Inventory.REDIS_GOODS_LOCKS_PREF + goodsId;
    const lockedAmount = await this.app.redis.get(locksKey);
    return lockedAmount;
  }

  async removeLocksByGoodsId(goodsId, subOrderId) {
    const locksKey = Inventory.REDIS_GOODS_LOCKS_PREF + goodsId;
    const locksByOrderHsetKey = Inventory.REDIS_GOODS_LOCKS_BY_ORDER_PREF +
      goodsId;
    const amountByOrderId = await this.app.redis.hget(locksByOrderHsetKey,
      subOrderId);
    if (!amountByOrderId || Number.isNaN(amountByOrderId) ||
      Number(amountByOrderId) <= 0) {
      return;
    }
    await this.app.redis.incrby(locksKey, -1 * amountByOrderId);
    await this.app.redis.hdel(locksByOrderHsetKey, subOrderId);
    console.log(`unlocked:${goodsId} by ${subOrderId} amount: ${amountByOrderId}`);
  }

  async fillGoodsRealInventory(goodsList) {
    const ps = [];
    for (let i = 0; i < goodsList.length; i += 1) {
      const goods = goodsList[i];
      ps.push(this.getLocksByGoodsId(goods.id));
    }

    const lockedInventories = await Promise.all(ps);

    for (let i = 0; i < goodsList.length; i += 1) {
      const goods = goodsList[i];
      goods.inventory = goods.inventory - lockedInventories[i];
    }
  }
}

module.exports = Inventory;

'use strict';

const uuid = require('uuid/v4');

module.exports = app => {

  const { Sequelize } = app;
  const { STRING, UUID, TEXT, Op, INTEGER, DATE } = Sequelize;

  const Model = app.model.define('mi_sub_order',
    {
      id: {
        type: UUID,
        primaryKey: true,
      },
      order_id: {
        type: UUID,
        required: true,
      },
      goods_id: {
        type: UUID,
        required: true,
      },
      user_id: {
        type: UUID,
      },
      name: {
        type: STRING(32),
      },
      img_url: {
        type: TEXT,
      },
      price: {
        type: INTEGER,
      },
      nums: {
        type: INTEGER,
      },
      sub_total: {
        type: INTEGER,
      },
      reduce_price: {
        type: INTEGER,
      },
      mode: {
        type: INTEGER,
      },
    });

  Model.createSubOrders = async ({ order_id, goods, user_id, transaction }) => {
    // validate somehow

    const subOrders = [];

    for (let i = 0; i < goods.length; i += 1) {
      const good = goods[i];
      subOrders.push({
        id: uuid(),
        order_id,
        user_id,
        goods_id: good.id,
        name: good.name,
        img_url: good.img_url,
        price: good.price,
        nums: good.nums,
        sub_total: good.sub_total,
        reduce_price: good.reduce_price,
      });
    }

    const createdSubOrders = await Model.bulkCreate(subOrders, { transaction });
    return createdSubOrders;
  };

  Model.listOrders = async query => {
    const { ids, last_id, sort, limit, order_ids } = query;

    const sequelizeQuery = {};

    sequelizeQuery.where = {};

    if (last_id) {
      sequelizeQuery.where.id = {
        [Op.gt]: last_id,
      };
    }

    if (order_ids) {
      sequelizeQuery.where.order_id = {
        [Op.in]: order_ids,
      };
    }

    sequelizeQuery.limit = limit || 20;

    const orders = await Model.findAll(sequelizeQuery);

    return orders;
  };

  Model.updateOrder = async (order) => {
    const { id } = order;
    // validate id, something

    const updated = await Model.update({
      where: {
        id: {
          [Op.eq]: id,
        },
      },
      values: order,
    });
    return updated;
  };

  Model.sync();

  return Model;
};


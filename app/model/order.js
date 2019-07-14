'use strict';

const uuid = require('uuid/v4');

module.exports = app => {

  const { Sequelize } = app;
  const { STRING, UUID, TEXT, Op, INTEGER, DATE } = Sequelize;

  const Model = app.model.define('mi_order',
    {
      id: {
        type: UUID,
        primaryKey: true,
      },
      status: {
        type: INTEGER,
        required: true,
      },

      // 地址可能变化，直接存一份快照
      consignee: {
        type: STRING(64),
      },
      address: {
        type: TEXT,
      },
      zipcode: {
        type: STRING(64),
      },
      tel: {
        type: STRING(32),
      },
      province: {
        type: STRING(32),
      },
      province_id: {
        type: STRING(32),
      },
      city: {
        type: STRING(32),
      },
      city_id: {
        type: STRING(32),
      },
      district: {
        type: STRING(32),
      },
      district_id: {
        type: STRING(32),
      },
      area: {
        type: STRING(32),
      },
      area_id: {
        type: STRING(32),
      },
      best_time: {
        type: STRING(32),
      },
      invoice_title: {
        type: STRING(64),
      },
      invoice_type_name: {
        type: STRING(32),
      },
      invoice_type: {
        type: INTEGER,
      },
      original_price: {
        type: INTEGER,
      },
      goods_amount: {
        type: INTEGER,
      },
      reduce_price: {
        type: INTEGER,
      },
      shipment_expense: {
        type: INTEGER,
      },
      add_time: {
        type: DATE,
      },
    });

  Model.createNewOrder = async ({ user_id, transaction, address, best_time }) => {
    // validate somehow

    const order = {
      id: uuid(),
      user_id,
      status: 0,
      consignee: address.consignee,
      address: address.address,
      zipcode: address.zipcode,
      tel: address.tel,
      province: address.province,
      province_id: address.province_id,
      city: address.city,
      city_id: address.city_id,
      district: address.district,
      district_id: address.district_id,
      area: address.area,
      area_id: address.area_id,
      best_time,
    };

    const created = await Model.create(order, { transaction });
    return created;
  };

  Model.listOrders = async query => {
    const { ids, last_id, sort, limit } = query;

    const sequelizeQuery = {};

    sequelizeQuery.where = {};

    if (last_id) {
      sequelizeQuery.where.id = {
        [Op.gt]: last_id,
      };
    }

    sequelizeQuery.limit = limit || 20;

    const orders = await Model.findAll(sequelizeQuery);

    return orders;
  };

  Model.updateOrder = async (order, { transaction }) => {
    const { id } = order;
    // validate id, something

    const updated = await Model.update(
      order,
      {
        where: {
          id: {
            [Op.eq]: id,
          },
        },
        transaction,
      });
    return updated;
  };

  Model.sync();

  return Model;
};


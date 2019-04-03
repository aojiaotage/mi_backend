'use strict';

const uuid = require('uuid/v4');

module.exports = app => {

  const { Sequelize } = app;
  const { STRING, UUID, TEXT, BOOLEAN, Op, INTEGER } = Sequelize;

  const Model = app.model.define('mi_goods',
    {
      id: {
        type: UUID,
        primaryKey: true,
      },
      product_id: {
        type: UUID,
      },
      name: {
        type: STRING(32),
      },
      inventory: {
        type: INTEGER,
      },
      address_type: {
        type: STRING(16),
        required: true,
      },
      buy_limit: {
        type: STRING(16),
      },
      commodity_id: {
        type: UUID,
      },
      image_share: {
        type: TEXT,
      },
      img_url: {
        type: TEXT,
      },
      is_sale: {
        type: BOOLEAN,
      },
      is_show_reduce_price: {
        type: BOOLEAN,
      },
      is_stock: {
        type: BOOLEAN,
      },
      market_price: {
        type: STRING(16),
      },
      price: {
        type: STRING(16),
      },
      reduce_price: {
        type: STRING(16),
      },
    });

  Model.createNewGoods = async goods => {
    // validate somehow

    goods.id = uuid();
    const created = await Model.create(goods);
    return created;
  };

  Model.listGoods = async query => {
    const { ids, last_id, sort, limit, product_id } = query;

    const sequelizeQuery = {};

    sequelizeQuery.where = {};

    if (product_id) {
      sequelizeQuery.where.product_id = {
        [Op.eq]: product_id,
      };
    }

    if (last_id) {
      sequelizeQuery.where.id = {
        [Op.gt]: last_id,
      };
    }

    sequelizeQuery.limit = limit || 20;

    const goods = await Model.findAll(sequelizeQuery);

    return goods;
  };

  Model.updateGoods = async (goods) => {
    const { id } = goods;
    // validate id, something

    const updated = await Model.update(
      goods,
      {
        where: {
          id: {
            [Op.eq]: id,
          },
        },
      });
    return updated;
  };

  Model.sync();

  return Model;
};


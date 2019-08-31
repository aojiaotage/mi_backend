'use strict';

const uuid = require('uuid/v4');

module.exports = app => {

  const { Sequelize } = app;
  const { STRING, UUID, TEXT, BOOLEAN, INTEGER, Op } = Sequelize;

  const Model = app.model.define('mi_cart',
    {
      id: {
        type: UUID,
        primaryKey: true,
      },
      goods_id: {
        type: UUID,
        required: true,
      },
      user_id: {
        type: UUID,
        required: true,
      },
      name: {
        type: STRING(32),
      },
      buy_limit: {
        type: STRING(16),
      },
      img_url: {
        type: TEXT,
      },
      price: {
        type: STRING(16),
      },
      nums: {
        type: INTEGER,
      },
      product_id: {
        type: UUID,
      },
    });

  Model.createNewItem = async item => {
    // validate somehow
    const query = {
      where: {
        goods_id: {
          [Op.eq]: item.goods_id,
        },
        user_id: {
          [Op.eq]: item.user_id,
        },
      },
      limit: 1,
    };

    const [found] = await Model.findAll(query);

    if (found) {
      found.nums += item.nums;
      await Model.update(found.toJSON(), {
        where: {
          id: {
            [Op.eq]: found.id,
          },
        },
      });
      return found;
    } else {
      item.id = uuid();
      const created = await Model.create(item);
      return created;
    }
  };

  Model.listItems = async query => {
    const { ids, last_id, sort, limit } = query;

    const sequelizeQuery = {};

    sequelizeQuery.where = {};

    if (last_id) {
      sequelizeQuery.where.id = {
        [Op.gt]: last_id,
      };
    }

    sequelizeQuery.limit = limit || 20;

    const carts = await Model.findAll(sequelizeQuery);

    return carts;
  };

  Model.updateItemById = async (item) => {
    const { id } = item;
    // validate id, something

    const updated = await Model.update(
      item,
      {
        where: {
          id: {
            [Op.eq]: id,
          },
        },
      });
    return updated;
  };

  Model.deleteItemById = async (item) => {
    const { id } = item;
    // validate id, something

    const rows = await Model.destroy(
      {
        where: {
          id: {
            [Op.eq]: id,
          },
        },
      });
    return rows;
  };

  Model.sync();

  return Model;
};


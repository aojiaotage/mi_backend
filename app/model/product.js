'use strict';

const uuid = require('uuid/v4');

module.exports = app => {

  const { Sequelize } = app;
  const { STRING, UUID, TEXT, BOOLEAN, Op } = Sequelize;

  const Model = app.model.define('mi_product',
    {
      id: {
        type: UUID,
        primaryKey: true,
      },
      name: {
        type: STRING(64),
        required: true,
      },
      default_goods_id: {
        type: UUID,
      },
      activity_tip_id: {
        type: UUID,
      },
      is_batched: {
        type: BOOLEAN,
      },
      is_enable: {
        type: BOOLEAN,
      },
      product_desc: {
        type: TEXT,
      },
      product_gallery_icon_id: {
        type: UUID,
      },
      share_content: {
        type: STRING(64),
      },
    });

  Model.createNewProduct = async product => {
    // validate somehow

    product.id = uuid();
    const created = await Model.create(product);
    return created;
  };

  Model.listProducts = async query => {
    const { ids, last_id, sort, limit } = query;

    const sequelizeQuery = {};

    sequelizeQuery.where = {};

    if (ids) {
      if (ids.length === 1) {
        sequelizeQuery.where.id = {
          [Op.eq]: ids[0],
        };
      } else {
        sequelizeQuery.where.id = {
          [Op.in]: ids,
        };
      }
    } else if (last_id) {
      sequelizeQuery.where.id = {
        [Op.gt]: last_id,
      };
    }

    if (last_id) {
      sequelizeQuery.where.id = {
        [Op.gt]: last_id,
      };
    }

    sequelizeQuery.limit = limit || 20;

    const products = await Model.findAll(sequelizeQuery);

    return products;
  };

  Model.updateProduct = async product => {
    const { id } = product;
    // validate id, something

    const updatedRows = await Model.update(product, {
      where: {
        id: {
          [Op.eq]: id,
        },
      },
    });
    return updatedRows;
  };

  Model.sync();

  return Model;
};

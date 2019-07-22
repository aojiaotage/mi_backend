'use strict';

const uuid = require('uuid/v4');

module.exports = app => {

  const { Sequelize } = app;
  const { STRING, UUID, TEXT, BOOLEAN, Op } = Sequelize;

  const Model = app.model.define('mi_role',
    {
      id: {
        type: UUID,
        primaryKey: true,
      },
      name: {
        type: STRING(64),
        required: true,
      },
      desc: {
        type: TEXT,
      },
    });

  Model.createNewRole = async role => {
    // validate somehow

    role.id = uuid();
    const created = await Model.create(role);
    return created;
  };

  Model.listRoles = async query => {
    const { ids, last_id, sort, limit } = query;

    const sequelizeQuery = {};

    sequelizeQuery.where = {};

    if (last_id) {
      sequelizeQuery.where.id = {
        [Op.gt]: last_id,
      };
    }

    if (ids) {
      if (!sequelizeQuery.where.id) sequelizeQuery.where.id = {};
      sequelizeQuery.where.id[Op.in] = ids;
    }

    sequelizeQuery.limit = limit || 20;

    const roles = await Model.findAll(sequelizeQuery);

    return roles;
  };

  Model.updateRole = async (role) => {
    const { id } = role;
    // validate id, something

    const updated = await Model.update({
      where: {
        id: {
          [Op.eq]: id,
        },
      },
      values: role,
    });
    return updated;
  };

  Model.sync();

  return Model;
};


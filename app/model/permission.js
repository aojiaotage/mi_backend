
'use strict';

const uuid = require('uuid/v4');

module.exports = app => {

  const { Sequelize } = app;
  const { STRING, UUID, TEXT, BOOLEAN, Op } = Sequelize;

  const Model = app.model.define('mi_permission',
    {
      id: {
        type: UUID,
        primaryKey: true,
      },
      role_id: {
        type: UUID,
        required: true,
      },
      name: {
        type: STRING(64),
        required: true,
      },
      path: {
        type: TEXT,
      },
      method: {
        type: STRING(32),
      },
      allow: {
        type: BOOLEAN,
        default: true,
      },
    });

  Model.createNewPermission = async permission => {
    // validate somehow

    permission.id = uuid();
    const created = await Model.create(permission);
    return created;
  };

  Model.listPermissions = async query => {
    const { ids, last_id, sort, limit, role_ids } = query;

    const sequelizeQuery = {};

    sequelizeQuery.where = {};

    if (last_id) {
      sequelizeQuery.where.id = {
        [Op.gt]: last_id,
      };
    }

    if (role_ids) {
      sequelizeQuery.where.role_id = {
        [Op.in]: role_ids,
      };
    }

    sequelizeQuery.limit = limit || 20;

    const permissions = await Model.findAll(sequelizeQuery);

    return permissions;
  };

  Model.updatePermission = async (permission) => {
    const { id } = permission;
    // validate id, something

    const updated = await Model.update({
      where: {
        id: {
          [Op.eq]: id,
        },
      },
      values: permission,
    });
    return updated;
  };

  Model.sync();

  return Model;
};


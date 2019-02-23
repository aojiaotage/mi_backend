'use strict';

const crypto = require('crypto');
const { pbkdf2, randomBytes } = crypto;
const { promisify } = require('util');
const uuid = require('uuid/v4');

const pbkdf2P = promisify(pbkdf2);
const randomBytesP = promisify(randomBytes);

async function genEncryptedPassword(rawPassword, salt) {
  if (!salt) salt = await randomBytesP(32);
  const encrypted = await pbkdf2P(rawPassword, salt.toString('base64'), 10000,
    128, 'sha512');
  return {
    encrypted: encrypted.toString('base64'),
    salt: salt.toString('base64'),
  };
}

module.exports = app => {

  const { Sequelize } = app;
  const { STRING, UUID, TEXT, Op } = Sequelize;

  const Model = app.model.define('mi_user',
    {
      id: {
        type: UUID,
        primaryKey: true,
      },
      username: {
        type: TEXT,
      },
      password: {
        type: STRING(256),
      },
      salt: {
        type: STRING(64),
      },
      phoneNumber: {
        type: STRING(32),
      },
    }, {
      indexes: [
        {
          fields: ['username'],
          unique: true,
        },
        {
          fields: ['phoneNumber'],
        },
      ],
    });

  Model.createUserWithUnPw = async (username, password) => {
    const { salt, encrypted } = await genEncryptedPassword(password);
    let created = await Model.create({
      id: uuid(),
      username,
      password: encrypted,
      salt,
    }, {
      raw: true,
    });
    created = created.toJSON();
    delete created.password;
    delete created.salt;
    return created;
  };

  Model.loginWithUnPw = async (username, password) => {
    const [found] = await Model.findAll({
      attributes: ['id', 'password', 'salt'],
      where: {
        username: {
          [Op.eq]: username,
        },
      },
    });

    if (!found) {
      throw new app.error.InvalidParam(
        'username',
        'no such username',
        '账户不存在'
      );
    }

    const foundPassword = found.password;

    const { encrypted: reEncryptedPassword } = await genEncryptedPassword(password,
      found.salt);
    
    if (foundPassword !== reEncryptedPassword) {
      throw new app.error.InvalidParam(
        'username or password',
        'username or password do not match',
        '用户名或密码不正确'
      );
    }

    return {
      id: found.id,
    };
  };

  Model.sync();

  return Model;
};

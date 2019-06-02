'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {

  require('./admin')(app);
  require('./site')(app);
  require('./user')(app);
  require('./address')(app);
  require('./cart')(app);

};

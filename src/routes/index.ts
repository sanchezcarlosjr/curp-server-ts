import { app } from '../index';
import requestIp = require('request-ip');

import home from './home-router';
import actions from './actions-router';

export function routes() {
  app.use(requestIp.mw()); //* GET IP MIDDLEWARE
  app.use(home);
  app.use('/actions', actions);
}

'use strict';

const Database = use('Database');
const User = use('App/Models/User');

class UserController {
  async store({request}) {
    const {permissions, roles, ...data} = request.only([
      'username',
      'email',
      'password',
      'permissions',
      'roles',
    ]);

    const addresses = request.input('addresses');

    const trx = await Database.beginTransaction();

    const user = await User.create(data);
    await user.addresses().createMany(addresses);

    if (roles) {
      await user.roles().attach(roles);
    }

    if (permissions) {
      await user.permissions().attach(permissions);
    }

    await trx.commit();

    await user.loadMany(['roles', 'permissions']);

    // Para update usar user.roles().sync(roles)
    return user;
  }
}

module.exports = UserController;

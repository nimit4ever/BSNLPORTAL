class Access {
  constructor(entity) {
    this = entity;
  }

  read = function (user) {
    this.read.includes(user.role);
  };

  create = function (user) {
    this.create.includes(user.role);
  };

  modify = function (user) {
    this.modify.includes(user.role);
  };

  distroy = function (user) {
    this.distroy.includes(user.role);
  };
}

const itemAccess = new Access({
  read: ['ADMIN', 'NO'],
  create: ['ADMIN', 'NO'],
  modify: ['ADMIN', 'NO'],
  distroy: ['ADMIN', 'NO'],
});

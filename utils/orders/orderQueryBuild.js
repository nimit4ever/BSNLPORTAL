class OrderQueryBuild {
  constructor(user, query) {
    if (user.area !== 'ALL') {
      this.$or = [{ endAStation: user.area }, { endBStation: user.area }];
    }

    if (user.role === 'NIB' || user.role === 'MLLN' || user.role === 'LCTX' || user.role === 'LDTX') {
      if (query && query.isActive && query.isActive == 0) {
        this[user.role] = { $exists: true };
      } else {
        this[user.role] = false;
      }
    } else if (user.role === 'NO' || user.role === 'ADMIN') {
    } else {
      this.agency = user.role;
    }

    this.isActive = true;
    if (query) {
      if (query.isActive) {
        if (query.isActive == 0) {
          this.isActive = false;
        } else if (query.isActive === 'ALL') {
          delete this.isActive;
        }
      }

      if (query.reason) {
        if (query.reason === 'INCOMPLETE') {
          this.reason = { $not: { $in: ['COMMISSIONED', 'CANCELLED'] } };
        } else {
          this.reason = query.reason;
        }
      }

      if (query.agency && (user.role === 'NO' || user.role === 'ADMIN')) {
        this.agency = query.agency;
      }

      if (query.orderType) {
        this.orderType = query.orderType;
      }
    }
  }
}

module.exports = { OrderQueryBuild };

class FeasibilityQueryBuild {
  constructor(user, query) {
    if (user.area !== 'ALL') {
      this.$or = [{ endAStation: user.area }, { endBStation: user.area }];
    }

    this.pending = true;

    if (!(user.role === 'NO' || user.role === 'ADMIN')) {
      this.agency = user.role;
    }

    if (query) {
      if (query.pending) {
        if (query.pending == 0) {
          this.pending = false;
        } else if (query.pending === 'ALL') {
          delete this.pending;
        }
      }
      if (query.agency && (user.role === 'NO' || user.role === 'ADMIN')) {
        this.agency = query.agency;
      }
    }
  }
}

module.exports = { FeasibilityQueryBuild };

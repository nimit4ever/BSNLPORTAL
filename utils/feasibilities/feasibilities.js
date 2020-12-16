class QueryFeasibility {
  constructor({ query = undefined, user = undefined }) {
    this.pending = true;
    if (query) {
      if (query.pending) {
        this.pending = query.pending && query.pending == 0 ? false : true;
      }
      if (query.agency) {
        this.agency = query.agency;
      } else if (user && user.role && !(user.role === 'NO' || user.role === 'ADMIN')) {
        this.agency = user.role;
      } else if (user && user.role && (user.role === 'NO' || user.role === 'ADMIN')) {
      } else {
        this.agency = 'NO DATA';
      }
    }
  }
}

module.exports = { QueryFeasibility };

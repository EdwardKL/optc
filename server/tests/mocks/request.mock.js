export default class RequestMock {
  constructor() {
    this.messages = {};
  }

  flash(type, message) {
    this.messages[type] = message;
  }

  // Retrieves any flash messages sent to the request.
  getFlash(type) {
    return this.messages[type];
  }

  clearFlash() {
    this.messages = {};
  }

  // Pretend that the user was logged in.
  login(user) {
    this.user = user;
  }

  // Pretend that the user is not logged in.
  logout() {
    delete this.user;
  }

  // Sets the request body.
  setBody(body) {
    this.body = body;
  }

  // Sets the request params.
  setParams(params) {
    this.params = params;
  }

  // Sets the request query
  setQuery(query) {
    this.query = query;
  }
}

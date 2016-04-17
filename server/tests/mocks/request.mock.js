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
  
  // Pretend that the user was logged in.
  login(user) {
    this.user = user;
  }
  
  // Sets the request body.
  setBody(body) {
    this.body = body;
  }
}
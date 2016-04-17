export default class ResponseMock {
  constructor() {
    this.redirect_path = '';
  }
 
  redirect(path) {
    this.redirect_path = path;
  }
  
  getRedirectPath() {
    return this.redirect_path;
  }
}
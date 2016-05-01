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

  json(data) {
    this.json_data = data;
  }

  getJson() {
    return this.json_data;
  }
}

const express = require('express');

class BaseController {
  constructor(service) {
    this.router = express.Router();
    this.service = service;
  }

  getRouter() {
    return this.router;
  }
}

module.exports = BaseController;

/*
const Main = (() => {
  const app = require('./app');
  app.start();
})();
*/
import App from "./app.js";

class Main {
  static run () {
    const app = new App()
    app.start();
  }
}

Main.run();
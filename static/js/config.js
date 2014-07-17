requirejs.config({
  paths: {
    "templates": "../../.tmp/jst"
  },
  shim: {
    "zepto": {
      "exports": '$'
    }
  }
});
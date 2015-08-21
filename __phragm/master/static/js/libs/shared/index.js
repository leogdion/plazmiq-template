define(function () {
  return {
    _data: {},
    set: function (name, value) {
      this._data[name] = value;
    },
    get: function (name, defaultValue) {
      return this._data[name] || defaultValue;
    }
  };
});
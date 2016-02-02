define(["../../../../.tmp/names"], function (names) {
  return function () {
    var name = {
      "first": names["first names"][Math.floor(Math.random() * names["first names"].length)],
      "last": names.surnames[Math.floor(Math.random() * names.surnames.length)]
    };
    name.username = (name.first.substring(0, 12 - name.last.length) + name.last + Math.floor(Math.random() * 100)).toLowerCase();
    name.email = "test+" + name.username + "@brightdigit.com";
    return name;
  };
});
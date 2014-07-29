define(['./email', './match', './pattern'], function (email, match, pattern) {
  var _ = [email, match, pattern];

  function validateWith(sel, memo, func) {
    memo.push.apply(memo, func.call(sel));
    return memo;
  }

  function validate(sel) {
    return validateWith.bind(undefined, sel);
  }

  return function (sel) {
    return _.reduce(validate(sel), []);
  };
});
/*jshint multistr: true */
define(['zepto', 'hasher', '../libs/validation/index', '../libs/rest/index', '../libs/names/index', '../libs/shared/index'], function ($, hasher, validations, rest, names, shared) {

  function validate() {
    $('button').not('.inactive').not('#test').prop('disabled', $('form input.error').size() + $('form input[required]').not('.validated').size());
  }

  return {
    template: 'login',
    initialize: function () {

      //var btnGroup = this.find('.btn-progress');
      //var progress = $('<div class="progress"></div>').appendTo(btnGroup);
/*
      var sep = 2 * Math.floor(btnGroup.width() / 40) + 2;
      var squares = $(new Array(sep).join("<span></span>")).appendTo(progress);
      var count = sep - 1;
      var middle = Math.floor(count / 2);

      for (var index = 0; index <= count / 2; index++) {

        var set = squares.eq(middle - index);

        if (index > 0) {
          set = set.add(squares.eq(middle + index));
        }
        set.addClass("seg-mid-" + index + "-" + (count/2) );
        var opacity = (index + 1) / (middle + 1);
        //set.css('opacity', opacity);

      }
      */
    },
    events: {
      'input[data-char]': {
        'keypress': function (e) {
          console.log(String.fromCharCode(e.which));

          if (!(String.fromCharCode(e.which).match($(this).attr('data-char')))) {
            return false;
          }
        }
      },
      'input[data-char-transform]': {
        'blur': function (e) {
          var $this = $(this);
          $this.val($this.val()[$this.attr('data-char-transform')]());
        }
      },
      'input': {
        'blur': function (e) {
          var $this = $(this);
          var errors = [];
          console.log("input blur");
          if ($this.prop('required') || $this.val().trim().length > 0) {
/*
            for (var key in validations) {
              errors.push.apply(errors, validations[key].call($this));
            }
            */
            errors = validations($this);
            console.log(errors);

            var errorList = $this.next("ul.errors").empty();
            errorList = errorList.length ? errorList : $('<ul class="errors"></ul>').insertAfter($this);
            $this.toggleClass('validated', true);
            if ($this.toggleClass('error', errors.length).hasClass('error')) {
              console.log(errorList);
              $.each(errors, function () {
                errorList.append("<li>" + this + "</li>");
              });
            }

          }
          validate();
        }
      },
      'button#test': {
        'click': function (e) {
          console.log("test - login");
          var data = names();
          $('input#email').val(data.email);
          $('input#name').val(data.username);
          $('input#password').val('testTEST123!');
          $('input#confirmPassword').val('testTEST123!');
          $('input').toggleClass('validated', true).toggleClass('error', false);
          $('ul.errors').empty();
          validate();
        }
      },
      'button': {
        'click': function (e) {
          if (this.classList.contains('inactive')) {
            console.log('switch');
            $('form h1 span').toggleClass('inactive');
            $('button').not("#test").toggleClass('inactive').prop('disabled', false);
            validate();
            $('#registration').toggleClass('collapse', this.getAttribute('id') !== 'register');
            $('#registration input').prop('required', this.getAttribute('id') === 'register');
          } else {
            if (this.getAttribute('id') === 'register') {
              console.log('begin posting registration');
              $('form fieldset').prop('disabled', true);
              rest.post('registrations', 'form', {
                success: function (data, status, xhr) {
                  shared.set('registration', data);
                  console.log('posted registration');
                  hasher.setHash('confirmation');
                },
                error: function (xhr, errorType, error) {
                  console.log('error registration');
                }
              });
            } else if (this.getAttribute('id') === 'signin') {
              console.log('begin posting session');
              $('form fieldset').prop('disabled', true);
              rest.post('sessions', 'form', {
                success: function (data, status, xhr) {
                  console.log('posted sessions');
                  hasher.setHash('profile');
                },
                error: function (xhr, errorType, error) {
                  console.log('error sessions');
                }
              });
            }
          }
        }
      }
    }
  };
});
(function() {
  var $, cookie;

  $ = jQuery;

  cookie = function(key, value, options) {
    var days, decode, result, t;
    if (arguments.length > 1 && String(value) !== "[object Object]") {
      options = jQuery.extend({}, options);
      if (value == null) {
        options.expires = -1;
      }
      if (typeof options.expires === "number") {
        days = options.expires;
        t = options.expires = new Date();
        t.setDate(t.getDate() + days);
      }
      value = String(value);
      return (document.cookie = [encodeURIComponent(key), "=", (options.raw ? value : encodeURIComponent(value)), (options.expires ? "; expires=" + options.expires.toUTCString() : ""), (options.path ? "; path=" + options.path : ""), (options.domain ? "; domain=" + options.domain : ""), (options.secure ? "; secure" : "")].join(""));
    }
    options = value || {};
    result = void 0;
    decode = (options.raw ? function(s) {
      return s;
    } : decodeURIComponent);
    return ((result = new RegExp("(?:^|; )" + encodeURIComponent(key) + "=([^;]*)").exec(document.cookie)) ? decode(result[1]) : null);
  };

  $.fn.extend({
    BootJoyride: function(options) {
      var currentStep, log, setCookieStep, settings;
      settings = {
        tipContent: '#JoyrideTipContent',
        cookieMonster: false,
        cookieName: 'bootstrapJoyride',
        cookieDomain: false,
        postRideCallback: $.noop,
        postStepCallback: $.noop,
        nextOnClose: false,
        debug: false
      };
      settings = $.extend(settings, options);
      log = function(msg) {
        if (settings.debug) {
          return typeof console !== "undefined" && console !== null ? console.log('[bootstrap-tour]', msg) : void 0;
        }
      };
      currentStep = function() {
        var current_cookie;
        if (settings.cookieMonster == null) {
          return 1;
        }
        current_cookie = cookie(settings.cookieName);
        if (current_cookie == null) {
          return 1;
        }
        try {
          return parseInt(current_cookie);
        } catch (e) {
          return 1;
        }
      };
      setCookieStep = function(step) {
        if (settings.cookieMonster) {
          return cookie(settings.cookieName, "" + step, {
            expires: 365,
            domain: settings.cookieDomain
          });
        }
      };
      return this.each(function() {
        var $tipContent, $tips, first_step;
        $tipContent = $(settings.tipContent).first();
        if ($tipContent == null) {
          log("can't find tipContent from selector: " + settings.tipContent);
        }
        $tips = $tipContent.find('li');
        first_step = currentStep();
        log("first step: " + first_step);
        if (first_step > $tips.length) {
          log('tour already completed, skipping');
          return;
        }
        $tips.each(function(idx) {
          var $li, $target, target, tip_data;
          if (idx < (first_step - 1)) {
            log("skipping step: " + (idx + 1));
            return;
          }
          $li = $(this);
          tip_data = $li.data();
          if ((target = tip_data['target']) == null) {
            return;
          }
          if (($target = $(target).first()) == null) {
            return;
          }
          $target.popover({
            html : true,
            trigger: 'manual',
            title: tip_data['title'] != null ? "" + tip_data['title'] + "  <a class=\"tour-tip-close close\" data-touridx=\"" + (idx + 1) + "\">&times;</a>" : null,
            content: "<p style=\"height:100px\">" + ($li.html()) + "</p><p style=\"text-align: right\"><a href=\"#\" class=\"tour-tip-next btn btn-success\" data-touridx=\"" + (idx + 1) + "\">" + ((idx + 1) < $tips.length ? 'Next <i class="icon-chevron-right icon-white"></i>' : '<i class="icon-ok icon-white"></i> Done') + "</a></p>",
            placement: tip_data['placement'] || 'right'
          });
          
          $li.data('target', $target);
          if (idx === (first_step - 1)) {
            var targetOffset = $(tip_data['target']).offset().top - 300;
            $('html, body').animate({scrollTop: targetOffset}, 500);
            return $target.popover('show');
          }
        });
        $(document).on('click', 'a.tour-tip-close', function() {
          var current_step;
          current_step = $(this).data('touridx');
          $(settings.tipContent).first().find("li:nth-child(" + current_step + ")").data('target').popover('hide');
          if (settings.nextOnClose) {
            return setCookieStep(current_step + 1);
          }
          return settings.postRideCallback();
        });
        return $(document).on('click', 'a.tour-tip-next', function() {
          var current_step, next_tip, _ref, id;
          current_step = $(this).data('touridx');
          log("current step: " + current_step);
          $(settings.tipContent).first().find("li:nth-child(" + current_step + ")").data('target').popover('hide');
          if (settings.postStepCallback !== $.noop) {
            settings.postStepCallback($(this).data('touridx'));
          }
          next_tip = (_ref = $(settings.tipContent).first().find("li:nth-child(" + (current_step + 1) + ")")) != null ? _ref.data('target') : void 0;
          
          setCookieStep(current_step + 1);
          if (next_tip != null) {
            var tst = next_tip.attr('id');
            var targetOffset = $('#'+tst).offset().top - 300;
            $('html, body').animate({scrollTop: targetOffset}, 500);
            return next_tip.popover('show');
          } else {
            if (settings.postRideCallback !== $.noop) {
              return settings.postRideCallback();
            }
          }
        });
      });
    }
  });

}).call(this);

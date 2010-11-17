/*
 * jQuery Smart Text Inputs
 * Copyright 2010 Stephen Handley
 * http://person.sh
 * Released under the MIT and GPL licenses.
 */

(function($) {
  var methods = {
    init : function() {
      this.live('blur.smartInput', function () {
        var _this = $(this);
        var blurVal = _this.attr('data-prompt-blur');
        var focusVal = _this.attr('data-prompt-focus');
        if (!focusVal) {
          focusVal = '';
        }

        var val = _this._smartInputVal();
        if ((val === focusVal) || (val === '') || (val.length < focusVal.length)) {
          _this._smartInputVal(blurVal);
        }
      }).live('focus.smartInput', function () {
        var _this = $(this);
        var blurVal = _this.attr('data-prompt-blur');
        var focusVal = _this.attr('data-prompt-focus');
        if (!focusVal) {
          focusVal = '';
        }
        if (_this._smartInputVal() === blurVal) {
          _this._smartInputVal(focusVal);
        }
      });

      this.each(function (i, input) {
        input = $(input);
        var focusVal = input.attr('data-prompt-focus');
        if (!focusVal) {
          focusVal = '';
        }

        if ((input._smartInputVal() === focusVal) || (input._smartInputVal() === '')) {
          input._smartInputVal(input.attr('data-prompt-blur'));
        }
      });

      return this;
    },
    
    hasBlurVal : function( ) { 
      var result = this.map(function() {
        return !!$(this).attr('data-prompt-blur');
      });
      
      if (result.length == 1) {
        result = result[0];
      }
      return result;
    },
    
    hasData : function( ) { 
      var result = this.map(function() {
        var _this = $(this);
        var val = _this._smartInputVal();
        var blurVal = _this.attr('data-prompt-blur');
        var focusVal = _this.attr('data-prompt-focus');

        if (!focusVal) {
          focusVal = '';
        }

        return ((val !== blurVal) && (val !== focusVal));
      });
      
      if (result.length == 1) {
        result = result[0];
      }
      return result;
    },
    
    reset : function() {
      return this.each(function() {        
        var _this = $(this);
        _this._smartInputVal(_this.attr('data-prompt-blur'));
      });
    },
    
    isValid: function() {
      var result = this.map(function() {
        var _this = $(this);
        if (_this.attr('data-regex')) {
          var regex = new RegExp(_this.attr('data-regex'), 'i');
          return !!_this._smartInputVal().match(regex);
        } else {
          return true;
        }
      });
      
      if (result.length == 1) {
        result = result[0];
      }
      return result;
    }
  };
  
  // make inputs behave naturally during form submissions
  // i.e. if its just holding the prompt, then leave the input blank in the serialized form
  // i know polluting global jQuery namespace sucks, but not clear on a preferable approach
  $.fn._smartInputVal = $.fn.val;
  $.fn.val = function(value) {
    if (!arguments.length && this.smartInput('hasBlurVal') && !this.smartInput('hasData')) {
      return '';
    } else {
      return $.fn._smartInputVal.apply(this, arguments);
    }
  }

  $.fn.smartInput = function(method) {
    
    // Method calling logic
    if (methods[method]) {
      return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if ((typeof method === 'object') || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' +  method + ' does not exist on jQuery.smartInput');
    }    
  
  };
  
})(jQuery);
(function() {

  'use strict';

  var docElem = window.document.documentElement;

  window.requestAnimFrame = function() {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback) {
        window.setTimeout(callback, 1000 / 60);
      }
    );
  }();

  window.cancelAnimFrame = function() {
    return (
      window.cancelAnimationFrame ||
      window.webkitCancelAnimationFrame ||
      window.mozCancelAnimationFrame ||
      window.oCancelAnimationFrame ||
      window.msCancelAnimationFrame ||
      function(id) {
        window.clearTimeout(id);
      }
    );
  }();

  function SVGEl(el) {
    this.el = el;
    this.current_frame = 0;
    this.total_frames = 60;
    this.path = new Array();
    this.length = new Array();
    this.handle = 0;
    this.init();
  }

  SVGEl.prototype.init = function() {
    var self = this;
    [].slice.call(this.el.querySelectorAll('path')).forEach(function(path, i) {
      self.path[i] = path;
      var l = self.path[i].getTotalLength();
      self.length[i] = l;
      self.path[i].style.strokeDasharray = l + ' ' + l;
      self.path[i].style.strokeDashoffset = l;
    });
  };

  SVGEl.prototype.render = function() {
    if (this.rendered) return;
    this.rendered = true;
    this.draw();
  };

  SVGEl.prototype.draw = function() {
    var self = this,
      progress = this.current_frame / this.total_frames;
    if (progress > 1) {
      window.cancelAnimFrame(this.handle);
    } else {
      this.current_frame++;
      for (var j = 0, len = this.path.length; j < len; j++) {
        this.path[j].style.strokeDashoffset = Math.floor(this.length[j] * (1 - progress));
      }
      this.handle = window.requestAnimFrame(function() {
        self.draw();
      });
    }
  };

  function getViewportH() {
    var client = docElem['clientHeight'],
      inner = window['innerHeight'];

    if (client < inner)
      return inner;
    else
      return client;
  }

  function scrollY() {
    return window.pageYOffset || docElem.scrollTop;
  }

  function getOffset(el) {
    var offsetTop = 0,
      offsetLeft = 0;
    do {
      if (!isNaN(el.offsetTop)) {
        offsetTop += el.offsetTop;
      }
      if (!isNaN(el.offsetLeft)) {
        offsetLeft += el.offsetLeft;
      }
    } while (el = el.offsetParent)

    return {
      top: offsetTop,
      left: offsetLeft
    };
  }

  function inViewport(el, h) {
    var elH = el.offsetHeight,
      scrolled = scrollY(),
      viewed = scrolled + getViewportH(),
      elTop = getOffset(el).top,
      elBottom = elTop + elH,
      h = h || 0;

    return (elTop + elH * h) <= viewed && (elBottom) >= scrolled;
  }

  function init() {
    var svgs = Array.prototype.slice.call(document.querySelectorAll('svg')),
      svgArr = new Array(),
      didScroll = false,
      resizeTimeout;

    svgs.forEach(function(el, i) {
      var svg = new SVGEl(el);
      svgArr[i] = svg;
      setTimeout(function(el) {
        return function() {
          if (inViewport(el.parentNode)) {
            svg.render();
          }
        };
      }(el), 250);
    });

    var scrollHandler = function() {
      if (!didScroll) {
        didScroll = true;
        setTimeout(function() {
          scrollPage();
        }, 60);
      }
    },
      scrollPage = function() {
        svgs.forEach(function(el, i) {
          if (inViewport(el.parentNode, 0.5)) {
            svgArr[i].render();
          }
        });
        didScroll = false;
      },
      resizeHandler = function() {
        function delayed() {
          scrollPage();
          resizeTimeout = null;
        }
        if (resizeTimeout) {
          clearTimeout(resizeTimeout);
        }
        resizeTimeout = setTimeout(delayed, 200);
      };

    window.addEventListener('scroll', scrollHandler, false);
    window.addEventListener('resize', resizeHandler, false);
  }

  window.onload = function() {
    if (window['innerWidth'] > 1024) {
      document.getElementById("svg-drawing-mac").style.display = '';
      init();
    } else if (window['innerWidth'] > 600) {
      document.getElementById("svg-drawing-ipad").style.display = '';
      init();
    } else {
      document.getElementById("svg-drawing-iphone").style.display = '';
      init();
    }
  };

})();
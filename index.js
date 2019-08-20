import Vue from 'vue';

const w = 1190;

function isOverWidth() {
  let width = document.documentElement.clientWidth || document.body.clientWidth;
  return width >= w;
}

Vue.directive('move', {
  inserted: function(el, binding) {
    
    // 聚焦元素
    el.orgWinWidth = isOverWidth() ? window.innerWidth : w;
    el.firstLoad = true

    if (binding.modifiers.show) {
      el.style.display = 'none'
    }
    
    el.scrollFunc = function() {
      if (el.firstLoad) {
        el.firstLoad = false
      }

      let isShowType = binding.modifiers.show

      if (binding.value && isShowType) {
        let Top = document.documentElement.scrollTop || document.body.scrollTop;
        if (Top > binding.value) {
          el.style.display = 'block'
        } else {
          el.style.display = 'none'
        }
      }

      if (binding.value && !isShowType) {
        let Top = document.documentElement.scrollTop || document.body.scrollTop;
        binding.value = Number(binding.value)
        if (Top > el.orgTop - binding.value) {
          el.style.position = 'fixed'
          el.style.top = binding.value + 'px'
          el.style.zIndex = 10
          el.style.width = el.orgWidth + 'px'
          el.style.left = 'auto'
        } else {
          el.style.position = ''
          el.style.top = 'auto'
        }
      }

      if (!isOverWidth()) {
        let left = document.documentElement.scrollLeft || document.body.scrollLeft;
        el.style.left = el.orgLeft - left + 'px';
      }
    };

    el.resizeFunc = function() {
      // 重置窗口时改变初始left
      el.orgLeft = el.getBoundingClientRect().left;
      let currWidth = document.documentElement.clientWidth || document.body.clientWidth;
      if (currWidth >= w) {
        el.style.left = 'auto'
      } 
    }
    window.addEventListener('scroll', el.scrollFunc);

    window.addEventListener('resize', el.resizeFunc);
  },
  componentUpdated: function (el) {
    if (el.firstLoad) {
      Vue.nextTick(() => {
        // let winTop = document.documentElement.scrollTop || document.body.scrollTop;
        // let winLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
        el.orgLeft = el.getBoundingClientRect().left;
        el.orgTop = el.getBoundingClientRect().top;
        // console.log(el.getBoundingClientRect().top, winTop)
        el.orgWidth = el.getBoundingClientRect().width;
      })
    }
  },
  unbind: function(el) {
    window.removeEventListener('scroll', el.scrollFunc);
    window.removeEventListener('resize', el.resizeFunc);
  }
});

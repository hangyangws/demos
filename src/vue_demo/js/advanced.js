var response = new Vue({
  el: '#response',
  data: {
    mybtn: {
      text: 'btn'
    }
  },
  methods: {
    setColorError: function() {
      this.mybtn.color = 'red'
    },
    setColorSuccess: function() {
      delete this.mybtn.color // 如果以setColorError设置过就必须先删除
      this.$set(this.mybtn, 'color', 'red')
    }
  }
})


var nextTick = new Vue({
  el: '#nextTick',
  data: {
    nextTick: 'nextTick'
  },
  methods: {
    changeNextTick: function() {
      this.nextTick = this.nextTick === 'nextTick' ? 'changeNextTick' : 'nextTick'
      console.log('数据改变前的DOM', this.$el.querySelector('.next-tick').innerHTML)
      // Vue.nextTick(function() {
      // 这一句和下一句是一个意思，不过使用这一句不能使用this，因为this为Vue，可以使用nextTick
      this.$nextTick(function() {
        console.log('数据改变后的DOM', this.$el.querySelector('.next-tick').innerHTML)
      })
    }
  }
})

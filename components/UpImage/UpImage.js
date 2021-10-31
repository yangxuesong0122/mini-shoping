// components/UpImage/UpImage.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    src: {
      type: String,
      value: ''
    },
    inde: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleDeleteImage(e) {
      const {ix} = e.currentTarget.dataset
      // 触发父组件中的事件
      this.triggerEvent('imgDel', {ix})
    }
  }
})

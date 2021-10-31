Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: '体验问题',
        isActive: true
      },
      {
        id: 1,
        value: '商品/商家投诉',
        isActive: false
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // tabs点击事件
  handleTabsItemChange(e) {
    const {index} = e.detail
    this.changeTitleByIndex(index)
    // 重新发送请求
    this.getOrderList(index + 1)
  },
  // 根据标题索引来激活选中标题数组
  changeTitleByIndex(index) {
    let {tabs} = this.data
    tabs.forEach((item, i) => {
      if (i === index) {
        item.isActive = true
      } else {
        item.isActive = false
      }
    })
    this.setData({
      tabs
    })
  }
})
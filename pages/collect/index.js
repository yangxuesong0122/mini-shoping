Page({
  /**
   * 页面的初始数据
   */
  data: {
    collect: [],
    tabs: [
      {
        id: 0,
        value: '商品收藏',
        isActive: true
      },
      {
        id: 1,
        value: '品牌收藏',
        isActive: false
      },
      {
        id: 2,
        value: '店铺收藏',
        isActive: false
      },
      {
        id: 2,
        value: '浏览足迹',
        isActive: false
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow() {
    const collect = wx.getStorageSync('goodsCollect')
    this.setData({
      collect
    })
  },
  // tab点击事件
  handleTabsItemChange(e) {
    const {index} = e.detail
    this.changeTitleByIndex(index)
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
  },
})
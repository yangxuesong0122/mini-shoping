Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    collectGoodsNum: 0
  },
  onShow() {
    const userInfo = wx.getStorageSync('userInfo')
    this.setData({userInfo})
    // 获取缓存中的收藏的商品
    let collectGoods = wx.getStorageSync('goodsCollect') || []
    this.setData({
      collectGoodsNum: collectGoods.length
    })
  }
})
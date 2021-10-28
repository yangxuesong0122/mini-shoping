import { request } from "../../request/index"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    leftMenuList: [], // 左侧菜单数据
    rightGoodList: [], // 右侧商品数据
    currentIndex: 0 // 当前选中菜单下标
  },
  cates: [], // 接口的返回数据
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCates()
  },
  // 获取分类数据
  getCates() {
    request({
      url: 'categories'
    }).then(data => {
      this.cates = data
      // 左侧菜单数据
      let leftMenuList = this.cates.map(item => item.cat_name)
      // 右侧商品数据
      let rightGoodList = this.cates[0].children
      this.setData({
        leftMenuList,
        rightGoodList
      })
    })
  },
  // 左侧菜单点击事件
  handleMenuClick(e) {
    const {index} = e.currentTarget.dataset
    let rightGoodList = this.cates[index].children
    this.setData({
      currentIndex: index,
      rightGoodList
    })
  }
})
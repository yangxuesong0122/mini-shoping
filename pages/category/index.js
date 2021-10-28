import { request } from "../../request/index"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    leftMenuList: [], // 左侧菜单数据
    rightGoodList: [], // 右侧商品数据
    currentIndex: 0, // 当前选中菜单下标
    scrollTop: 0 // 右侧内容滚动条距离顶部的距离
  },
  cates: [], // 接口的返回数据
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /* 
    web中的本地存储和小程序中的本地存储的区别
      1 写代码的方式不一样 
        web: localStorage.setItem("key","value") localStorage.getItem("key")
    小程序中: wx.setStorageSync("key", "value"); wx.getStorageSync("key");
      2:存的时候 有没有做类型转换
        web: 不管存入的是什么类型的数据，最终都会先调用一下 toString(),把数据变成了字符串 再存入进去
        小程序: 不存在类型转换这个操作，存什么类型的数据进去，获取的时候就是什么类型
    1 先判断一下本地存储中有没有旧的数据
      {time:Date.now(),data:[...]}
    2 没有旧数据 直接发送新请求 
    3 有旧的数据 同时 旧的数据也没有过期 就使用 本地存储中的旧数据即可
     */
    //  1 获取本地存储中的数据 (小程序中也是存在本地存储技术)
    const cates = wx.getStorageSync("cates");
    // 2 判断
    if (!cates) {
      // 不存在  发送请求获取数据
      this.getCates();
    } else {
      // 有旧的数据 定义过期时间
      if (Date.now() - cates.time > 1000 * 10) {
        // 重新发送请求
        this.getCates();
      } else {
        // 可以使用旧的数据
        this.cates = cates.data;
        let leftMenuList = this.cates.map(v => v.cat_name);
        let rightGoodList = this.cates[0].children;
        this.setData({
          leftMenuList,
          rightGoodList
        })
      }
    }
  },
  // 获取分类数据
  getCates() {
    request({
      url: 'categories'
    }).then(data => {
      this.cates = data
      // 把接口的数据存入到本地存储中
      wx.setStorageSync("cates", { time: Date.now(), data: this.cates });
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
      rightGoodList,
      scrollTop: 0 // 重新设置右侧内同的scroll-view标签距离顶部的距离
    })
  }
})
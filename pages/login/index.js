import { getUserProfile } from "../../utils/asyncWx"
Page({
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 获取用户信息
  async handleGetUserProfile() {
    try {
      // 获取用户信息
      let {userInfo} = await getUserProfile()
      wx.setStorageSync('userInfo', userInfo)
      wx.navigateBack({
        delta: 1
      })
    } catch(err) {
      console.log(err)
    }
  }
})
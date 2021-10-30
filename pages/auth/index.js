import { getUserProfile, login } from "../../utils/asyncWx"
import { request } from "../../request/index"
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
      let userInfo = await getUserProfile()
      const {encryptedData, rawData, iv, signature} = userInfo
      // 获取小程序登录成功后的code
      const {code} = await login()
      const lofinParams = {
        code,
        encryptedData,
        rawData,
        iv,
        signature
      }
      // 发送请求获取用户token
      // const {token} = await request({
      //   url: 'users/wxlogin',
      //   method: 'post',
      //   data: lofinParams
      // })
      // 由于没有企业账号，这里的token是null，先用写死的token
      // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo
      // 把token存到缓存，同时跳转到上一个页面
      wx.setStorageSync('token', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo');
      // 返回上一个页面
      wx.navigateBack({
        delta: 1
      })
    } catch(err) {
      console.log(err)
    }
  }
})
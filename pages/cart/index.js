/*1 获取用户的收货地址
    1 绑定点击事件
    2 调用小程序内置 api  获取用户的收货地址  wx.chooseAddress
  2 获取用户对小程序所授予获取地址的权限状态 scope
    1 假设 用户 点击获取收货地址的提示框 确定  authSetting scope.address 
      scope 值 true 直接调用 获取收货地址
    2 假设 用户 从来没有调用过 收货地址的api 
      scope undefined 直接调用 获取收货地址
    3 假设 用户 点击获取收货地址的提示框 取消   
      scope 值 false 
      1 诱导用户 自己 打开 授权设置页面(wx.openSetting) 当用户重新给与 获取地址权限的时候 
      2 获取收货地址
    4 把获取到的收货地址 存入到 本地存储中
 */
import { getSetting, chooseAddress, openSetting } from "../../utils/asyncWx"
// 勾选开发者工具里面的增强编译即可
// import regeneratorRuntime from '../../lib/runtime/runtime'

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
  // 获取收货地址
  async handleChooseAddress() {
    // 获取权限状态
    // wx.getSetting({
    //   success: (result) => {
    //     const scopeAddress = result.authSetting['scope.address']
    //     if (scopeAddress || scopeAddress === undefined) {
    //       wx.chooseAddress({
    //         success: (result1) => {
    //           console.log(result1)
    //         }
    //       })
    //     } else {
    //       // 用户以前拒绝过授予权限，先诱导用户打开授权页面
    //       wx.openSetting({
    //         success: (result2) => {
    //           wx.chooseAddress({
    //             success: (result3) => {
    //               console.log(result3)
    //             }
    //           })
    //         }
    //       })
    //     }
    //   },
    //   fail: () => {},
    //   complete: () => {}
    // })

    try {
      // 获取权限状态
      const res1 = await getSetting()
      const scopeAddress = res1.authSetting['scope.address']
      // 判断权限状态
      if (scopeAddress === false) {
        // 诱导用户打开授权页面
        await openSetting()
      }
      // 调用获取收货地址的api
      const address = await chooseAddress()
      // 存入到缓存中
      wx.setStorageSync('address', address)
    } catch (error) {
      console.log(error)
    }
  }
})
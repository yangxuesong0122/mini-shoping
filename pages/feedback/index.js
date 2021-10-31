/* 
1 点击 “+” 触发tap点击事件
  1 调用小程序内置的 选择图片的 api
  2 获取到 图片的路径  数组
  3 把图片路径 存到 data的变量中
  4 页面就可以根据 图片数组 进行循环显示 自定义组件
2 点击 自定义图片 组件
  1 获取被点击的元素的索引
  2 获取 data中的图片数组
  3 根据索引 数组中删除对应的元素
  4 把数组重新设置回data中
3 点击 “提交”
  1 获取文本域的内容 类似 输入框的获取
    1 data中定义变量 表示 输入框内容
    2 文本域 绑定 输入事件 事件触发的时候 把输入框的值 存入到变量中 
  2 对这些内容 合法性验证
  3 验证通过 用户选择的图片 上传到专门的图片的服务器 返回图片外网的链接
    1 遍历图片数组 
    2 挨个上传
    3 自己再维护图片数组 存放 图片上传后的外网的链接
  4 文本域 和 外网的图片的路径 一起提交到服务器 前端的模拟 不会发送请求到后台。。。 
  5 清空当前页面
  6 返回上一页 
 */
  import { showToast } from "../../utils/asyncWx"
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
    ],
    // 选中的图片路径数组
    chooseImages: [],
    // 文本域内容
    textVal: ''
  },
  // 外网的图片的路径数组
  upLoadImags: [],

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
  },
  // 上传图片
  handleUpImage() {
    // 调用小程序内置选择图片
    wx.chooseImage({
      count: 9, // 选择图片数量
      sizeType: ['original', 'compressed'], // 图片格式，原图，压缩
      sourceType: ['album', 'camera'], // 图片来源 相册 相机
      success: (result) => {
        this.setData({
          chooseImages: [...this.data.chooseImages, ...result.tempFilePaths]
        })
      },
      fail: () => {},
      complete: () => {}
    });
      
  },
  // 子组件触发事件
  handleBindimgDel(e) {
    const {ix} = e.detail
    // 获取deda中的图片数组
    let {chooseImages} = this.data
    // 删除元素
    chooseImages.splice(ix, 1)
    this.setData({
      chooseImages
    })
  },
  // 文本域的输入事件
  handleTextInput(e) {
    console.log(e)
    this.setData({
      textVal: e.detail.value
    })
  },
  // 提交事件
  async handleTiJiao() {
    // 获取文本域内容
    const {textVal, chooseImages} = this.data
    // 合法性的验证
    if (!textVal.trim()) {
      // 不合法
      await showToast('输入不合法')
      return
    }
    // 把图片上传到专门的图片服务器
    // 上传文件的 api 不支持 多个文件同时上传  遍历数组 挨个上传 
    // 显示正在等待的图片
    chooseImages.forEach((v, i) => {
      wx.uploadFile({
        url: 'https://images.ac.cn/Home/Index/UploadAction/',
        filePath: v, // 被上传的文件路径
        name: "file", // 上传的文件名称，后台来获取文件
        formData: {}, // 顺带的文本信息
        success: (result) => {
          let url = JSON.parse(result.data).url
          this.upLoadImags.push(url)
          // 所有文件上传完毕才触发
          if (i === chooseImages.length - 1) {
            console.log('把文本的内容和外网的图片数组提交到后台中')
            // 提交都成功了
            // 重置页面
            this.setData({
              chooseImages: [],
              textVal: ''
            })
            // 返回到上一页
            wx.navigateBack({
              delta: 1
            });
          }
        }
      })
    })
  }
})
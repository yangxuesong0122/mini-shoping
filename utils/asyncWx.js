export const getSetting = () => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err)
      }
    });
  })
}

export const chooseAddress = () => {
  return new Promise((resolve, reject) => {
    wx.chooseAddress({
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err)
      }
    });
  })
}

export const openSetting = () => {
  return new Promise((resolve, reject) => {
    wx.openSetting({
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err)
      }
    });
  })
}

export const showModal = (content) => {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: '提示',
      content,
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    });
  })
}

export const showToast = (content) => {
  return new Promise((resolve, reject) => {
    wx.showToast({
      title: content,
      icon: 'none',
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    });
  })
}

export const getUserProfile = (content) => {
  return new Promise((resolve, reject) => {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    });
  })
}

export const login = (content) => {
  return new Promise((resolve, reject) => {
    wx.login({
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    });
  })
}

export const requestPayment = (pay) => {
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      ...pay,
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err)
      }
    });
      
  })
}
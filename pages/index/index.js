// const { apiUrl, apiAppId, apiAppSecret } = getApp().config

Page({
  /**
   * 页面的初始数据
   */
  data: {
    image: '/assets/placeholder.jpg',
    showTips: false,
    result: null,
    sign: null
  },

  /**
   * 分析照片
   */
  detectImage(imgbase64) {
    const that = this

    // 取消之前的结果显示
    that.setData({ result: null })

    // loading
    wx.showLoading({ title: '分析中...' })
    console.log(that.data.imgbase64)
    var params = {};
    params.image = imgbase64
    this.getReqSign(params,'SFFaDRax3Q8MxNLc')

    // 将图片上传至 AI 服务端点
    wx.request({
      url: 'https://api.ai.qq.com/fcgi-bin/ptu/ptu_faceage',
      data: 'object',
      method: "POST",
      success (res) {
        // 解析 JSON
        const result = JSON.parse(res.data)

        if (result.ret === 0) {
          // 成功获取分析结果
          that.setData({ result: result.data.face[0] })
        } else {
          // 检测失败
          wx.showToast({ icon: 'none', title: '找不到你的小脸蛋喽～' })
        }

        // end loading
        wx.hideLoading()
      }
    })
  },

  /**
   * 获取照片
   */
  getImage (type = 'camera') {
    const that = this

    // 调用系统 API 选择或拍摄照片
    wx.chooseImage({
      sourceType: [type], // camera | album
      sizeType: ['compressed'], // original | compressed
      count: 1,
      success (res) {
        // 取照片对象
        const image = res.tempFiles[0]

        // 图片过大
        if (image.size > 1024 * 1000) {
          return wx.showToast({ icon: 'none', title: '图片过大, 请重新拍张小的！' })
        }

        // 显示到界面上
        that.setData({ image: image.path })

        wx.request({
          url: res.tempFilePaths[0],
          responseType: 'arraybuffer', //最关键的参数，设置返回的数据格式为arraybuffer
          success: res => {
            //把arraybuffer转成base64
            let base64 = wx.arrayBufferToBase64(res.data);
            //不加上这串字符，在页面无法显示的哦
            base64 　= 'data:image/jpeg;base64,' + base64
            // 分析检测人脸
            that.detectImage(base64)
          }
        })
      }
    })

    // 关闭 Tips 显示
    this.setData({ showTips: false })
  },

  /**
   * 按钮事件处理函数
   */
  handleClick (e) {
    if (e.type === 'tap') {
      // 短按拍照为拍摄照片
      this.getImage()
    } else if (e.type === 'longpress') {
      // 长按拍照为选择照片
      this.getImage('album')
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    const isUsed = wx.getStorageSync('is_used')
    if (isUsed) return
    // 第一次使用显示 Tips
    this.setData({ showTips: true })
    // 并记住用使用过了
    wx.setStorageSync('is_used', true)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage () {
    if (!this.data.result) return
    // 如果有分析结果，则分享
    return { title: `刚刚测了我的颜值「${this.data.result.beauty}」你也赶紧来试试吧！` }
  },

  getReqSign(params, appkey) {
    /**
     *  app_id	10000	应用标识
        time_stamp	1493449657	秒级时间戳
        nonce_str	20e3408a79	随机字符串
        key1	腾讯AI开放平台	接口请求数据，本示例为UTF-8编码
        key2	示例仅供参考	接口请求数据，本示例为UTF-8编码
        sign		接口请求签名，待计算
     */
    // 1. 字典升序排序
    params.appid = 2122110749;
    params.time_stamp = (new Date()).valueOf();;
    params.nonce_str = Math.random().toString(36).substr(2);
    let paramsJson = JSON.stringify(params)
    console.log(paramsJson)

    // 2. 拼按URL键值对
    

    // 3. 拼接app_key

    // 4. MD5运算+转换大写，得到请求签名
  }


})



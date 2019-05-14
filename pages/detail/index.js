Page({
  data:{
    detail:null
  },
  onLoad(options){
    console.log(options.id);
    var that = this;
    wx.request({
      url: 'https://www.chifengbei.com/getStoreDetail',
      data:{
        storeId: options.id
      },
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        that.setData({
          'detail': res.data
        })
      }
    })
  },
  showWechat(){
    wx.previewImage({
      current: this.data.detail.wechat, // 当前显示图片的http链接
      urls: [this.data.detail.wechat] // 需要预览的图片http链接列表
    })
  },
  callPhone(){
    wx.makePhoneCall({
      phoneNumber: this.data.detail.phone
    });
  }
})
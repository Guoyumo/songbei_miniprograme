Page({
  data:{
    lists:[
    ]
  },
  onLoad(){
    var that = this;
    wx.request({
      url: 'https://www.chifengbei.com/getStore',
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        that.setData({
          'lists': res.data
        });
      }
    })
  },
  callPhone:function(e){
   var phone = e.target.dataset.phone;
   console.log(phone);
    wx.makePhoneCall({
      phoneNumber: phone
    });
  },
  viewDetail:function(e){
    var store_id = e.target.dataset.id;
    console.log(store_id);
    wx.navigateTo({
      url: '/pages/detail/index?id=' +store_id
    })
  }
})
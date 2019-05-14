const { $Message } = require('../../dist/base/index');

Page({
  data: {
    current: 'tab1',
    tabs: [
      {
        key: 'key1',
        title: '厢式货车',
        content: {
          image: "https://www.chifengbei.com/images/max.jpg"
        },
      },
      {
        key: 'key2',
        title: '摩托车',
        content: {
          image: "https://www.chifengbei.com/images/min.jpg",
        },
      },
      {
        key: 'key3',
        title: '小型平板',
        content: {
          image: "https://www.chifengbei.com/images/middle.jpg"
        },
      }
    ],
    startLocation: "",
    finishLocation: "",
    switch1: false,
    phoneNumber: "",
    remark: "",
    name: "",
    couldSubmit:true,
    date: "",
    startDate:"",
    endDate:"",
    startTime:"09:00",
    time: "12:00",
    wechatPay:{
      timeStamp: "",
      nonceStr: "",
      package: "",
      signType: 'MD5',
      paySign: "",
    }
  },
  onLoad() {
    var today = new Date(),
        year = today.getFullYear(),
        month = today.getMonth() + 1,
        day = today.getDate();

    var startDate = year + '-' + (month>9 ? "" : "0") + month + '-' + (day> 9 ? '' : '0') + day;
    
    today.setDate(today.getDate() + 10);

    year = today.getFullYear();
    month = today.getMonth() + 1;
    day = today.getDate();

    var endDate = year + '-' + (month > 9 ? "" : "0") + month + '-' + (day > 9 ? '' : '0') + day;

    this.setData({
      startDate:startDate,
      date:startDate,
      endDate:endDate
    })
    
  },
  onTabsChange(e) {
    console.log('onTabsChange', e)
    const { key } = e.detail
    const index = this.data.tabs.map((n) => n.key).indexOf(key)

    this.setData({
      key,
      index,
    })
  },
  onSwiperChange(e) {
    console.log('onSwiperChange', e)
    const { current: index, source } = e.detail
    const { key } = this.data.tabs[index]
    if (!!source) {
      this.setData({
        key,
        index,
      })
    }
  },
  chooseStartLocation({ detail }) {
    var that = this;
    
        that.setData({
          startLocation: detail.detail.value
        });
  },
  chooseFinishLocation({ detail }) {
    var that = this;

        that.setData({
          finishLocation: detail.detail.value
        });
  },
  onSwitchChange(event) {
    var detail = event.detail;
    this.setData({
      'switch1': detail.value
    })

  },
  changePhoneNumber({ detail }) {
    this.setData({
      phoneNumber: detail.detail.value
    })
  },
  changeRemark({ detail }) {
    this.setData({
      remark: detail.detail.value
    })
  },
  changeName({ detail }) {
    this.setData({
      name: detail.detail.value
    })
  },
  bindDateChange: function (e) {
    if(e.detail.value == this.data.startDate){
      console.log("today");
      var date = new Date();
      var min = date.getMinutes();
      date.setMinutes(min + 15);

      var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
      var min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();

      console.log(hour + ':' + min);
      this.setData({
        date: e.detail.value,
        startTime: hour + ':' + min,
        time: hour + ':' + min
      })
    }else{
     this.setData({
       date: e.detail.value
     }); 
    }
    
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },

  login(){
    var self = this;
    wx.login({
      success(res) {
        if (res.code) {
          console.log(res.code);
          // 发起网络请求
          wx.request({
            url: 'https://www.chifengbei.com/wxLogin',
            data: {
              code: res.code
            },
            success(result){
              console.log(result);

              self.setData({
                wechatPay:{
                  timeStamp: result.data.timeStamp.toString(),
                  nonceStr: result.data.nonceStr,
                  package: result.data.package,
                  signType: 'MD5',
                  paySign: result.data.paySign
                }
              })
              self.handleClick();       
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  handleClick() {
    let that = this;
    let key = this.data.key;
    let car = "";
    let switch1 = this.data.switch1;

    if(this.data.couldSubmit){
      this.setData({
        couldSubmit:false
      });
    }else{
      return
    }
    
    if (switch1 == null) {
      switch1 = false;
    }
    if (key == undefined || key == 'key1') {
      car = "厢式货车";
    } else if (key == "key2") {
      car = "摩托车";
    } else {
      car = "小型平板";
    }
    console.log(switch1);
    var postData = {
      name: this.data.name,
      isImportant: switch1,
      startLocation: this.data.startLocation,
      finishLocation: this.data.finishLocation,
      phone: this.data.phoneNumber,
      remark: this.data.remark,
      car: car,
      dateTime: this.data.date + this.data.time
    };
    console.log(postData);
    let validate = this.validate(postData);
    if (!validate.type) {
      $Message({
        content: validate.content,
        type: 'error'
      });
    } else {
      wx.request({
        url: 'https://www.chifengbei.com/createOrder',
        data: postData,
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          that.setData({
            couldSubmit: true
          });
          that.wechatPayment();
        }
      })
    }

  },

  wechatPayment(){
    var self = this;
    wx.requestPayment(
    {
      'timeStamp': self.data.wechatPay.timeStamp,
      'nonceStr': self.data.wechatPay.nonceStr,
      'package': self.data.wechatPay.package,
      'signType': 'MD5',
      'paySign': self.data.wechatPay.paySign,
      'success':function(res){
        console.log(res);
    },
      'fail':function(res){},
      'complete':function(res){}
    })
  },
  validate(postData) {
    let finishLocation = postData.finishLocation,
      startLocation = postData.startLocation,
      phone = postData.phone,
      remark = postData.remark;
    let regu = /^((\+?[0-9]{1,4})|(\(\+86\)))?(13[0-9]|14[57]|15[012356789]|16[6]|17[035678]|18[0-9]|19[8-9])\d{8}$/,
      re = new RegExp(regu);
    if (!re.test(phone)) {
      return {
        type: false,
        content: "请输入正确的发件人手机号"
      }
    }
    if (!re.test(remark)) {
      return {
        type: false,
        content: "请输入正确的收件人手机号"
      }
    }


    if (startLocation == "发货地址") {
      return {
        type: false,
        content: "请输入正确的发货地址"
      }
    }

    if (finishLocation == "收货地址") {
      return {
        type: false,
        content: "请输入正确的收货地址"
      }
    }
    return { type: true };
  },
  handleTest(){
    wx.navigateTo({
      url: '../../pages/lists/index',
    })
  }
});
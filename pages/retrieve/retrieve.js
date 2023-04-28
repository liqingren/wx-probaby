const { postParamsRequest } = require("../../utils/request");

// pages/retrieve/retrieve.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',//手机号
    newPass:'',//新密码
    checkPass:'',//确认新密码
    show:true,//判断新密码是否显示
    showCheck:true,//判断确认密码是否显示
    saveBtnState:true,//判断保存按钮是否可用

  },


   /**
   * 保存按钮可用：账号、新密码、确认密码都不能为空
   * 判断账号是否为空
   * 判断保存按钮是否可用
   * @param {*} e 输入信息
   */
  phoneInput:function(e){
    var val = e.detail.value;
    if(val != ''){
      this.setData({
        phone:val
      })
      
      //判断保存按钮是否可用
      if(this.data.newPass != '' && this.data.checkPass != ''){
        this.setData({
          saveBtnState:false
        })
      }
    }else{
      this.setData({
        saveBtnState:true
      })
    }
  },


  /**
   * 新密码
   * @param {*} e 
   */
  newPassInput:function(e){
    var val = e.detail.value;
    if(val != ''){
      this.setData({
        newPass:val,
        
      });
     
      //判断注册按钮是否可用
      if(this.data.phone != "" && this.data.checkPass !=""){
        this.setData({
          saveBtnState:false
        })
      }
    }else{
      this.setData({
        saveBtnState:true
      })
    }
  },



  /**
   * 确认密码
   * @param {*} e 
   */
  checkPassInput:function(e){
    var val = e.detail.value;
    if(val != ''){
      this.setData({
        checkPass:val
      })
     
      //判断注册按钮是否可用
      if(this.data.phone != "" && this.data.checkPass !=""){
        this.setData({
          saveBtnState:false
        })
      }
    }else{
      this.setData({
        saveBtnState:true
      })
    }
  },


  /**
   * 隐藏/显示新密码
   */
  showPass:function(){
    this.setData({
      show:!this.data.show
    })
  },

  /**
   * 隐藏/显示确认密码
   */
  showCheckPass:function(){
    this.setData({
      showCheck:!this.data.showCheck
    })
  },



  /**
   * 保存
   * @param {*} e 
   */
  savePassword:function(e){
    var phone = this.data.phone;
    var newPass = this.data.newPass;
    var checkPass = this.data.checkPass;
    if(phone.length<11){
      wx.showToast({
        title: '手机号不合法',
        icon:'none'
      })
      return
    }else if(phone.length == 11){
      //校验手机号是否合法
      var telRegex = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
      if(!telRegex.test(phone)){
        wx.showToast({
          title: '手机号格式有误',
          icon:'none'
        })
        return
      }
    }

    if(newPass.length<6){
      wx.showToast({
        title: '密码至少6位，请重新输入',
        icon:'none'
      })
      return
    }

    if(checkPass != newPass){
      wx.showToast({
        title: '两次密码输入不一致！',
        icon:'none'
      })
      return
    }

    //修改密码
    postParamsRequest("/user/changePass",{
      phone:phone,
      newPass:newPass
    }).then((value) =>{
      const {code,msg} = value;
      if(code == 200){
        wx.navigateBack({
          delta:1,
          success:function(res){
            setTimeout(() =>{
              var page = getCurrentPages().pop();
              page.setData({
                phone:phone
              })
            },20)
          }
        })
      }else{
        wx.showToast({
          title: msg,
        })
      }
    })


  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})
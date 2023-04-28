// pages/phoneLogin/phoneLogin.js
import {postParamsRequest} from '../../utils/request.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginBtnState:true, //登录按钮是否可用
    open:false, //是否隐藏密码
    phone:"", //手机号
    password:"", //密码

  },

  /**
   * 登录按钮可用：账号和密码都不能为空
   * 判断账号是否为空
   * 判断登录按钮是否可用
   * @param {*} e 输入信息
   */
  phoneInput:function(e){
    var val = e.detail.value;
    if(val != ''){
      this.setData({
        phone:val
      })
      
      //判断登录按钮是否可用
      if(this.data.password != ""){
        this.setData({
          loginBtnState:false
        })
      }
    }else{
      this.setData({
        loginBtnState:true
      })
    }
  },

    /**
   * 登录按钮可用：账号和密码都不能为空
   * 判断密码是否为空
   * 判断登录按钮是否可用
   * @param {*} e 输入信息
   */
  passwordInput:function(e){
    var val = e.detail.value;
    if(val != ''){
      this.setData({
        password:val
      })
      if(this.data.username != ""){
        this.setData({
          loginBtnState:false
        })
      }
    }else{
      this.setData({
        loginBtnState:true
      })
    }
  },

  /**
   * 隐藏/显示密码
   */
  showPass:function(){
    this.setData({
      open:!this.data.open
    })
  },

  /**
   * 登录
   */
  login:function(){
    //校验手机号是否合法
    if(this.data.phone.length<11){
      wx.showToast({
        title: '手机号不合法',
        icon:'none'
      })
      return
    }else if(this.data.phone.length == 11){
       //校验手机号是否合法
       var telRegex = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
       if(!telRegex.test(this.data.phone)){
         wx.showToast({
           title: '手机号格式有误',
           icon:'none'
         })
         return
       }
    }

    //登录
    postParamsRequest('/user/phonelogin',
      {phone:this.data.phone,
      password:this.data.password}
    ).then((value) =>{
      const {code,data,msg} = value;
      if(code == 200){
        //将token，user存入storage中，并设置一个月过期时间
        wx.setStorageSync('token', data.token,1000 * 60 * 60 * 24*30);
        wx.setStorageSync('user', data.user,1000 * 60 * 60 * 24*30);
        //跳转到亲宝宝首页，并刷新页面
        wx.switchTab({
          url: '../index/index',
          success: function(e) {
            var page = getCurrentPages().pop();
            if (page == undefined || page == null) {
              return
            }
            page.onLoad();//重新加载页面
          }
        })
      }else{
        wx.showToast({
          title: msg,
          icon:'error'
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
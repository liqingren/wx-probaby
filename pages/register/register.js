// pages/register/register.js
import {postRequest} from '../../utils/request.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    registerBtnState:true, //注册按钮是否可用
    open:false, //密码是否可见
    user:{
      phone:"",
      password:"",
      username:"",
    },//注册对象
  },

  /**
   * 注册按钮可用：手机号、密码、昵称都不能为空
   * 判断手机号是否为空
   * 判断注册按钮是否可用
   * @param {*} e 输入信息
   */
   
  phoneInput:function(e){
    var val = e.detail.value;
    if(val != ''){
      this.setData({
        'user.phone':val
      })

      //判断注册按钮是否可用
      if(this.data.user.password != "" && this.data.user.username !=""){
        this.setData({
          registerBtnState:false
        })
      }
    }else{
      this.setData({
        registerBtnState:true
      })
    }
  },


  /**
   * 注册按钮可用：手机号、密码、昵称都不能为空
   * 判断密码是否为空
   * 判断注册按钮是否可用
   * @param {*} e 输入信息
   */
  passwordInput:function(e){
    var val = e.detail.value;
    if(val != ''){
      this.setData({
        'user.password':val
      });
     
      //判断注册按钮是否可用
      if(this.data.user.phone != "" && this.data.user.username !=""){
        this.setData({
          registerBtnState:false
        })
      }
    }else{
      this.setData({
        registerBtnState:true
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
   * 注册按钮可用：手机号、密码、昵称都不能为空
   * 判断昵称是否为空
   * 判断注册按钮是否可用
   * @param {*} e 输入信息
   */
  nicknameInput:function(e){
    var val = e.detail.value;
    if(val != ''){
      this.setData({
        'user.username':val
      });
      
      if(this.data.user.phone != "" && this.data.user.password !=""){
        this.setData({
          registerBtnState:false
        })
      }
    }else{
      this.setData({
        registerBtnState:true
      })
    }
  },

  /**
   * 注册
   */
  register:function(){
    //校验手机号是否合法
    if(this.data.user.phone.length<11){
      wx.showToast({
        title: '手机号不合法',
        icon:'none'
      })
      return
    }else if(this.data.user.phone.length == 11){
       //校验手机号是否合法
       var telRegex = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
       if(!telRegex.test(this.data.user.phone)){
         wx.showToast({
           title: '手机号格式有误',
           icon:'none'
         })
         return
       }
    }

    //校验密码是否合法
    if(this.data.user.password.length <6){
      wx.showToast({
        title: '密码至少6位，请重新输入',
        icon:'none'
      })
      return
    }

    //注册
    postRequest('/user/register',this.data.user)
    .then((value) =>{
      const {code,msg} = value;
      if(code === 200){
        wx.showToast({
          title: msg,
          duration:2000,
        });
        let curr = getCurrentPages()  //获取当前页面js里的所有信息
        let prev = curr[curr.length - 2]  //prev 是获取上一个页面的js里面的所有信息 -2 是上一个页面，-3是上上个页面以此类推
        //上一个页面内执行setData操作，将我们想要的信息保存住。当我们返回去的时候，页面已经处理完毕
        if(prev != undefined && prev != null){
          prev.setData({
            phone:this.data.user.phone,
          })
        }
       
        //返回上一个页面
        wx.navigateBack({
          delta:1
        });
      }else{
        wx.showToast({
          title: msg,
          icon:'error'
        })
      }
    })
   
  },

  /**
   * 返回登录页面
   */
  returnLogin:function(){
    wx.reLaunch({
      url: '../login/login',
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
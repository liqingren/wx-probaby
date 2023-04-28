// pages/login/login.js
import {postParamsRequest} from '../../utils/request.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:'',//用户名
    userPhoto:'',//头像
  },

  /**
   * 登录
   */
  login:function(){
     //获取微信用户信息
     wx.getUserProfile({
      desc: '展示用户信息',
      success: (res) => {
        this.setData({
          username: res.userInfo.nickName,
          userPhoto: res.userInfo.avatarUrl,
        });
         // 微信登录
        wx.login({
          success: (res) => {
            //后端请求接口
            postParamsRequest('/user/minilogin',
              {username:this.data.username,
              userPhoto:this.data.userPhoto,
              code:res.code//微信登录唯一标识码
            }).then((value) =>{
              const {code,data,msg} = value;
              if(code === 200){
                let token = data.token;
                let user = data.user;
                let info = data.wechatInfo;
                //将token、openid、user存入storage中，并设置一个月的过期时间
                wx.setStorageSync('token', token,1000 * 60 * 60 * 24*30);
                wx.setStorageSync('openid', info.openid,1000 * 60 * 60 * 24*30);
                wx.setStorageSync('user', user,1000 * 60 * 60 * 24*30);
                wx.switchTab({
                  url: '../index/index',
                  success: function(e) {
                    var page = getCurrentPages().pop();
                    if (page == undefined || page == null) {
                      return
                    }
                    page.onLoad();//刷新页面
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
        })
      },
      fail: (err) => {
        wx.showToast({
          title: '您已拒绝授权，请重新点击并授权',
          icon:'none'
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
    wx.hideHomeButton();
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
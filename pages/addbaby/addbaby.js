// pages/addbaby/addbaby.js
import {postRequest} from '../../utils/request'
import {getAge} from '../../utils/util'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    baby:{
      nickname:'',
      babySex:null,
      babyBirth:'',
    },
    identity:{
      userId:'',
      identity:'',
    },
    birth:null,
    sexList:[
      {sex:true,val:'男孩',checked:false},
      {sex:false,val:'女孩',checked:false}
    ],
    relativeList:[
      {relative:"妈妈",checked:false},
      {relative:"爸爸",checked:false},
      {relative:"其他",checked:false}
    ]
  },
  /**
   * 宝宝性别
   * @param {*} options 
   */
  sexSwitch:function(options){
    let that = this;
    // 按钮索引
    var index = options.currentTarget.dataset.index;
    var list = that.data.sexList;
    for(var i=0;i<list.length;i++){
      if(i !== index){
        list[i].checked = false;
      }else{
        list[i].checked = true;
        that.setData({
          'baby.babySex':list[i].sex
        })
      }
    }
    // 更新
    that.setData({
      sexList: list
    });
  },
   /**
   * 日期选择器
   * @param {*} e 
   */
  bindDateChange: function(e) {
    this.setData({
      'baby.babyBirth': e.detail.value,
      birth:e.detail.value
    })
  },
  /**
   * 宝宝小名
   * @param {*} e 
   */
  nicknameInput:function(e){
    var value = e.detail.value;
    if(value !== null && value !==''){
      this.setData({
        'baby.nickname':value
      })
    }
  },
   /**
   * 身份选择切换 
   */
  relativeSwitch: function (options) {
    let that = this;
    // 按钮索引
    var index = options.currentTarget.dataset.index;
    var list = that.data.relativeList;
    for(var i=0;i<list.length;i++){
      if(i !== index){
        list[i].checked = false;
      }else{
        if(i == 2){
          wx.navigateTo({
            url: '../relative-temp/temp?index='+i,
          })
        }else{
          list[i].checked = true;
          that.setData({
            'identity.identity':list[i].relative
          })
        }
      }
    }
    // 更新
    that.setData({
      relativeList: list
    });
  },
  /**
   * 保存
   */
  handleInsert:function(){
    //获取用户信息，将用户id放入identity对象中
    const user = wx.getStorageSync('user');
    if(user !== null){
      this.setData({
        'identity.userId':user.userId,
        'baby.userId':user.userId
      })
    }
    postRequest('/baby/save',
    {
      baby:this.data.baby,
      identity:this.data.identity
    }
    ).then((value) =>{
      const {code,data,msg} = value;
      if(code == 200){
        if(data.babyBirth != null){
          data.age = getAge(data.babyBirth,new Date());
        }else{
          data.age = null
        }
        wx.setStorageSync('baby', data);
        wx.switchTab({
          url: '../index/index',
          success:res =>{
            var page = getCurrentPages().pop();
            if(page != undefined && page != null){
              page.onLoad()
            }
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
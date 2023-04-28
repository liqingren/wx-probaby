// pages/profile/profile.js
import {postRequest} from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:{},//用户信息
    upUser:{},//修改后的用户信息
    array:['男','女'],//性别
    index:0,//性别下标
    region: ['北京', '北京'],//地区默认值
    customItem: '全部',//地区的第一个值
    regionFlag:false,//判断地区是否被修改
    birth:null,//生日
  },

  /**
   * 昵称输入
   */
  usernameInput:function(e){
    if(e.detail.value !== '' && e.detail.value !== null){
      this.setData({
        'user.username':e.detail.value,
        'upUser.username':e.detail.value
      })
    }
  },

  /**
   * 性别选择器
   * @param {*} e 
   */
  bindPickerChange: function (e) {
    if(e.detail.value == '0'){
      this.setData({
        'user.userSex': true,
        'upUser.userSex':true
      })
    }else if(e.detail.value == '1'){
      this.setData({
        'user.userSex': false,
        'upUser.userSex':false
      })
    }
    
  },


  /**
   * 日期选择器
   * @param {*} e 
   */
  bindDateChange: function(e) {
    this.setData({
      'user.userBirth': e.detail.value,
      'upUser.userBirth':e.detail.value,
      birth:e.detail.value
    })
  },

    /**
   * 地区选择器
   * @param {*} e 
   */
  bindRegionChange: function (e) {
    if(e.detail.value != null){
      let province = e.detail.value[0];
      let city = e.detail.value[1];
      let region = '';
      //对省市做处理
      if(province === '内蒙古自治区'){
        province = '内蒙古';
      }
      if(province === '广西壮族自治区'){
        province = '广西';
      }
      if(province === '西藏自治区'){
        province = '西藏';
      }
      if(province === '宁夏回族自治区'){
        province = '宁夏';
      }
      if(province === '新疆维吾尔自治区'){
        province = '新疆';
      }
      if(province === '香港特别行政区'){
        province = '香港';
        if(city !=='全部'){
          city = '香港';
        }
      }
      if(province === '澳门特别行政区'){
        province = '澳门';
        if(city !=='全部'){
          city = '澳门';
        }
      }
      
      if(province === '全部'){
        province = '';
        if(city === '全部'){
          region = '';
        }
      }else{
        province = province.substr(0,province.length-1);
      }
      if(city === '全部'){
        city = '';
      }
      region = province + " "+city;
      this.setData({
        'user.userCity': region,
        'upUser.userCity':region,
        regionFlag:true
      })
      // console.log(region)
    }
    
  },

  /**
   * 上传图片
   */
  upload:function(){
    let that = this;
   wx.chooseMedia({
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success(res) {
      // console.log("成功",res);
      that.uploadImage(res.tempFiles[0].tempFilePath);
    },
   })
  },

  /**
   * 上传图片到云服务器
   * @param {*} fileURL 
   */
  uploadImage(fileURL) {
    wx.cloud.uploadFile({
      cloudPath:new Date().getTime()+'.png', // 上传至云端的路径
      filePath: fileURL, // 小程序临时文件路径
      success: res => {
        // 返回文件 ID
        // console.log("上传成功",res)
        //获取文件路径
        this.setData({
          'user.userPhoto':res.fileID,
          'upUser.userPhoto':res.fileID
        })
      },
      fail:err =>{
        console.log(err);
      }
    })
  },


  /**
   * 保存修改
   */
  saveInfo:function(){
    let user = this.data.user;
    if(!this.data.regionFlag){
      if(user.userCity === null || user.userCity === ''){
        user.userCity = this.data.region[0]+" "+this.data.region[1];
      }
    }
    postRequest('/user/update',this.data.upUser)
    .then((value) =>{
      const {code,data,msg} = value;
      if(code === 200){
        wx.showToast({
          title: msg,
        });
        
        wx.setStorageSync('user',data);
        this.onLoad();
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
    let userInfo = wx.getStorageSync('user');
    if(userInfo != null){
      var userBirth = userInfo.userBirth;
      this.setData({
        user:userInfo,
        birth:userBirth,
        'upUser.userId':userInfo.userId
      })
    }
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
    // 获取当前页面
    const pages = getCurrentPages();
    // 获取上一级页面
    const beforePage = pages[pages.length - 2];
    if(beforePage != undefined && beforePage != null){
      beforePage.onLoad();
    }
    
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
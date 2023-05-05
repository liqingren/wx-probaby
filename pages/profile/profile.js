// pages/profile/profile.js
import {postParamsRequest, postRequest} from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:{},//用户信息
    array:['女','男'],//性别
    index:0,//性别下标
    birth:null,//生日
    multRegion:[],//当前省市
    province:[],//省
    city:[],//市区
    region:[],//地区
    multIndex:[0,0],//下标
  },

  /**
   * 昵称输入
   */
  usernameInput:function(e){
    if(e.detail.value !== '' && e.detail.value !== null){
      this.setData({
        'user.username':e.detail.value,
      })
    }
  },

  /**
   * 性别选择器
   * @param {*} e 
   */
  bindPickerChange: function (e) {
    this.setData({
      index:parseInt(e.detail.value),
      'user.userSex':parseInt(e.detail.value),
    })    
  },


  /**
   * 日期选择器
   * @param {*} e 
   */
  bindDateChange: function(e) {
    this.setData({
      'user.userBirth': e.detail.value,
      birth:e.detail.value
    })
  },


   /**
   * 改变省
   * @param {*} e 
   */
  multiPickerChange:function(e){
    this.setData({
      multIndex: e.detail.value,
      'user.userCity':e.detail.value[0]+"-"+e.detail.value[1]
    })
  },

  /**
   * 取消按钮：取消则显示原有的地区，若没有，则显示第一个
   * @param {*} e 
   */
  multPickerCancelChange:function(e){
    var user = this.data.user;
    var region = this.data.region;
    var multRegion = this.data.multRegion;
    if(user.userCity != null && user.userCity != ''){
      var multIndex = user.userCity.split("-");
      multIndex[0] = parseInt(multIndex[0]);
      multIndex[1] = parseInt(multIndex[1]);
      this.setData({
        multIndex:multIndex
      })
    }else{
      var multIndex = [0,0];//初始下标
      this.setData({
        multIndex:multIndex
      })
    }
    var children = region[this.data.multIndex[0]].children;
    //省对应的所有市区
    var city = [];
    for(var j = 0;j<children.length;j++){
      city.push(children[j].name)
    }
    multRegion[1] = city;
    this.setData({
      multRegion:multRegion
    })
  },


  /**
   * 改变市区
   * @param {*} e 
   */
  multiPickerColumnChange:function(e){
    var data = {
      multRegion: this.data.multRegion,
      multIndex: this.data.multIndex
    };
    data.multIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0://第一列改变，省对应的市区改变
        var index = data.multIndex[0];
        var region = this.data.region;
        var children = region[index].children;
        var city = [];
        for(var i =0;i<children.length;i++){
          city.push(children[i].name)
        }
        data.multRegion[1] = city;
        data.multIndex[1] = 0;
        break;
    }
    this.setData(data)
   
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
          'user.userPhoto':res.fileID
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
    postRequest('/user/update',this.data.user)
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
        index:Number(userInfo.userSex),
        'upUser.userId':userInfo.userId
      })
    }
    //获取所有的省市二级地区，并对当前用户的地区信息做处理（若没有地区，默认为省市的第一个，若有，则定位到当前的地区）
    postParamsRequest("/region/listregion").then((value) =>{
      const {data} = value;
      var province = [];
      var city = [];
      var multIndex = '';
      var children = '';
      if(userInfo.userCity != null && userInfo.userCity != ''){
        multIndex = userInfo.userCity.split("-");
        multIndex[0] = parseInt(multIndex[0]);
        multIndex[1] = parseInt(multIndex[1]);
        children = data[multIndex[0]].children;
        this.setData({
          multIndex:multIndex
        })
      }else{
        children = data[0].children;
      }
      //所有省
      for(var i = 0 ;i<data.length;i++){
        province.push(data[i].name)
      }
      //省对应的所有市区
      for(var j = 0;j<children.length;j++){
        city.push(children[j].name)
      }
      var list = [province,city];
      this.setData({
        region:data,
        province:province,
        city:city,
        multRegion:list
      })
    })

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
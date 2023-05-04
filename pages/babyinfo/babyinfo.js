// pages/babyinfo/babyinfo.js
import {postParamsRequest, postRequest} from '../../utils/request'
import {getAge} from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baby:{},//宝宝信息
    array:['女','男'],//性别
    arrayIndex:0,//性别下标
    birth:null,//生日
    blood:[],//血型
    index:0,//血型下标
    moment:null,//时刻
    age:null,//年龄
    babyId:'',//宝宝id
    flag:false,//判断是否通过onShow()调用onLoad()刷新页面

  },

  /**
   * 昵称输入框
   * @param {*} e 
   */
  nicknameInput:function(e){
    var val = e.detail.value;
    if(val !== null && val !== ''){
      this.setData({
        'baby.nickname':val
      })
    }
  },

  /**
   * 性别选择器
   * @param {*} e 
   */
  bindSexChange:function(e){
    this.setData({
      'baby.babySex':parseInt(e.detail.value),
      arrayIndex:e.detail.value
    })
  },

    /**
   * 日期选择器
   * @param {*} e 
   */
  bindDateChange: function(e) {
    this.setData({
      'baby.babyBirth':e.detail.value,
      birth:e.detail.value
    })
  },

    /**
   * 血型选择器
   * @param {*} e 
   */
  bindBloodChange: function(e) {
    var index = e.detail.value;
    var blood = this.data.blood;
    this.setData({
      index:index,
      'baby.babyBlood': blood[index]
    })
  },

  /**
   * 时刻选择器
   * @param {*} e 
   */
  bindTimeChange:function(e){
    this.setData({
      'baby.babyMoment':e.detail.value,
      moment:e.detail.value
    })
  },

   /**
   * 上传头像
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
          'baby.babyPhoto':res.fileID
        })
      },
      fail:err =>{
        console.log(err);
      }
    })
  },

  /**
   * 保存
   */
  handleSaveInfo:function(){
    postRequest('/baby/update',this.data.baby)
    .then((value) =>{
      const {code,data,msg} = value;
      // console.log(value);
      if(code == 200){
        wx.removeStorageSync('baby');//移除
        wx.setStorageSync('baby', data);//设置storage缓存
        this.onLoad();
        wx.showToast({
          title: msg,
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
   * 点击身高体重跳转到生长记录页面
   */
  navigateRecord:function(){
    wx.navigateTo({
      url: '../record/record',
    })
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if(options != undefined){
      if(options.babyId != undefined && options.babyId != null){
        this.setData({
          babyId:options.babyId
        })
      }
    }
    if(this.data.babyId != undefined && this.data.babyId != ''){
      postParamsRequest("/baby/getbaby",{babyId:this.data.babyId})
      .then((value) =>{
        const {data} = value; 
        let baby = data.baby;
        let bloods = data.bloods; //血型
        let age = '';
        if(baby.babyBirth !== null){
          age = getAge(baby.babyBirth,new Date());
        }
        for(var i=0;i<bloods.length;i++){
          if(baby.babyBlood === bloods[i]){
            this.setData({
              index:i
            })
          }
        }
        this.setData({
          baby:baby,
          blood:bloods,
          arrayIndex:Number(baby.babySex),//下标（true:1,false:0）
          birth:baby.babyBirth,
          moment:baby.babyMoment,
          age:age
        })
        wx.setStorageSync('baby', baby);
          
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
    if(this.data.flag){
      this.onLoad();//刷新
    }
    this.setData({
      flag:true
    }) 
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
      if(beforePage.data.showBaby){//如果当前亲宝宝页面显示的是动态集合，则刷新页面
        beforePage.onLoad();//刷新页面
      }else{//如果当前亲宝宝页面显示的是宝宝集合，则刷新宝宝集合数据，且隐藏操作框
        var item = beforePage.selectComponent("#baby");//获取子组件
        item.init();//初始化刷新数据
        item.hideModal();//隐藏操作框
      }
     
      
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
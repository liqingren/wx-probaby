const { postRequest } = require("../../utils/request");
const { formatDate } = require("../../utils/util");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:'',
    record:{},
    disableBtnRecord:true,
    babyId:'',//宝宝id

  },

  /**
   * 身高
   * @param {*} e 
   */
  heightInput:function(e){
    var val = e.detail.value;
    if(val != ''){
      this.setData({
        'record.height':val,
        disableBtnRecord:false
      })
    }else{
      this.setData({
        disableBtnRecord:true
      })
    }
    
  },

  /**
   * 体重
   * @param {*} e 
   */
  weightInput:function(e){
    var val = e.detail.value;
    if(val != ''){
      this.setData({
        'record.weight':val,
        disableBtnRecord:false
      })
    }else{
      this.setData({
        disableBtnRecord:true
      })
    }
  },

  /**
   * 头围
   * @param {*} e 
   */
  headInput:function(e){
    var val = e.detail.value;
    if(val != ''){
      this.setData({
        'record.head':val,
        disableBtnRecord:false
      })
    }else{
      this.setData({
        disableBtnRecord:true
      })
    }
  },

  /**
   * 日期选择器
   * @param {*} e 
   */
  bindDateChange:function(e){
    this.setData({
      date:e.detail.value,
      'record.recordTime':e.detail.value
    })
  },

  /**
   * 保存记录
   */
  handleSaveRecord:function(){
    postRequest('/record/save',this.data.record)
    .then((value) => {
      const {code,msg} = value;
      if(code == 200){
       wx.navigateBack({
         delta: 1,
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
    if(options.babyId != undefined){
      //获取跳转页面时携带的babyId
      this.setData({
        babyId:options.babyId
      })
    }
    if(this.data.babyId != undefined && this.data.babyId != ''){
      //记录日期默认为当前日期，并将日期格式化
      var date = formatDate(new Date());
      this.setData({
        date:date,
        'record.recordTime':date,
        'record.babyId':this.data.babyId
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
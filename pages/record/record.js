const {postParamsRequest } = require("../../utils/request");
const {getAge} = require("../../utils/util")

// pages/record/record.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    babyId:null,//宝宝id
    recordList:[],//记录集合
    birth:null,//生日
    winHeight:200,//记录总高度
    flag:false,//判断是否通过onShow()调用onLoad()刷新页面

  },

  

  /**
   * 长按记录删除
   * @param {*} e 
   */
  longpressDelete:function(e){
    let that = this;
    var index = e.currentTarget.dataset.index;
    var records = that.data.recordList;
    var record = records[index];
    wx.showModal({
      title: '提示',
      content: '确定要删除此记录吗？',
      success: function(res) {
        if (res.confirm) {
          postParamsRequest("/record/remove",{recordId:record.recordId})
          .then((value) =>{
            const {code,msg} = value;
            if(code == 200){
              records.splice(index,1);
              that.setData({
                recordList:records
              })
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
          
        } else if (res.cancel) {
          return false;
        }
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var baby = wx.getStorageSync('baby');
    //获取宝宝信息：id和生日（用户计算年龄）
    if(baby != null){
      this.setData({
        babyId:baby.babyId,
        birth:baby.babyBirth
      })
    }
    //获取宝宝所有记录
    postParamsRequest('/record/listrecord',{babyId:this.data.babyId})
    .then((value) =>{
      const {code,data,msg} = value;
      const list = data;
      //计算记录时宝宝的年龄,以及格式化日期
      for(var i=0;i<data.length;i++){
        if(data[i].recordTime !== null){
          list[i].age = getAge(this.data.birth,data[i].recordTime);
        }else{
          list[i].age = '';
        }
      }
      if(code == 200){
        this.setData({
          recordList:list,
          winHeight:this.data.winHeight + data.length*500
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
// pages/tags/tags.js
import {getRequest, postParamsRequest, postRequest} from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tags:[],//全部标签
    tagsList:[],//十条标签
    show:false,//控制显示十条标签还是显示全部标签
    checkedTag:'',//选中的标签内容
    checked:true,//是否选中第一次

  },

  /**
   * 选择框是否选中
   * @param {*} e 
   */
  changeCheckbox:function(e){
    var flag = e.detail.value[0];
    if(flag){//不为空，就选择“第一次”
      this.setData({
        checked:true
      })
    }else{
      this.setData({
        checked:false
      })
    }
  },

  /**
   * 标签输入框
   * @param {*} e 
   */
  tagInput:function(e){
    this.setData({
      checkedTag:e.detail.value
    })
  },

  /**
   * 选择标签
   * @param {*} options 
   */
  tagsSwitch:function(options){
    let that = this;
    // 按钮索引
    var index = options.currentTarget.dataset.index;
    var list = that.data.tags;
    for(var i=0;i<list.length;i++){
      if(i !== index){
        list[i].checked = false;
      }else{
        list[i].checked = true;
        that.setData({
          checkedTag:list[i].content
        })
      }
    }
  },

  /**
   * 保存标签
   */
  handleSaveTag:function(){
    var checked = this.data.checked;
    var tag = '';
    if(checked){
      tag = '第一次';
    }
    tag = tag + this.data.checkedTag;
    postParamsRequest("/tag/save",{content:tag})
    .then((value) =>{
      const {data} = value;
      if(data.content.length<=3){
        data.width = data.content.length * 11 + '%';
      }else{
        data.width = data.content.length * 7 + '%';
      }
      //将增加的标签数据传给动态页面中
      const curr = getCurrentPages();
      const prve = curr[curr.length-2];
      //判断上一个是不是添加动态页面，如果是说明需要返回上一个页面，如果不是，说明需要跳转到添加动态页面
      if(prve != undefined && prve != null){
        var route = prve.route;
        //判断是从编辑动态、增加动态还是从大事记页面进入该页面的
        if(route.indexOf('edittrend') != -1 || route.indexOf('addtrends') !=-1){//若是前两个页面，则需要返回上一个页面
          const list = prve.data.tags;
          if(list == null){
            list = [];
          }        
          list.push(data);
          prve.setData({
            tags:list,
            tagCount:prve.data.tags.length
          });
          //判断标签数量是否大于等于3个，大于等于3个隐藏增加标签的标志
          var count = prve.data.tagCount;
          if(count >=3){
            prve.setData({
              showTag:false
            })
          }
          wx.navigateBack({
            delta: 1
          })
        }else{//若是从大事记页面进入到当前页面的，则需要跳转到增加动态页面
          wx.redirectTo({
            url: '../addtrends/addtrends?tag='+JSON.stringify(data),
          })
        }
      }
      
    })
  },

  /**
   * 返回上一页
   * @param {*} e 
   */
  handleExit:function(){
    wx.navigateBack({
      delta: 1,
      success: (res) => {},
      fail: (res) => {},
      complete: (res) => {},
    })
  },

  /**
   * 点击展开全部标签
   */
  clickShowAll:function(){
    this.setData({
      show:true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;
    postRequest("/tag/listtags",null).then((res) =>{
      const {data} = res;
      for(var i=0;i<data.length;i++){
        data[i].checked = false;
      }
      that.setData({
        tags:data
      })
      //所有标签数量大于10，默认只显示十个，点击更多，展开全部
      if(data.length>10){
        this.setData({
          tagsList:data.slice(0,10)
        })
      }
      // console.log(data);
     
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
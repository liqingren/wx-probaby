Page({

  data: {
		relativeArr:[
      {
        index:0,
        val:"姥姥"
      },
      {
        index:1,
        val:"外婆"
      },
      {
        index:2,
        val:"奶奶"
      },
      {
        index:3,
        val:"外公"
      },
      {
        index:4,
        val:"姥爷"
      },
      {
        index:5,
        val:"爷爷"
      },
      {
        index:6,
        val:"阿姨"
      },
      {
        index:7,
        val:"小姨"
      },
      {
        index:8,
        val:"姨妈"
      },
      {
        index:9,
        val:"姑姑"
      },
      {
        index:10,
        val:"姑妈"
      },
      {
        index:11,
        val:"干妈"
      },{
        index:12,
        val:"舅妈"
      },
      {
        index:13,
        val:"婶婶"
      },
      {
        index:14,
        val:"伯母"
      },
      {
        index:15,
        val:"舅舅"
      },
      {
        index:16,
        val:"叔叔"
      },
      {
        index:17,
        val:"伯父"
      },
      {
        index:18,
        val:"姑父"
      },
      {
        index:19,
        val:"姨父"
      },
      {
        index:20,
        val:"干爸爸"
      },
      {
        index:21,
        val:"姐姐"
      },
      {
        index:22,
        val:"哥哥"
      },
      {
        index:23,
        val:"其他"
      },
      
    ],
    index:null,
  },


  /**
   * 点击选择亲友关系
   * @param {*} e 
   */
  clickRelative:function(e){
    var index = e.currentTarget.dataset.index;
    var relative = this.data.relativeArr[index].val;
    wx.navigateBack({
      delta: 1,
      success: (res) => {
        var curr = getCurrentPages();
        if(curr.length>0){
          for(var i=0;i<curr.length;i++){
            if(curr[i].route.indexOf('addbaby') != -1){
              var page = curr[i];
              var list = page.data.relativeList;
              list[this.data.index].checked = true;
              list[this.data.index].relative = relative;
              page.setData({
                relativeList:list
              })
            }
          }
        }
        
      },
      fail: (res) => {},
      complete: (res) => {},
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if(options != null){
      this.setData({
        index:options.index
      })
    }
  },

})
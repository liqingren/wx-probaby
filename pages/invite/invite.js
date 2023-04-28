// pages/invite/invite.js
const {postRequest} = require("../../utils/request")
const {getAge} = require("../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baby:{},//宝宝信息
    canvas:'',//画布

  },



  /**
   * 点击保存邀请二维码到本地相册
   */
  clickSaveLocal:function(){
    //把当前画布指定区域的内容导出生成指定大小的图片
    wx.canvasToTempFilePath({
        canvas:this.data.canvas,
        success:res =>{
          //将图片保存到本地相册（可能需要获取权限）
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success:function(res){
                wx.showToast({
                title: '保存成功',
                })
            },
            fail:function(err){
                console.log(err);
            }
        })
      }
    }, this)
  },


  /**
   * 点击生成图片分享给微信好友
   */
  handleShareCode:function(e){
    //把当前画布指定区域的内容导出生成指定大小的图片
    wx.canvasToTempFilePath({
      canvas:this.data.canvas,
      success:res =>{
        //打开分享图片弹窗，可以将图片发送给朋友、收藏或下载
        wx.showShareImageMenu({
          path: res.tempFilePath
        })
      }
    }, this)
    
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.showLoading()
    var baby = wx.getStorageSync('baby');
    this.setData({
      baby:baby
    })
    postRequest("/identity/invite",{
      baby:baby,
      path:'/pages/invited/invited',//跳转路径
    })
    .then((value) =>{
      const {code,data,msg} = value;
      if(code == 200){
        var QRcode = data.trim();//去空格
        this.createCanvas(QRcode);//绘制画布
      }else{
        wx.showToast({
          title: msg,
          icon:'error'
        })
      }
     
    })
  },


  /**
   * 绘制画布
   * @param {code}} code 
   */
  createCanvas(code){
    var that = this;
    wx.createSelectorQuery() 
    .select('#code-canvas') 
    .fields({ node: true, size: true })
    .exec( (res)=>{ 
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')  
        // Canvas 画布的实际绘制宽高
        const width = res[0].width
        const height = res[0].height

        // 初始化画布大小
        const dpr = wx.getWindowInfo().pixelRatio;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        // 当该像素是透明的，则设置成白色
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < imageData.data.length; i += 4) {
          if (imageData.data[i + 3] === 0) {
              imageData.data[i] = 255;
              imageData.data[i + 1] = 255;
              imageData.data[i + 2] = 255;
              imageData.data[i + 3] = 255;
          }
        }
        ctx.putImageData(imageData, 0, 0);

        //宝宝的头像
        var baby = wx.getStorageSync('baby');
        var babyAvatar = baby.babyPhoto;
        const image = canvas.createImage();//创建图片对象
        if(babyAvatar == null || babyAvatar == ''){ 
            babyAvatar = '/image/default.jpg';//默认头像
            image.src = babyAvatar;
        }else{
            //网络头像
            wx.getImageInfo({
                src: babyAvatar, 
                success(res) {
                    image.src = res.path;
                }
            })
        }

        var avatar_r = 30;//圆形头像半径
        var avatar_x = (width - avatar_r * 2)/2;//圆形头像x轴坐标
        var avatar_y = 10;//圆形头像y轴坐标

        image.onload = () =>{
          that.circleImage(ctx,image,avatar_x,avatar_y,avatar_r);
        }
        
        //设置字体信息
        ctx.textAlign = 'center';//设置水平居中，字体的x轴偏移量为画布的width/2
        ctx.font = '14px 等线';//设置字体大小

        //文本信息：昵称、年龄
        var nickname_y = avatar_y + avatar_r * 2 + 20;//昵称的y轴坐标
        ctx.fillText(baby.nickname,width/2,nickname_y);//绘制昵称文本
        if(baby.age == undefined || baby.age == null){
          baby.age = getAge(baby.babyBirth,new Date());
          wx.setStorageSync('baby', baby);
        }
        var age_y = nickname_y + 20;//年龄的y轴坐标
        ctx.fillText(baby.age,width/2,age_y);//绘制年龄文本

        //绘制扫描二维码
        const QRcode = canvas.createImage();
        var code_x = (width * 0.1)/2;//二维码x轴坐标
        var code_y = age_y + 10;//二维码y轴坐标；
        //base64码转成临时路径
        var save_path = wx.env.USER_DATA_PATH + "/" +new Date().getTime() + ".jpg";
        var fs = wx.getFileSystemManager();
        fs.writeFile({//写文件
          filePath:save_path,
          data:code,
          encoding:'base64',
           success:(res) =>{
            QRcode.src = save_path;
            QRcode.onload = async () =>{
              await ctx.drawImage(QRcode,code_x,code_y,width * 0.9,width * 0.9);//二维码图片的宽高为width* 0.9
            }
          }
        })
        

        //绘制备注文本信息
        var node_y = code_y + width * 0.9 + 20;//备注信息的y轴坐标
        var node = "让家人亲友扫描上面的二维码，关注宝宝";
        ctx.fillText(node,width/2,node_y);
        
        that.setData({
            canvas:canvas
        })
        wx.hideLoading()

       
      
    })
  },

  /**
   * 绘制圆形头像
   * @param {*} ctx canvas画布对象
   * @param {*} img 图片
   * @param {*} x x坐标
   * @param {*} y y坐标
   * @param {*} r 半径
   */
    circleImage(ctx,img,x,y,r){
      var d = r * 2;
      var cx = x + r;
      var cy = y + r;
      ctx.save();//保存上文
      ctx.beginPath();
      ctx.arc(cx,cy,r,0,2 * Math.PI);
      ctx.stroke();//绘制出圆形
      ctx.clip();
      ctx.drawImage(img,x,y,d,d);
      ctx.restore();//恢复上文
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
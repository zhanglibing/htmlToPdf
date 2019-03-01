function btnDownloadPageBypfd2(pdfContainer, titles){ //参数是'#pdf_container' 或 '.pdf_container',注意带前缀
        $("#"+pdfContainer).addClass('pdf'); //pdf的css在下一个代码中,作用是使得打印的内容能在pdf中完全显示
        var cntElem = document.getElementById(pdfContainer);
        var shareContent = cntElem; //需要截图的包裹的（原生的）DOM 对象
        var width = shareContent.offsetWidth; //获取dom 宽度
        var height = shareContent.offsetHeight; //获取dom 高度
        var canvas = document.createElement("canvas"); //创建一个canvas节点
        var scale = 2; //定义任意放大倍数 支持小数
        canvas.width = width * scale; //定义canvas 宽度 * 缩放，在此我是把canvas放大了2倍
        canvas.height = height * scale; //定义canvas高度 *缩放
        canvas.getContext("2d").scale(scale, scale); //获取context,设置scale 
        
        html2canvas(document.getElementById(pdfContainer), {
            allowTaint: true,
            taintTest: true,
            canvas: canvas,
            onrendered: function(canvas) {
         
            var context = canvas.getContext('2d');
            // 【重要】关闭抗锯齿
            context.mozImageSmoothingEnabled = false;
            context.webkitImageSmoothingEnabled = false;
            context.msImageSmoothingEnabled = false;
            context.imageSmoothingEnabled = false;
                 
              var imgData = canvas.toDataURL('image/jpeg',1.0);//转化成base64格式,可上网了解此格式
              var img = new Image();
              img.src = imgData;
              img.onload = function() { 
                img.width = img.width/2;   //因为在上面放大了2倍，生成image之后要/2
                img.height = img.height/2;
                img.style.transform="scale(0.5)";
                console.log("img.width"+img.width);
                console.log("this.width="+this.width);
                console.log("this.height="+this.height);
               /*if (this.width > this.height) {//此可以根据打印的大小进行自动调节
                var doc = new jsPDF('l', 'mm', [this.width * 0.255, this.height * 0.225]);
               } else {
                var doc = new jsPDF('p', 'mm', [this.width * 0.255, this.height * 0.225]);
               }
               doc.addImage(imgData, 'jpeg', 10, 0, this.width * 0.225, this.height * 0.225);
               doc.save('report_pdf_' + new Date().getTime() + '.pdf');*/
                
                /****分页******/
                 var pageHeight = 841.89;//一页高度
                 var leftHeight = height * 0.75;//未打印内容高度
                 var position = 0;//页面偏移
                 var imgWidth = width;
                 //var imgHeight = 841.89;
                 var imgHeight =   height;
                 console.log("imgWidth="+imgWidth);
                 console.log("imgHeight="+imgHeight);
                  var doc = new jsPDF('p', 'pt', 'a4');
                 if(pageHeight >= leftHeight){//不需要分页，页面高度>=未打印内容高度
                    console.log("不需要分页");
                     doc.addImage(imgData, 'jpeg', 35, 0, imgWidth*0.75, imgHeight*0.75);
                 }else{//需要分页
                    console.log("需要分页");
                    while(leftHeight>0){
                    console.log("position="+position);
                    console.log("leftHeight="+leftHeight);
                     doc.addImage(imgData, 'JPEG', 35, position, imgWidth*0.75, imgHeight*0.75);
                     leftHeight -= pageHeight; 
                     position -= 841.89; 
                     //避免添加空白页
                     if(leftHeight > 0){
                        console.log("添加空白页");
                        doc.addPage();
                     }
                    }
                 }
                   doc.save(''+titles+'.pdf');//保存为pdf文件
                
              }
             },
              background: "#fff", //一般把背景设置为白色，不然会出现图片外无内容的地方出现黑色，有时候还需要在CSS样式中设置div背景白色
            });
        $('#'+pdfContainer).removeClass('pdf');
    }

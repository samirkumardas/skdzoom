/* =========================================================

// SKD Zoom

// Date: 2013-02-14
// Author: Samir Kumar Das
// Mail: cse.samir@gmail.com
// Web: http://dandywebsolution.com/skdzoom

 *  $('#demo').skdzoom({lensRadius:10,circleOffset:2});
 *

// ========================================================= */
(function($){
    $.skdzoom = function(container,options){
        // settings
        var config = {
            'radius': 150,
			'circleOffset':2,
			'lensRadius':10,
			'lensZoom':true,
			'imageBorder':8,
			'imageBorderColor':'#000000',
			'imageBG':'#ffffff',
			'circleBorderColor':'#000000',
			'circleBG':'#ffffff',
			'loaderImgUrl': 'images/loader.gif',
            'fadeSpeed': 500
        };
		
        if ( options ){$.extend(config, options);}
        // variables
       
	    var element=$(container);
		var width=config.radius*2;
		var height=config.radius*2;
		var zoomImg=element.attr('rel');
		
		config.loadingDone=false;
		
        var template='<div class="zoom-pad"></div>'+
		             '<div class="skdzoom-wrapper">'+
		                '<div class="skdzoom-container">'+
		                     '<div class="skdzoom">'+
                                '<div class="loader"><img style="width:40px; height:40px;" src="'+config.loaderImgUrl+'" /></div>'+
							  '</div>'+	
						 '</div>'+	
                      '</div>'; 
		element.css({'position':'relative','display':'block','width':element.find('img').width()});	
		
		/*get some properties */
		element.w = element.width();
		element.h = element.height();
		element.ow = element.outerWidth();
		element.oh = element.outerHeight();
		element.pos = element.offset();
		element.pos.l = element.offset().left;
		element.pos.t = element.offset().top;
		element.pos.r = element.w + element.pos.l;
		element.pos.b = element.h + element.pos.t;
		element.mousepos = {};
		element.scale = {};
		
		
		element.hover(function(e)
					{
						/*fix height 0 bug*/ 
					   if(element.h==0){
						 element.h =element.height();
					   }
					   $('div.zoom-pad',element).remove();
					   $('div.skdzoom-wrapper',element).remove();	
					   element.append(template);
					   
					   $('div.zoom-pad',element).css({'top':0,'left':0,'position':'absolute','display':'none','width':(config.lensRadius*2),'height':(config.lensRadius*2),'border-radius':'50%','border':'1px solid #ffffff','background':'none repeat scroll 0 0 #555555','opacity':0.5});
					   
					   $('div.skdzoom-wrapper',element).css({'bottom':element.h,'left':(config.radius*config.circleOffset),'position':'absolute','display':'none'});
					   $('div.skdzoom-wrapper .skdzoom-container',element).css({'position':'relative'});
					   
					   if(config.imageBG=='random'){
						  var imageBG=$.skdzoom.randomColor(); 
					   }
					   else
					   {
						  var imageBG=config.imageBG;    
					   }
					   
					   if(config.imageBorderColor=='random'){
						  var imageBorderColor=$.skdzoom.randomColor(); 
					   }
					   else
					   {
						  var imageBorderColor=config.imageBorderColor;    
					   }
					   
					   
					   $('div.skdzoom-wrapper .skdzoom-container .skdzoom',element).css({'height':height,'width':width,'position':'relative','background':'none repeat scroll 0 0 '+imageBG,'z-index':100,'border':config.imageBorder+'px solid '+imageBorderColor,'border-radius':'50%','overflow':'hidden'});
					  
					   var loaderWidth=$('div.skdzoom-wrapper .skdzoom-container .skdzoom .loader img',element).width();
					   var loaderHeight=$('div.skdzoom-wrapper .skdzoom-container .skdzoom .loader img',element).height();
					   $('div.skdzoom-wrapper .skdzoom-container .skdzoom .loader',element).width(loaderWidth);
					   $('div.skdzoom-wrapper .skdzoom-container .skdzoom .loader',element).height(loaderHeight);
					   $('div.skdzoom-wrapper .skdzoom-container .skdzoom .loader',element).css('background','none repeat scroll 0 0'+imageBG);
					   
					  
					   $('div.skdzoom-wrapper .skdzoom-container .skdzoom .loader',element).css({'left':(config.radius-loaderWidth/2),'top':(config.radius-loaderHeight/2),'position':'absolute','display':'block'});
					   $('div.skdzoom-wrapper',element).fadeIn(config.fadeSpeed,function() {
					      $(this).css('display','block'); 
						  $("<img />").bind("load", function() {
							  $('div.skdzoom-wrapper .skdzoom-container .skdzoom .loader',element).css('display','none');
							  $('div.skdzoom-wrapper .skdzoom-container .skdzoom',element).append($(this));
							   
							    config.loadingDone=true;
								
							   /*Set scale for showing larger image while lens moving*/
							   element.scale.x = ($(this).width() / element.w);
                               element.scale.y = ($(this).height() / element.h);
							   
							   
							   
							   /*Initializ lens*/
							   if(config.lensZoom){
								   $(this).css({'position':'absolute'});
								   $('div.zoom-pad',element).css('display','block');
								   element.css('cursor','none');
								   element.trigger('mousemove');
							   }
							   else
							   {
								 $(this).css({'height':height,'width':width});   
							   }
							   
						  }).addClass('big-image').attr('src',zoomImg);
					   });
					   $.skdzoom.circle(element,config);
				    },
				  function()
				  {
					  $('div.zoom-pad',element).remove();
					  $('div.skdzoom-wrapper',element).fadeOut(config.fadeSpeed,function() {
						  $(this).remove();
					  }); 
					  
					  element.css('cursor','default');
				  }
		  );
		
		if(config.lensZoom){
			
			element.mousemove(function(e){
					 if(typeof e.pageX !="undefined"){				   
						 element.mousepos.x = e.pageX;
						 element.mousepos.y = e.pageY;
					 }
					 $.skdzoom.moveLens(element,config);
					 return false;					   
			});
		}
		
    };
	
  
  $.skdzoom.moveLens=function(element,config){
	  
	 if(config.loadingDone==true){ 
		 var left=element.mousepos.x - element.pos.l - config.lensRadius;
		 var top=element.mousepos.y - element.pos.t - config.lensRadius;
		 
		 /*check boundary*/
		 if((element.mousepos.x-config.lensRadius)<element.pos.l) left=0;
		 if((element.mousepos.x+config.lensRadius)>element.pos.r) left=element.w-(config.lensRadius*2)-1;
		 if((element.mousepos.y-config.lensRadius)<element.pos.t) top=0;
		 if((element.mousepos.y+config.lensRadius)>element.pos.b) top=element.h-(config.lensRadius*2)-1;
		
		
		 $('div.zoom-pad',element).css({'left':left,'top':top});
		 
		 $.skdzoom.setLargeImg(element,config);
	 }
  };
  
  
  $.skdzoom.setLargeImg=function(element,config){
	  
	 var left=element.mousepos.x - element.pos.l - config.lensRadius;
	 var top=element.mousepos.y - element.pos.t - config.lensRadius;
	 
	 var lensPos=$('div.zoom-pad',element).position();
	 //console.log('left='+lensPos.left+' and top='+lensPos.top);
	 var left = -element.scale.x * (lensPos.left+1);
     var top = -element.scale.y * (lensPos.top+1);
	 
	 

	 $('div.skdzoom-wrapper .skdzoom-container .skdzoom img.big-image',element).css({'left':left,'top':top});
  };

  $.skdzoom.circle=function(element,config){
	  
	    $('div.skdzoom-wrapper .skdzoom-container',element).append('<div class="path-wrapper"></div>');
		var pathHeight=(config.radius*2)+element.h+(config.imageBorder*2);
		var pathWidth=(config.radius*config.circleOffset)-element.w;
		var pathLeft=(-1)*((config.radius*config.circleOffset)-element.w);
		var pathBottom=(-1)*element.h;
		
		var curveEnd=$('div.skdzoom-wrapper .skdzoom-container',element).height()/2;
		
	
		/*consider extra path for border radius*/
		pathWidth+=((config.radius*2*config.imageBorder)/100)*2;
		
		
		$('div.skdzoom-wrapper .skdzoom-container .path-wrapper',element).css({'position':'absolute','display':'block','height':pathHeight,'width':pathWidth,'bottom':pathBottom,'left':pathLeft});
		
		$('div.skdzoom-wrapper .skdzoom-container .path-wrapper',element).html('<div class="path-container"></div>');
		$('div.skdzoom-wrapper .skdzoom-container .path-wrapper .path-container',element).css({'position':'relative','display':'block','height':pathHeight,'width':pathWidth})
		
		var radius=5;
		var x=0;
		var y=(pathHeight-element.h/2);
		var cicleDistance=1;
		var radiusIncrement=1;
		
		var curveA=25/pathWidth;
		if(pathWidth<=100)curveA=.5;
		
		
		
		var numberOfCicles=$.skdzoom.calCircleNumber(pathWidth,radius,cicleDistance,radiusIncrement);
		numberOfCicles=Math.round(numberOfCicles);
		
		for(i=1;i<=numberOfCicles;i++){
		
		   if(config.circleBG=='random'){
			  var circleBG=$.skdzoom.randomColor(); 
		   }
		   else
		   {
			  var circleBG=config.circleBG;    
		   }
		   
		   if(config.circleBorderColor=='random'){
			  var circleBorderColor=$.skdzoom.randomColor(); 
		   }
		   else
		   {
			  var circleBorderColor=config.circleBorderColor;    
		   }
		   
		   var circleCss={'position':'absolute','display':'block','border-radius':'50%','border':'1px solid '+circleBorderColor,'background-color':circleBG,'width':(radius*2),'height':(radius*2),'left':x,'top':y};
	  	   $('<div class="cicle"></div>').css(circleCss).appendTo($('div.skdzoom-wrapper .skdzoom-container .path-wrapper .path-container',element));          
		   radius+=radiusIncrement;  //Increment radius for next cicle
		   x+=(radius*2)+cicleDistance;
		   y-=((curveA*i*i)+i);
		   //console.log('x='+x+' and y='+y);
		  
		}
  };
  
 $.skdzoom.calCircleNumber=function(pathWidth,radius,cicleDistance,radiusIncrement){
	
	var a1=radius*2;
	var d=cicleDistance+(2*radiusIncrement);
	var calWidth=0;
	var n=0;
	while(calWidth<pathWidth){
	  n++;	
	  calWidth=(n/2)*(a1+(n-1)*d);
	  //console.log('For n='+n+' w='+calWidth);
   }
   return n;
 }
 
$.skdzoom.randomColor=function() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
 }

 $.fn.skdzoom = function(options){
        return this.each(function(){
            (new $.skdzoom(this,options));
        });
    };
	
})(jQuery);
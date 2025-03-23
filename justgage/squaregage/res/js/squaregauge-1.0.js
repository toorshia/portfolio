SquareGauge = function(config) { 

  if (!config.id) {alert("Missing id parameter for gauge!"); return false;} 
  if (!document.getElementById(config.id)) {alert("DOM node with id: \""+config.id+"\" not found!"); return false;} 

  var obj = this; 
  var combined = (config.combined === true) ? true : false;
  var width = (config.width != null) ? config.width : 100;
  var height = (config.height != null) ? config.height : 100;

  // ==========================================================================================================================
  // SETUP PARAMETERS
  // ==========================================================================================================================

  // id : string
  // combined : boolean - true for combined gauge 
  // width : int - widget width
  // height : int - widget height
  // color : string/array - defines bar color(s)
  // gauge : object - defines bar options 
  // label : array/object - defines label options for combined gauge
  // title : string/object - defines title options
  // icon : string/object - defines icon options
  // score : int/array/object - defines score options
  // animation: object


  obj.config = 
  {
    id : config.id,

    color : (config.color) ? config.color : (combined === true) ? ["#ee2325", "#fec20f", "#40b977", "#008d80", "#0090d6"] : "#000000", 

    gauge : (config.gauge) ? {
      end : (config.gauge.end != null) ? config.gauge.end : ( (combined === true) ? (width / 3.75) : (width / 6.25) ),
      gap : (config.gauge.gap != null) ? config.gauge.gap : (width / 18.75),
      stroke : (config.gauge.bar != null) ? config.gauge.bar : (width / 18.75),
      zero : (config.gauge.zero != null) ? config.gauge.zero : (width / 75)
    } : { // defaults
      end : (combined === true) ? (width / 3.75) : (width / 6.25),
      gap : (width / 18.75),
      stroke : (width / 18.75),
      zero : (width / 75)
    },
    
    title : (config.title) ? {
      text : (config.title.text) ? config.title.text : config.title,
      xpos : (config.title.xpos != null) ? config.title.xpos : ( (combined === true) ? (width / 2) : (width / 4.6875) ),
      ypos : (config.title.ypos != null) ? config.title.ypos : ( (combined === true) ? (width / 2.586) : (width / 3.659) ), 
      font : (config.title.font) ? {
        family : (config.title.font.family) ? config.title.font.family : ( (config.fontFamily) ? config.fontFamily : "'Arial'" ),
        size : (config.title.font.size != null) ? config.title.font.size : ( (combined === true) ? (width / 37.5) : (width / 14.5) ),
        weight : (config.title.font.weight) ? config.title.font.weight : "normal",
        color : (config.title.font.color) ? config.title.font.color : ( (config.color) ? config.color : "#000000" ),
        align : (config.title.font.align) ? config.title.font.align : ( (combined === true) ? "middle" : "start" ) 
      } : { // defaults
        family : (config.fontFamily) ? config.fontFamily : "'Arial'",
        size : (combined === true) ? (width / 37.5) : (width / 14.5),
        weight : "normal",
        color : (config.color) ? config.color : "#000000",
        align : (combined === true) ? "middle" : "start"
      }
    } : null,

    icon : (config.icon) ? {
      src : (config.icon.src) ? config.icon.src : config.icon,
      xpos : (config.icon.xpos != null) ? config.icon.xpos : (width / 1.43),
      ypos : (config.icon.ypos != null) ? config.icon.ypos : (width / 5.172), 
      width : (config.icon.width != null) ? config.icon.width : (width / 10),
      height : (config.icon.height != null) ? config.icon.height : (width / 10)
    } : null,
    
    score : {
      text : (config.score.text != null) ? config.score.text : ( (config.score != null) ? config.score : "" ),
      xpos : (config.score.xpos != null) ? config.score.xpos : (width / 2.054),
      ypos : (config.score.ypos != null) ? config.score.ypos : (width / 2), 
      font : (config.score.font) ? {
        family : (config.score.font.family) ? config.score.font.family : ( (config.fontFamily) ? config.fontFamily : "'Arial'" ),
        size : (config.score.font.size) ? config.score.font.size : ( (combined === true) ? (width / 5) : (width / 2.5) ),
        weight : (config.score.font.weight) ? config.score.font.weight : "normal",
        color : (config.score.font.color) ? config.score.font.color : ((combined === true) ? "#000000" : ( (config.color) ? config.color : "#000000" ))
      } : { // defaults
        family : (config.fontFamily) ? config.fontFamily : "'Arial'",
        size : ( (combined === true) ? (width / 5) : (width / 2.5) ),
        weight : "normal",
        color : ((combined === true) ? "#000000" : ( (config.color) ? config.color : "#000000" ))
      }
    },
    
    animation : (config.animation) ? {
      loadTime : (config.animation.loadTime != null) ? config.animation.loadTime : 700,
      loadType : (config.animation.loadType) ? config.animation.loadType : ">",
      refreshTime : (config.animation.refreshTime != null) ? config.animation.refreshTime : 700,
      refreshType : (config.animation.refreshType) ? config.animation.refreshType : ">",
      alwaysReload : (config.animation.alwaysReload === true) ? true : false
    } : { // defaults
      loadTime : 700,
      loadType : ">",
      refreshTime : 700,
      refreshType : ">",
      alwaysReload : (config.alwaysReload === true) ? true : false
    }

  };

  // helper params
  obj.params = {
    gWidth : width,
    gHeight : height,
    gStroke : obj.config.gauge.stroke,
    gEndPos : obj.config.gauge.end,
    gGap : obj.config.gauge.gap,
    gZeroStart : obj.config.gauge.end + obj.config.gauge.gap,
    gZeroWidth : obj.config.gauge.zero,
    gStartPos : obj.config.gauge.end + obj.config.gauge.gap + obj.config.gauge.zero
  };
  
  obj.config["label"] = (combined === true) ? {
    text : (config.label.text) ? config.label.text : config.label,
    xpos : (config.label.xpos != null) ? config.label.xpos : (obj.params.gStartPos + 2),
    font : (config.label.font) ? {
      family : (config.label.font.family) ? config.label.font.family : ( (config.fontFamily) ? config.fontFamily : "'Arial'" ),
      size : (config.label.font.size != null) ? config.label.font.size : (obj.params.gStroke / 2),
      weight : (config.label.font.weight) ? config.label.font.weight : "normal"
    } : { // defaults
      family : (config.fontFamily) ? config.fontFamily : "'Arial'",
      size : (obj.params.gStroke / 2), 
      weight : "normal"
    }
  } : null;
  
  // ==========================================================================================================================
  // SETUP CANVAS AND GAUGE FUNCTION 
  // ==========================================================================================================================

  // canvas  
  if(!ie || ie === 9) {
    obj.canvas = Raphael(obj.config.id, "100%", "100%");  
  } else if(ie < 9) {
    obj.canvas = Raphael(obj.config.id, obj.params.gWidth, obj.params.gHeight); 
  } 
  obj.canvas.setViewBox(0, 0, obj.params.gWidth, obj.params.gHeight, true);  

  // pki - custom attribute for generating gauge paths
  obj.canvas.customAttributes.pki = function (value, depth) {

    var level = value * (2 * obj.params.gWidth + 2 * obj.params.gHeight - 4 * obj.params.gStroke - 8 * obj.params.gStroke * (depth - 1) - obj.params.gGap - obj.params.gZeroWidth) / 100;
    var path = "M" + obj.params.gStartPos + "," + (obj.params.gStroke * ((depth - 1) + 1/2));

    var firstDiff = obj.params.gWidth - obj.params.gStroke - (depth - 1) * obj.params.gStroke * 2 - obj.params.gStartPos + obj.params.gStroke / 2;
    var vDiff = obj.params.gHeight - obj.params.gStroke - (depth - 1) * obj.params.gStroke * 2;
    var hDiff = obj.params.gWidth - obj.params.gStroke - (depth - 1) * obj.params.gStroke * 2;
    
    var firstSegment = (obj.params.gWidth - obj.params.gStartPos) - (obj.params.gStroke) * (depth - 1);
    var secondSegment = firstSegment + vDiff;
    var thirdSegment =  secondSegment + hDiff;
    var fourthSegment = thirdSegment + vDiff;

    if (level <= firstSegment) { // 1st segment
      path += "l" + level + "," + "0";
    } else {
      path += "l" + (firstSegment - obj.params.gStroke / 2) + "," + "0";
      if (level <= secondSegment){ // 2nd segment
        path += "l" + "0" + "," + (level - firstSegment + obj.params.gStroke / 2);
      } else {
        path += "l" + "0" + "," + (vDiff);
        if(level <= thirdSegment) { // 3rd segment
          path += "l" + (-level + secondSegment - obj.params.gStroke / 2) + "," + "0";
        } else {
          path += "l" + (-hDiff) + "," + "0";
          if(level <= fourthSegment) { // 4th segment
            path += "l" + "0" + "," + (-level + thirdSegment - obj.params.gStroke / 2);
          } else { // 5th segment
            path += "l" + "0" + "," + (-vDiff);
            path += "l" + (level - fourthSegment + obj.params.gStroke / 2) + "," + "0";
          }
        }
      }
    } 

    level, firstDiff, vDiff, hDiff, firstSegment, secondSegment, thirdSegment, fourthSegment = null;
    return { path: path };

  }; 
  
  // ==========================================================================================================================
  // BUILD GAUGE 
  // ==========================================================================================================================

  obj.txtLabelUnder = [];
  obj.txtLabelOver = [];
  obj.zero = [];
  obj.level = [];

  if(combined === true) { // COMBINED 

    // TBD

  } else { // SINGLE
    
    // zero
    obj.zero = obj.canvas.path("M"+ obj.params.gZeroStart +","+ (obj.params.gStroke / 2) +" L"+ obj.params.gStartPos +","+ (obj.params.gStroke / 2)).attr({
      "stroke-width" : obj.config.gauge.stroke,
      "stroke" : obj.config.color,
      "fill" : "none"
    });
    obj.zero.id = obj.config.id+"-zero";
    
    // single level 
    obj.level = obj.canvas.path().attr({
      "stroke-width" : obj.config.gauge.stroke,
      "stroke" : obj.config.color,
      "fill" : "none", 
      "stroke-linejoin" : "miter",
      "stroke-miterlimit" : obj.config.gauge.stroke,
      pki : [0, 1]
    });
    obj.level.id = obj.config.id+"-level";
    
    // single icon
    if(obj.config.icon != null) {
      obj.imgIcon = obj.canvas.image(obj.config.icon.src, obj.config.icon.xpos, obj.config.icon.ypos, obj.config.icon.width, obj.config.icon.height);
    }

  }

  // title
  if(obj.config.title != null) {
    obj.txtTitle = obj.canvas.text(obj.config.title.xpos, obj.config.title.ypos, obj.config.title.text);
    obj.txtTitle.attr({
      "font-family" : obj.config.title.font.family,
      "font-size" : obj.config.title.font.size,
      "font-weight" : obj.config.title.font.weight,
      "fill" : obj.config.title.font.color,
      "text-anchor" : obj.config.title.font.align
    });
    obj.txtTitle.id = obj.config.id+"-txttitle";
  }

  // score
  obj.txtScore = obj.canvas.text(obj.config.score.xpos, obj.config.score.ypos, "0");
  obj.txtScore.attr({
    "font-family" : obj.config.score.font.family,
    "font-size" : obj.config.score.font.size,
    "font-weight" : obj.config.score.font.weight,
    "fill" : obj.config.score.font.color       
  });
  obj.txtScore.id = obj.config.id+"-txtscore";

  // ==========================================================================================================================
  // ANIMATE GAUGE 
  // ==========================================================================================================================
  var txtScore = obj.txtScore;
  var level = (combined === true) ? obj.overall : obj.level;

  function onAnimate() {
    var currentValue = level.attr("pki");
    txtScore.attr("text", Math.floor(currentValue[0]));
  }

  txtScore, level, currentValue = null;

  if(combined === true) { // COMBINED 

    // TBD
    
  } else { // SINGLE 

    obj.level.animate({pki: [obj.config.score.text, 1]}, obj.config.animation.loadTime, obj.config.animation.loadType);

  }

  //event fired on each animation frame
  eve.on("raphael.anim.frame.*", onAnimate);

};

// ==========================================================================================================================
// fn : REFRESH GAUGE 
// ==========================================================================================================================
SquareGauge.prototype.refresh = function(val) {
  var obj = this;
  
  if(val instanceof Array) { // COMBINED 

    // TBD

  } else { // SINGLE 
    
    if(obj.config.animation.alwaysReload === true) {
      obj.level.animate({pki: [0, 1]}, 0, obj.config.animation.refreshType, function() {
        obj.level.animate({pki: [val, 1]}, obj.config.animation.refreshTime, obj.config.animation.refreshType);
      });
    } else {
      obj.level.animate({pki: [val, 1]}, obj.config.animation.refreshTime, obj.config.animation.refreshType);
    }  

  }

  obj.config.score.text = val;

};  

/**  Get IE version  */
var ie = (function(){
  var undef,
  v = 3,
  div = document.createElement('div'),
  all = div.getElementsByTagName('i');

  while (
    div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
    all[0]
  );
  div, all = null;  
  return (v > 4) ? v : undef;
}()); 
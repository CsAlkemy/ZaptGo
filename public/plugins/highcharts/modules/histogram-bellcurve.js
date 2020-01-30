/*
  Highcharts JS v7.1.2 (2019-06-03)

 (c) 2010-2019 Highsoft AS
 Author: Sebastian Domas

 License: www.highcharts.com/license
*/
(function(a){"object"===typeof module&&module.exports?(a["default"]=a,module.exports=a):"function"===typeof define&&define.amd?define("highcharts/modules/histogram-bellcurve",["highcharts"],function(c){a(c);a.Highcharts=c;return a}):a("undefined"!==typeof Highcharts?Highcharts:void 0)})(function(a){function c(b,a,g,m){b.hasOwnProperty(a)||(b[a]=m.apply(null,g))}a=a?a._modules:{};c(a,"mixins/derived-series.js",[a["parts/Globals.js"]],function(b){var a=b.Series,g=b.addEvent;return{hasDerivedData:!0,
init:function(){a.prototype.init.apply(this,arguments);this.initialised=!1;this.baseSeries=null;this.eventRemovers=[];this.addEvents()},setDerivedData:b.noop,setBaseSeries:function(){var a=this.chart,h=this.options.baseSeries;this.baseSeries=b.defined(h)&&(a.series[h]||a.get(h))||null},addEvents:function(){var a=this,b;b=g(this.chart,"afterLinkSeries",function(){a.setBaseSeries();a.baseSeries&&!a.initialised&&(a.setDerivedData(),a.addBaseSeriesEvents(),a.initialised=!0)});this.eventRemovers.push(b)},
addBaseSeriesEvents:function(){var a=this,b,e;b=g(a.baseSeries,"updatedData",function(){a.setDerivedData()});e=g(a.baseSeries,"destroy",function(){a.baseSeries=null;a.initialised=!1});a.eventRemovers.push(b,e)},destroy:function(){this.eventRemovers.forEach(function(a){a()});a.prototype.destroy.apply(this,arguments)}}});c(a,"modules/histogram.src.js",[a["parts/Globals.js"],a["mixins/derived-series.js"]],function(a,c){function b(a){return function(f){for(var b=1;a[b]<=f;)b++;return a[--b]}}var m=a.objectEach,
h=a.seriesType,e=a.correctFloat,n=a.isNumber,p=a.arrayMax,r=a.arrayMin;a=a.merge;var d={"square-root":function(a){return Math.ceil(Math.sqrt(a.options.data.length))},sturges:function(a){return Math.ceil(Math.log(a.options.data.length)*Math.LOG2E)},rice:function(a){return Math.ceil(2*Math.pow(a.options.data.length,1/3))}};h("histogram","column",{binsNumber:"square-root",binWidth:void 0,pointPadding:0,groupPadding:0,grouping:!1,pointPlacement:"between",tooltip:{headerFormat:"",pointFormat:'\x3cspan style\x3d"font-size: 10px"\x3e{point.x} - {point.x2}\x3c/span\x3e\x3cbr/\x3e\x3cspan style\x3d"color:{point.color}"\x3e\u25cf\x3c/span\x3e {series.name} \x3cb\x3e{point.y}\x3c/b\x3e\x3cbr/\x3e'}},
a(c,{setDerivedData:function(){var a=this.derivedData(this.baseSeries.yData,this.binsNumber(),this.options.binWidth);this.setData(a,!1)},derivedData:function(a,k,d){var f=p(a),l=e(r(a)),c=[],g={},h=[],q;d=this.binWidth=this.options.pointRange=e(n(d)?d||1:(f-l)/k);for(k=l;k<f&&(this.userOptions.binWidth||e(f-k)>=d||0>=e(l+c.length*d-k));k=e(k+d))c.push(k),g[k]=0;0!==g[l]&&(c.push(e(l)),g[e(l)]=0);q=b(c.map(function(a){return parseFloat(a)}));a.forEach(function(a){a=e(q(a));g[a]++});m(g,function(a,
b){h.push({x:Number(b),y:a,x2:e(Number(b)+d)})});h.sort(function(a,b){return a.x-b.x});return h},binsNumber:function(){var a=this.options.binsNumber,b=d[a]||"function"===typeof a&&a;return Math.ceil(b&&b(this.baseSeries)||(n(a)?a:d["square-root"](this.baseSeries)))}}))});c(a,"modules/bellcurve.src.js",[a["parts/Globals.js"],a["mixins/derived-series.js"]],function(a,c){function b(a){var b=a.length;a=a.reduce(function(a,b){return a+b},0);return 0<b&&a/b}function m(a,d){var f=a.length;d=p(d)?d:b(a);
a=a.reduce(function(a,b){b-=d;return a+b*b},0);return 1<f&&Math.sqrt(a/(f-1))}function h(a,b,f){a-=b;return Math.exp(-(a*a)/(2*f*f))/(f*Math.sqrt(2*Math.PI))}var e=a.seriesType,n=a.correctFloat,p=a.isNumber;a=a.merge;e("bellcurve","areaspline",{intervals:3,pointsInInterval:3,marker:{enabled:!1}},a(c,{setMean:function(){this.mean=n(b(this.baseSeries.yData))},setStandardDeviation:function(){this.standardDeviation=n(m(this.baseSeries.yData,this.mean))},setDerivedData:function(){1<this.baseSeries.yData.length&&
(this.setMean(),this.setStandardDeviation(),this.setData(this.derivedData(this.mean,this.standardDeviation),!1))},derivedData:function(a,b){var f=this.options.intervals,c=this.options.pointsInInterval,d=a-f*b,f=f*c*2+1,c=b/c,e=[],g;for(g=0;g<f;g++)e.push([d,h(d,a,b)]),d+=c;return e}}))});c(a,"masters/modules/histogram-bellcurve.src.js",[],function(){})});
//# sourceMappingURL=histogram-bellcurve.js.map

import { TIMES_NEW_ROMAN_BASE64 } from "./Fonts/TimesNewRomanBase64";

const PRINT_WIDTH = 576;
const FONT_BASE = 28;

export function buildHtml2(params, W) {
  const F = Math.round(FONT_BASE * (W / PRINT_WIDTH));
  const p = JSON.stringify(params).replace(/<\//g, "<\\/");

  // Column widths: label auto, weight fixed, amount fixed
  const WC = Math.round(F * 4.2); // WEIGHT col width
  const AC = Math.round(F * 4.8); // AMOUNT col width

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<style>
@font-face {
  font-family:'TNR';
  src:url(data:font/truetype;base64,${TIMES_NEW_ROMAN_BASE64}) format('truetype');
  font-weight:400; font-style:normal;
}
@font-face {
  font-family:'TNR';
  src:url(data:font/truetype;base64,${TIMES_NEW_ROMAN_BASE64}) format('truetype');
  font-weight:700; font-style:normal;
}
*{margin:0;padding:0;box-sizing:border-box;}
body{
  width:${W}px;background:#fff;
  font-family:'TNR',serif;font-size:${F}px;color:#000;
  -webkit-print-color-adjust:exact;-webkit-text-stroke:0.5px #000;
}
#receipt{width:${W}px;padding:6px 12px 12px 12px;background:#fff;}
.sep{border:none;border-top:1px solid #000;margin:${Math.round(F*0.2)}px 0;}
.header-sep{border-top-width:2px;}
.sep-dash{border:none;border-top:1px dashed #000;margin:${Math.round(F*0.2)}px 0;}
.slip-heading{
  text-align:center;
  font-weight:900;
  font-size:${Math.round(F*1.1)}px;
  padding:${Math.round(F*0.8)}px 0;
  -webkit-text-stroke:0.8px #000;
}
.hdr-row{display:flex;justify-content:space-between;padding:${Math.round(F*0.1)}px 0;font-weight:700;-webkit-text-stroke:0.8px #000;}
.hdr-row > div > div + div{margin-top:${Math.round(F*0.12)}px;}
.customer-details{
  padding:${Math.round(F*0.15)}px 0;
  font-weight:700;
  line-height:1.35;
  -webkit-text-stroke:0.6px #000;
}
.customer-line{display:flex;align-items:flex-end;gap:${Math.round(F*0.25)}px;min-height:${Math.round(F*1.35)}px;}
.customer-input-line{flex:1;border-bottom:2px solid #000;min-height:${Math.round(F*0.9)}px;}

/* 3-col row: label | weight-col | amount-col */
.row3{
  display:flex;align-items:baseline;
  padding:${Math.round(F*0.08)}px 0;
}
.row3 .lbl{flex:1;font-weight:700;}
.row3 .pcs{
  width:${Math.round(F*2.2)}px;text-align:right;font-weight:700;
}
.row3 .wt{
  width:${WC}px;text-align:right;font-weight:700;
}
.row3 .amt{
  width:${AC}px;text-align:right;font-weight:700;
}
.row3 .wt-ul{
  width:${WC}px;text-align:right;font-weight:700;
  border-bottom:1px solid #000;
}
.row3 .amt-ul{
  width:${AC}px;text-align:right;font-weight:700;
  border-bottom:1px solid #000;
}

/* column header row */
.col-hdr{
  display:flex;font-weight:900;
  font-size:${Math.round(F*0.95)}px;
  padding:${Math.round(F*0.15)}px 0;
  -webkit-text-stroke:0.8px #000;
}
.col-hdr .lbl{flex:1;}
.col-hdr .pcs{width:${Math.round(F*2.2)}px;text-align:right;}
.col-hdr .wt{width:${WC}px;text-align:right;}
.col-hdr .amt{width:${AC}px;text-align:right;}

.item-name{
  font-weight:900;font-size:${Math.round(F*1.0)}px;
  padding:${Math.round(F*0.25)}px 0 ${Math.round(F*0.1)}px 0;
  -webkit-text-stroke:0.8px #000;
}
.subtotal-row{
  display:flex;font-weight:900;
  padding:${Math.round(F*0.1)}px 0;
  -webkit-text-stroke:0.8px #000;
}
.subtotal-row .lbl{flex:1;}
.subtotal-row .amt{width:${AC}px;text-align:right;}

.grand-row{
  display:flex;font-weight:900;
  font-size:${Math.round(F*1.05)}px;
  padding:${Math.round(F*0.2)}px 0;
  -webkit-text-stroke:0.8px #000;
}
.grand-row .lbl{flex:1;}
.grand-row .pcs{width:${Math.round(F*2.2)}px;text-align:right;}
.grand-row .wt{width:${WC}px;text-align:right;}
.grand-row .amt{width:${AC}px;text-align:right;}

.big-estno{text-align:center;font-weight:700;font-size:${Math.round(F*1.8)}px;padding:${Math.round(F*0.2)}px 0;}
.emp-line{text-align:center;font-weight:700;font-size:${Math.round(F*0.95)}px;padding:${Math.round(F*0.8)}px 0 ${Math.round(F*0.2)}px 0;}
</style>
</head>
<body>
<div id="receipt">
  <div class="customer-details">
    <div class="customer-line"><span>Name :</span><span class="customer-input-line"></span></div>
    <div class="customer-line"><span>Mobile :</span><span class="customer-input-line"></span></div>
    <div class="customer-line"><span>Aadhaar No :</span><span class="customer-input-line"></span></div>
  </div>
  <div class="slip-heading">ESTIMATION SLIP</div>
  <div class="hdr-row">
    <div>
      <div id="date-line"></div>
      <div id="time-line"></div>
    </div>
    <div style="text-align:right">
      <div id="gold-line"></div>
      <div id="silver-line"></div>
    </div>
  </div>
  <hr class="sep header-sep">
  <div class="col-hdr">
    <span class="lbl"></span>
    <span class="pcs">PCS</span>
    <span class="wt">WEIGHT</span>
    <span class="amt">AMOUNT</span>
  </div>
  <hr class="sep header-sep">
  <div id="items-body"></div>
  <hr class="sep" id="sales-total-separator">
  <div class="grand-row" id="grand-row"></div>
  <hr class="sep header-sep" id="after-sales-total-separator">
  <div id="purchase-section"></div>
  <div id="emp-line" class="emp-line"></div>
  <div id="estno-big" class="big-estno"></div>
</div>

<script>
(function(){
try{
var P=${p};
function fmt(n){return Number(n||0).toFixed(0);}
function fmtWt(n){return Number(n||0).toFixed(3);}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

document.getElementById('gold-line').textContent='Gold  : '+fmt(P.goldRate)+'/Gm';
document.getElementById('date-line').textContent='Date  : '+(P.billDate||'');
document.getElementById('time-line').textContent='Time  : '+(P.billTime||'');
document.getElementById('silver-line').textContent='Silver: '+fmt(P.silverRate)+'/Gm';

var t=P.totals||{};
var items=P.items||[];
var purchItems = P.purchaseItems || [];
var isPurchaseOnly = items.length === 0 && purchItems.length > 0;
var html='';

items.forEach(function(item,idx){
  var itemName=(item.itemname||'').toUpperCase();
  var stoneTotal=(item.stones||[]).reduce(function(s,st){return s+(st.stnamt||0);},0);
  var displayAmt=((item.displayAmount!=null?item.displayAmount:item.amount)||0)-stoneTotal;
  var mcAmt=item.mcharge||0;
  var totalWt=(item.grswt||0)+(item.wastage||0);
  // amount before MC = displayAmt - mcAmt (gold value only)
  var goldAmt=displayAmt-mcAmt;
  // pre-GST base = goldAmt + MC
  var preGst=goldAmt+mcAmt; // same as displayAmt
  var gstAmt=Math.round(preGst*0.03);
  var subTotal=preGst+gstAmt;

  html+='<div class="item-name">'+(idx+1)+' '+esc(itemName)+'&nbsp;&nbsp;'+esc(item.itemid)+'-'+esc(item.tagno)+'</div>';

  // Weight row: label | weight-col=grswt | amt-col=empty
  if((item.wastage||0)>0){
    // Both weight and wastage present — show both + underlined total
    html+='<div class="row3"><span class="lbl">Weight</span><span class="wt">'+fmtWt(item.grswt)+'</span><span class="amt"></span></div>';
    html+='<div class="row3"><span class="lbl">Wastage</span><span class="wt" style="border-bottom:1px solid #000;">'+fmtWt(item.wastage)+'</span><span class="amt"></span></div>';
    html+='<div class="row3"><span class="lbl"></span><span class="wt">'+fmtWt(totalWt)+'</span><span class="amt">'+fmt(goldAmt)+'</span></div>';
  } else {
    // No wastage — show only weight with underline directly
    html+='<div class="row3"><span class="lbl">Weight</span><span class="wt-ul">'+fmtWt(item.grswt)+'</span><span class="amt-ul">'+fmt(goldAmt)+'</span></div>';
  }

  // MC row: label=MC | wt=empty | amt=mcAmt
  if(mcAmt>0){
    html+='<div class="row3"><span class="lbl">MC</span><span class="wt"></span><span class="amt" style="border-bottom:1px solid #000;">'+fmt(mcAmt)+'</span></div>';
  }

  // Pre-GST subtotal line (no label, just amount)
  html+='<div class="row3"><span class="lbl"></span><span class="wt"></span><span class="amt">'+fmt(preGst)+'</span></div>';

  // GST 3% row: label indented | wt=empty | amt=gstAmt
  html+='<div class="row3"><span class="lbl" style="padding-left:${Math.round(F*2)}px">GST 3%</span><span class="wt"></span><span class="amt" style="border-bottom:1px solid #000;">'+fmt(gstAmt)+'</span></div>';

  // Sub Total
  html+='<div class="subtotal-row"><span class="lbl">Sub Total</span><span class="amt">'+fmt(subTotal)+'</span></div>';

  if(idx<items.length-1) html+='<hr class="sep-dash">';
});

document.getElementById('items-body').innerHTML=html;

// Grand total: Total | pcs | totalWeight | grandTotal
var salesGrand = t.grandTotal || 0;
if (isPurchaseOnly) {
  document.getElementById('sales-total-separator').style.display='none';
  document.getElementById('grand-row').style.display='none';
  document.getElementById('after-sales-total-separator').style.display='none';
} else {
  document.getElementById('grand-row').innerHTML=
    '<span class="lbl">Total</span>'+
    '<span class="pcs">'+(t.totalpcs||0)+'</span>'+
    '<span class="wt">'+fmtWt(t.totalGrossWeight||0)+'</span>'+
    '<span class="amt">'+fmt(salesGrand)+'</span>';
}

// Purchase section
var purchHtml = '';
if (purchItems.length > 0) {

  var totalPurchAmt = 0;
  purchItems.forEach(function(p) { totalPurchAmt += Number(p.amount || 0); });

  // Each purchase item row
  purchItems.forEach(function(p) {
    var label = (p.categoryName || p.catname || p.itemname || 'Old items').toUpperCase();
    var wt = p.grswt || p.netwt || 0;
    var amt = p.amount || 0;
    purchHtml +=
      '<div style="margin-top:${Math.round(F*0.4)}px" class="row3">'+
        '<span class="lbl">'+esc(label)+'</span>'+
        '<span class="pcs"></span>'+
        '<span class="wt">'+fmtWt(wt)+'</span>'+
        '<span class="amt">'+fmt(-amt)+'</span>'+
      '</div>';
  });

  purchHtml += '<div style="margin-bottom:${Math.round(F*0.4)}px"></div>';

  // Grand Total row
  var grandNet = salesGrand - totalPurchAmt;
  purchHtml +=
    '<hr class="sep">'+
    '<div class="grand-row">'+
      '<span class="lbl"><b>Grand Total</b></span>'+
      '<span class="pcs"></span>'+
      '<span class="wt"></span>'+
      '<span class="amt">'+fmt(grandNet)+'</span>'+
    '</div>'+
    '<hr class="sep header-sep">';
}
document.getElementById('purchase-section').innerHTML = purchHtml;

var bracket=P.empDisplay||(P.sample&&P.sample.empid?'E'+P.sample.empid:'');
document.getElementById('emp-line').textContent=bracket?'[ '+bracket+' ]':'';
document.getElementById('estno-big').textContent=P.estNo ? 'Est.No :'+P.estNo : '';

function doCapture(){
  var receipt=document.getElementById('receipt');
  html2canvas(receipt,{
    scale:1,width:${W},backgroundColor:'#ffffff',
    logging:false,useCORS:true,allowTaint:true,imageTimeout:8000,
  }).then(function(canvas){
    var w=canvas.width,h=canvas.height;
    var pix=canvas.getContext('2d').getImageData(0,0,w,h).data;
    var bpr=Math.ceil(w/8);
    var res=new Uint8Array(bpr*h);
    for(var row=0;row<h;row++){
      for(var bx=0;bx<bpr;bx++){
        var byte=0;
        for(var bit=0;bit<8;bit++){
          var x=bx*8+bit;
          if(x<w){
            var i=(row*w+x)*4;
            var gray=0.299*pix[i]+0.587*pix[i+1]+0.114*pix[i+2];
            if(gray<220)byte|=(0x80>>bit);
          }
        }
        res[row*bpr+bx]=byte;
      }
    }
    var CHUNK=8192,parts=[];
    for(var p2=0;p2<res.length;p2+=CHUNK){
      parts.push(String.fromCharCode.apply(null,Array.from(res.subarray(p2,p2+CHUNK))));
    }
    window.ReactNativeWebView&&window.ReactNativeWebView.postMessage(JSON.stringify({
      ok:true,base64:btoa(parts.join('')),widthBytes:bpr,heightLines:h,
    }));
  }).catch(function(e){
    window.ReactNativeWebView&&window.ReactNativeWebView.postMessage(JSON.stringify({
      ok:false,error:'html2canvas: '+(e&&e.message?e.message:String(e))
    }));
  });
}

document.fonts.ready.then(function(){
  if(window.ReactNativeWebView){setTimeout(function(){doCapture();},100);}
});

}catch(e){
  window.ReactNativeWebView&&window.ReactNativeWebView.postMessage(JSON.stringify({
    ok:false,error:(e&&e.message)?e.message:String(e)
  }));
}
})();
</script>
</body>
</html>`;
}

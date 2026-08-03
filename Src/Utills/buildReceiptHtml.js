import { TIMES_NEW_ROMAN_BASE64 } from "./Fonts/TimesNewRomanBase64";

const PRINT_WIDTH = 576;
const FONT_BASE = 28;



export function buildHtml(params, W) {
  // Scale font proportionally — 28px was designed for 576px printer width
  const F = Math.round(FONT_BASE * (W / PRINT_WIDTH));
  const p = JSON.stringify(params).replace(/<\//g, "<\\/");


  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
<style>
@font-face {
  font-family: 'TimesNewRoman';
  src: url(data:font/truetype;base64,${TIMES_NEW_ROMAN_BASE64}) format('truetype');
  font-weight: 400;
  font-style: normal;
}
@font-face {
  font-family: 'TimesNewRoman';
  src: url(data:font/truetype;base64,${TIMES_NEW_ROMAN_BASE64}) format('truetype');
  font-weight: 700;
  font-style: normal;
}
* { margin:0; padding:0; box-sizing:border-box; }
body {
  width:${W}px;
  background:#fff;
  font-family: 'TimesNewRoman', serif;
  font-weight: 400;
  font-size: ${F}px;
  color: #000;
  -webkit-print-color-adjust: exact;
}
b, .b { font-family: 'TimesNewRoman', serif; font-weight: 700; }

#receipt {
  width: ${W}px;
  padding: 4px 10px 10px 10px;
  background: #fff;
}
.sep {
  border: none;
  border-top: 1px dashed #000;
  margin: ${Math.round(F * 0.22)}px 0;
}
.blank-row {
  padding: ${Math.round(F * 0.35)}px 0;
  white-space: nowrap;
}
.blank-line {
  display: inline-block;
  border-bottom: 1px solid #000;
  width: ${Math.round(F * 20)}px;
  margin-left: 4px;
  height: ${Math.round(F * 0.9)}px;
}
.row2 {
  display: flex;
  justify-content: space-between;
  padding: ${Math.round(F * 0.12)}px 0;
}
.items-table {
  width: 100%;
  border-collapse: collapse;
  font-size: ${F}px;
}
.items-table th {
  font-weight: 700;
  text-align: left;
  padding: ${Math.round(F * 0.14)}px 2px;
  white-space: nowrap;
}
.items-table th.r,
.items-table td.r { text-align: right; }
.items-table td {
  padding: ${Math.round(F * 0.1)}px 2px;
  vertical-align: top;
}
.item-name-row td {
  font-weight: 700;
  padding-top: ${Math.round(F * 0.3)}px;
}
.sub-row td {
  padding-left: ${Math.round(F * 1.2)}px;
}
.totals-row {
  display: flex;
  justify-content: space-between;
  padding: ${Math.round(F * 0.1)}px 0;
}
.totals-row .indent { padding-left: ${Math.round(F * 6)}px; }
.grand-total-row {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  padding: ${Math.round(F * 0.2)}px 0;
}
.bracket-line {
  text-align: center;
  padding: ${Math.round(F * 0.35)}px 0;
}
.big-estno {
  text-align: center;
  font-weight: 700;
  font-size: ${Math.round(F * 2)}px;
  padding: ${Math.round(F * 0.3)}px 0 ${Math.round(F * 0.15)}px 0;
}
.qr-wrap {
  text-align: center;
  padding-bottom: ${Math.round(F * 0.3)}px;
}
.qr-wrap > div { display: inline-block; }
</style>
</head>
<body>
<div id="receipt">

  <div class="blank-row"><b>NAME &nbsp;:</b><span class="blank-line"></span></div>
  <div class="blank-row"><b>MOBILE :</b><span class="blank-line"></span></div>
<br/>
  <div class="row2"><b>ESTIMATION SLIP</b><b id="estno-top"></b></div>
  <br/>
  <div class="row2"><span id="date-line"></span><span id="gold-line"></span></div>
  <div class="row2"><span id="time-line"></span><span id="silver-line"></span></div>

  <hr class="sep">

  <table class="items-table">
    <thead>
      <tr>
        <th>Description</th>
        <th class="r" style="width:${Math.round(F * 4.4)}px">Weight</th>
        <th class="r" style="width:${Math.round(F * 3.4)}px">V.A</th>
        <th class="r" style="width:${Math.round(F * 4.4)}px">Amount</th>
      </tr>
    </thead>
  </table>

  <hr class="sep">

  <table class="items-table">
    <tbody id="items-body"></tbody>
  </table>

  <hr class="sep">

  <div id="totals"></div>

  <hr class="sep">

  <div class="grand-total-row">
    <span>Sales&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TOTAL:</span>
    <span id="grand-total-val"></span>
  </div>
<br/>
  

  ${params.userId == 1 ? `
  <div class="blank-row"><b>NEW AMT :</b><span class="blank-line"></span></div>
  <div class="blank-row"><b>OLD AMT :</b><span class="blank-line"></span></div>
  <div class="blank-row"><b>BAL AMT :</b><span class="blank-line"></span></div>` : ''}

  <div class="bracket-line b" id="bracket-line"></div>

  <div class="big-estno" id="estno-big"></div>

  <div class="qr-wrap" id="qr-wrap"></div>

</div>

<script>
(function(){
try {

var P = ${p};
var W = ${W};

function fmt(n){ return Number(n||0).toFixed(0); }
function fmtWt(n){ return Number(n||0).toFixed(3); }
function fmtVA(n){ return Number(n||0).toFixed(2); }
function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

document.getElementById('estno-top').textContent =
  'Est.No :' + (P.estNo || '') + (P.costId ? ' - ' + P.costId : '');
document.getElementById('date-line').textContent = 'Date : ' + (P.billDate || '');
document.getElementById('gold-line').textContent = 'Gold  :' + fmt(P.goldRate) + '/Gm';
document.getElementById('time-line').textContent = 'Time : ' + (P.billTime || '');
document.getElementById('silver-line').textContent = 'Silver: ' + fmt(P.silverRate) + '/Gm';

var rows = '';
(P.items || []).forEach(function(item, idx){
  var itemName = (item.itemname || '').toUpperCase();
  var amount = (item.displayAmount != null ? item.displayAmount : item.amount) || 0;
  var vaDisplay = item.wastper && item.wastper > 0 ? fmtVA(item.wastper) + '%' : '';

  rows +=
    '<tr class="item-name-row"><td colspan="4">' + (idx + 1) + ' ' + esc(itemName) +
      ' (' + (item.pcs || 0) + ' Pcs) [' + esc(item.itemid) + '-' + esc(item.tagno) + ']</td></tr>' +
    '<tr>' +
      '<td></td>' +
      '<td class="r">' + fmtWt(item.grswt) + '</td>' +
      '<td class="r">' + vaDisplay + '</td>' +
      '<td class="r">' + fmt(amount) + '</td>' +
    '</tr>';

  if (item.grswt !== item.netwt) {
    rows += '<tr class="sub-row"><td>Netwt: ' + fmtWt(item.netwt) + '</td><td class="r"></td><td class="r"></td><td class="r"></td></tr>';
  }

  (item.stones || []).forEach(function(stone){
    rows +=
      '<tr class="sub-row">' +
        '<td>' + esc(stone.label || 'STUDDED') + '</td>' +
        '<td class="r">' + fmtWt(stone.stnwt) + (stone.stoneunit || '') + '</td>' +
        '<td class="r"></td>' +
        '<td class="r">' + fmt(stone.stnamt) + '</td>' +
      '</tr>';
  });
});
document.getElementById('items-body').innerHTML = rows;

var t = P.totals || {};
var totHtml =
  '<div class="totals-row"><b>Tot.Pcs : ' + (t.totalpcs || 0) + '</b>' +
    '<b class="indent">' + fmtWt(t.totalGrossWeight) + '</b>' +
    '<b>' + fmt(t.grossAmount) + '</b></div>';

if (t.offerDiscount > 0) {
  totHtml += '<div class="totals-row"><span>' + esc(t.offerName || 'Offer') + '</span><span>' + fmt(t.offerDiscount) + '</span></div>';
  totHtml += '<div class="totals-row"><b>TOTAL</b><b>' + fmt(t.baseAmount) + '</b></div>';
}

totHtml += '<div class="totals-row"><span class="indent">CGST (1.5%)</span><span>' + fmt(t.cgstAmount) + '</span></div>';
totHtml += '<div class="totals-row"><span class="indent">SGST (1.5%)</span><span>' + fmt(t.sgstAmount) + '</span></div>';

document.getElementById('totals').innerHTML = totHtml;
document.getElementById('grand-total-val').textContent = fmt(t.grandTotal);

var bracket = P.empDisplay || [P.costId, P.companyName].filter(Boolean).join('-');
document.getElementById('bracket-line').textContent = bracket ? '[' + bracket + ']' : '';
document.getElementById('estno-big').textContent = 'Est.No :' + (P.estNo || '');

function doCapture() {
  var receipt = document.getElementById('receipt');
  html2canvas(receipt, {
    scale:           1,
    width:           W,
    backgroundColor: '#ffffff',
    logging:         false,
    useCORS:         true,
    allowTaint:      true,
    imageTimeout:    8000,
  }).then(function(canvas) {
    var w    = canvas.width;
    var h    = canvas.height;
    var pix  = canvas.getContext('2d').getImageData(0, 0, w, h).data;
    var bpr  = Math.ceil(w / 8);
    var res  = new Uint8Array(bpr * h);

    for (var row = 0; row < h; row++) {
      for (var bx = 0; bx < bpr; bx++) {
        var byte = 0;
        for (var bit = 0; bit < 8; bit++) {
          var x = bx * 8 + bit;
          if (x < w) {
            var idx  = (row * w + x) * 4;
            var gray = 0.299 * pix[idx] + 0.587 * pix[idx+1] + 0.114 * pix[idx+2];
            if (gray < 220) byte |= (0x80 >> bit);
          }
        }
        res[row * bpr + bx] = byte;
      }
    }

    var CHUNK = 8192, parts = [];
    for (var p2 = 0; p2 < res.length; p2 += CHUNK) {
      parts.push(String.fromCharCode.apply(null, Array.from(res.subarray(p2, p2 + CHUNK))));
    }

    window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
      ok:          true,
      base64:      btoa(parts.join('')),
      widthBytes:  bpr,
      heightLines: h,
    }));

  }).catch(function(e){
    window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
      ok: false, error: 'html2canvas: ' + (e && e.message ? e.message : String(e))
    }));
  });
}

document.fonts.ready.then(function() {
  try {
    var qrSize = ${Math.round(F * 4.4)};
    var qrWrap = document.getElementById('qr-wrap');
    qrWrap.innerHTML = '';
    new QRCode(qrWrap, {
      text:         P.estNo || 'NA',
      width:        qrSize,
      height:       qrSize,
      colorDark:    '#000000',
      colorLight:   '#ffffff',
      correctLevel: QRCode.CorrectLevel.M,
    });
  } catch(qrErr) {
    console.warn('QR generation failed:', qrErr);
  }
  if (window.ReactNativeWebView) {
    setTimeout(function() { doCapture(); }, 100);
  }
});

} catch(e) {
  window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
    ok: false, error: (e && e.message) ? e.message : String(e)
  }));
}
})();
</script>
</body>
</html>`;
}

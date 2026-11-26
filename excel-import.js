/* Excel clipboard TSV, including quoted tabs, multiline cells and escaped quotes. */
(function(root){'use strict';
function parse(text,{skipHeader=false}={}){
 if(typeof text!=='string'||!text.trim())throw Error('Excelの問題・答えの2列をコピーして貼り付けてください。');
 text=text.replace(/^\uFEFF/,'').replace(/\r\n/g,'\n').replace(/\r/g,'\n');
 const rows=[];let row=[],cell='',quoted=false,closed=false,start=true;
 function field(){row.push(cell);cell='';closed=false;start=true;}
 function line(){field();rows.push(row);row=[];}
 for(let i=0;i<text.length;i++){const c=text[i];if(quoted){if(c==='"'){if(text[i+1]==='"'){cell+='"';i++;}else{quoted=false;closed=true;}}else cell+=c;continue;}
  if(c==='\t'){field();continue;}if(c==='\n'){line();continue;}
  if(closed)throw Error('引用符の後の区切りが不正です。Excelから2列をコピーし直してください。');
  if(c==='"'&&start){quoted=true;start=false;}else{cell+=c;start=false;}
 }
 if(quoted)throw Error('セル内の引用符が閉じていません。Excelからコピーし直してください。');
 line();if(skipHeader)rows.shift();const questions=[];
 rows.forEach((r,index)=>{if(r.every(c=>!c.trim()))return;const number=index+1+(skipHeader?1:0);if(r.length!==2)throw Error(number+'行目：問題・答えの2列だけを貼り付けてください。');const q=r[0].trim(),a=r[1].trim();if(!q||!a)throw Error(number+'行目：問題か答えが空です。');if(q.length>20000||a.length>20000)throw Error(number+'行目：1セルは20,000文字以内にしてください。');questions.push({q,a});});
 if(!questions.length)throw Error('追加できる問題がありません。');if(questions.length>10000)throw Error('一度に追加できるのは10,000問までです。');return questions;
}
if(typeof module==='object'&&module.exports)module.exports={parse};else root.ExcelQuestions={parse};
})(typeof window==='object'?window:this);

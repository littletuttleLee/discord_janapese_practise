// googleSheet.js
/*
const { GoogleSpreadsheet } = require('google-spreadsheet');

/**
 * @param  {String} docID the document ID
 * @param  {String} sheetID the google sheet table ID
 * @param  {String} credentialsPath the credentials path defalt is './credentials.json'
 */
/*
async function getData(docID, sheetID, credentialsPath = './credentials.json') {


  const result = [];
//   const doc = new GoogleSpreadsheet(docID);
  const creds = require(credentialsPath);
  const doc = await new GoogleSpreadsheet(sheetID);
  doc.useServiceAccountAuth(creds, function (err) {
    // Get all of the rows from the spreadsheet.
    
    doc.getRows(1, function (err, rows) {
      //console.log(rows);
      //console.log(rows.length);
      
      //刪除
      //rows[0].del() // this is asynchronous
      
      //新增
      doc.addRow(1, { 物件: '法國香榭', 坪數: '18.72坪', 總價: '390萬', 格局: '1房1廳1衛', 日期: '2017/07/20' }, function(err) {
        if(err) {
          console.log(err);
        }
      });    
      
    });
  });
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  console.log(sheet.title);
  console.log(sheet.rowCount);
//   for (row of rows) {
//     result.push(row._rawData);
//   }
//   return result;
};*/

const { google } = require('googleapis');
const sheets = google.sheets('v4');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // 引入 dotenv

const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
// const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'));
const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});


async function accessSpreadsheet() {
    const authClient = await auth.getClient();

    const request = {
      spreadsheetId: process.env.sheetId,// Google Sheets ID
      range: '工作表1!A1:B5',
      auth: authClient,
    };
  
    try {//讀取數據
        console.log((await sheets.spreadsheets.values.get(request)).data.values);
    //   const response = (await sheets.spreadsheets.values.get(request)).data;
    //   console.log('Data:', response.values);
    } catch (err) {
      console.error('The API returned an error:', err);
    }
  }

  const date = new Date;

  async function updateSpreadsheet(data,num,type) {
    const authClient = await auth.getClient();
    let value = [];
    if(type==1){
        value = [// 替换为你想要写入的数据
          [
          date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate(),
          data[0],  
          data[1],
          data[2],
          data[3],
          ],
        ]
    }else{
        value = [data];
    }
    const request = {
      spreadsheetId: process.env.sheetId,  // Google Sheets ID
      range: `工作表1!B${num}:F${num}`,
      valueInputOption: 'RAW',  // 数据输入方式：RAW 或 USER_ENTERED
      auth: authClient,
      resource: {
        values: value,
      },
    };
  
    try {
      // 更新Google Sheets中的數據
      await sheets.spreadsheets.values.update(request)
    //   const response = (await sheets.spreadsheets.values.update(request)).data;
    //   console.log('Update successful:', response);
    } catch (err) {
      console.error('The API returned an error:', err);
    }
  }
  
  
// module.exports = {
//   //getData,
//   accessSpreadsheet,
//   updateSpreadsheet
// };
exports.updateSpreadsheet=updateSpreadsheet;
exports.accessSpreadsheet=accessSpreadsheet;
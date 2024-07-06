<<<<<<< HEAD
require('dotenv').config(); // 引入 dotenv
const mongoose = require('mongoose');

const { makelist } = require('./makebuttom');


const { accessSpreadsheet , updateSpreadsheet} = require('./googleSheet.js');//getData , 



// updateSpreadsheet(["abc","bcd","cde","def"],5);
// accessSpreadsheet();
// updateSpreadsheet();

// (async () => {
//   const resp = await getData('', '1N3-xFOqrEDqTK9heWhqZoJKy1jXur7LcDEz64DtihCg');
//   console.log(resp);
// })();

// const apiKey = "AIzaSyBU-wUYgCrINSW-rL_zsjLeJkU3uDWBYEI";//1dec70661c77fa18fe195435e258ab9f511910a7
// const sheetId = "1N3-xFOqrEDqTK9heWhqZoJKy1jXur7LcDEz64DtihCg";
// // Sheets 中要取得的資料範圍，格式如下
// const range = "工作表1!A1:B5";
// // Sheets API 的 URL
// const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

 
// // 使用 fetch 打 API
// fetch(url)
//   .then((response) => response.json())
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((error) => console.error("Error:", error));

async function connectMongoDB () {
    try {
        await mongoose.connect(process.env.dburl)
        console.log('Connected to MongoDB...');
    } catch (error) {
        console.log(error)
    }
}
  
connectMongoDB();

const todoSchema = new mongoose.Schema({
    id: Number,
    date:String,
    classification: String,
    word_char:String,
    word_chinese: String,
    word_text: String,
});

const Todo = mongoose.model('WordList', todoSchema);

const {
    Client,
    GatewayIntentBits,
    Partials,
    Events,
    ChannelManager,
    EmbedBuilder ,
} = require('discord.js');

const client = new Client({
intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent],
    partials:[
        Partials.Channel
    ]
});

const updateSheets = async () => {
    let data = await Todo.find();
    for(let i=0;i<data.length;i++){
        await updateSpreadsheet([data[i]["date"],data[i]["word_char"],data[i]["word_text"],data[i]["word_chinese"],data[i]["classification"]],i+2,2);
    }
    
}
// updateSheets();

client.once(Events.ClientReady, () => {
    console.log('Ready!');
});

let flag_user=[];

client.on(Events.InteractionCreate, async (interaction)=>{
    const date = new Date;
    // console.log(interaction)
    if (interaction.commandName === 'ping') {
        await interaction.reply("||說! 你是誰||");
    }
    if(interaction.commandName==='inputword'){
        await interaction.reply({content:"請輸入您今天學到的單字吧\n(請記得按照格式輸入)\nex:高い たかい 高的 形容詞(含漢字日文、純日文、中文、詞性)",ephemeral:true});
        flag_user.push(interaction.user.username);
    }
    if(interaction.commandName==='editword'){
        
    }
    if(interaction.commandName==='randomword'){
        // console.log(await Todo.find());
        interaction.reply(makelist(0));
    }
    if(interaction.customId === 'click_oneday'){
        let data =  await Todo.find();
        if(data.length<=0){
            interaction.reply({content:"您目前沒有練習的單字喔",ephemeral: true});
            return 0;
        }
        // console.log(data);
        interaction.reply(makelist(1,1));
    }
    if(interaction.customId === 'click_fiveword'){
        interaction.reply(makelist(1,2));
    }
    if(interaction.customId === 'click_word_c_1' || interaction.customId === 'click_word_j_1'){
        // let data =  await Todo.find({date:date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()});
        // let type = interaction.customId.replace(/click_word_|_1/g,"")=="c"?1:2;
        // interaction.reply({content:PrintAns(type,data),ephemeral: true});
        let day_class_list = [],data=[];
        data = await Todo.find();
        while(true){
            let day_class = [];
            if(data==undefined || data=="")break;
            if(Array.isArray(data)){
                day_class = data[0].date;
                day_class_list.push(day_class);
                data = data.filter(e=>{return e.date!=day_class});
            }else{
                day_class = data.date;
                day_class_list.push(day_class);
                break;
            }
        }
        interaction.reply(makelist(3,day_class_list,interaction.customId === 'click_word_c_1'?1:2));
    }
    if(interaction.customId === 'click_word_j_2' || interaction.customId === 'click_word_c_2'){
        let data = await Todo.find();
        let type = interaction.customId.replace(/click_word_|_2/g,"")=="c"?1:2;
        let random_data = [];
        while(random_data.length<5){
            let flashdata = data[Math.floor(Math.random()*data.length)];
            data.splice(data.indexOf(flashdata),1);
            random_data.push(flashdata);
            if(data.length==0)break;
        }
        interaction.reply({content:PrintAns(type,random_data),ephemeral: true});

    }
    if(interaction.customId === 'click_word_c_3' || interaction.customId === 'click_word_j_3'){
        let word_class_list = [],data=[];
        data = await Todo.find();//.select('-__v -_id')
        while(true){
            let word_class = [];
            // console.log(data)
            if(data==undefined || data=="")break;
            if(Array.isArray(data)){
                word_class = data[0].classification;
                word_class_list.push(word_class);
                // console.log(word_class);
                data = data.filter(e=>{return e.classification!=word_class});
            }
            else{
                word_class = data.classification;
                word_class_list.push(word_class);
                break;
            }
            
            // console.log(Array.isArray(data));
            // data = data.find(e=>{return e.classification!=word_class});//if(e.classification!=word_class)return e
            
            // data=_data.splice(0,_data.length);
        }
        // word_class_list = data.map(e=>{return e.classification});
        // console.log(Array.from(set(word_class_list)))

        // console.log(data[0]);
        // console.log(word_class_list);
        interaction.reply(makelist(2,word_class_list,interaction.customId === 'click_word_c_3'?1:2));
    }
    if(interaction.customId === "click_class")interaction.reply(makelist(1,3));
    if(interaction.customId === "class_select_classification_1" || interaction.customId === "class_select_classification_2"){
        let data = await Todo.find({classification:interaction.values});
        let type = interaction.customId.replace("class_select_classification_","");
        let random_data = [];
        while(random_data.length<5){
            let flashdata = data[Math.floor(Math.random()*data.length)];
            data.splice(data.indexOf(flashdata),1);
            random_data.push(flashdata);
            if(data.length==0)break;
        }
        interaction.reply({content:PrintAns(type,random_data),ephemeral: true});
    }
    if(/class_select_day_/.test(interaction.customId)){
        let data = await Todo.find({date:interaction.values});
        let type = interaction.customId.replace("class_select_day_","");
        interaction.reply({content:PrintAns(type,data),ephemeral: true})
    }
    if(interaction.commandName === "wordlist"){
        interaction.reply({content:"https://docs.google.com/spreadsheets/d/1N3-xFOqrEDqTK9heWhqZoJKy1jXur7LcDEz64DtihCg/edit?usp=sharing",ephemeral: true});
        // updateSheets();
    }
    
});

const PrintAns = (type,data) =>{
    let re_data="";
    if(type==1){
        for(let i=0;i<data.length;i++){
            re_data+=`純日文: ${data[i]["word_char"]} ,漢字日文: ${data[i]["word_text"]} \n答:|| 中文: ${data[i]["word_chinese"]}||\n`;
        }
    }else{
        for(let i=0;i<data.length;i++){
            re_data+=`中文: ${data[i]["word_chinese"]} \n答:|| 純日文: ${data[i]["word_char"]} ,漢字日文: ${data[i]["word_text"]}||\n`;
        }
    }
    return re_data;
}

client.on(Events.MessageCreate,async (interaction)=>{
    const date = new Date;
    // console.log(interaction);
    if(flag_user.indexOf(interaction.author.username)!=-1){
        let finishflag = 0;
        // console.log("%s %s",interaction.author.username,interaction.content);
        flag_user.splice(flag_user.indexOf(interaction.author.username),1);
        // console.log(date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate());
        // console.log(flag_user);
        // console.log(interaction.content);
        let data_defualt = (interaction.content).split("\n");
        // console.log(data);
        for(let i=0;i<data_defualt.length;i++){
            
            let data = data_defualt[i].split(/ |　/);
            if(data.length==1 && data=="取消")break;
            if(data.length!=4){
                console.log(data,"儲存失敗");
                continue;
            }
            const todo_list = new Todo({
                date:date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate(),
                classification:data[3],
                word_char:data[0],
                word_chinese:data[2],
                word_text:data[1],
            });
            let check = await Todo.findOne({word_text:data[1],word_chinese:data[2]});
            // console.log(check);
            if (check!=null){
                console.log(data,"已重複了");
                continue;
            }
            let num = (await Todo.find()).length + 2;
            await updateSpreadsheet(data,num,1);
            console.log(data,"sheets儲存成功");
            await todo_list.save();
            console.log(data,"database儲存成功");
            // console.log(todo_list);
            finishflag+=1;
        }
        interaction.channel.send(finishflag!=0?`已成功儲存${finishflag}個單字`:"儲存失敗");
        interaction.delete();
    }
});

client.login(process.env.Discord_ID);
=======
require('dotenv').config(); // 引入 dotenv
const mongoose = require('mongoose');

const { makelist } = require('./makebuttom');


const { accessSpreadsheet , updateSpreadsheet} = require('./googleSheet.js');//getData , 



// updateSpreadsheet(["abc","bcd","cde","def"],5);
// accessSpreadsheet();
// updateSpreadsheet();

// (async () => {
//   const resp = await getData('', '1N3-xFOqrEDqTK9heWhqZoJKy1jXur7LcDEz64DtihCg');
//   console.log(resp);
// })();

// const apiKey = "AIzaSyBU-wUYgCrINSW-rL_zsjLeJkU3uDWBYEI";//1dec70661c77fa18fe195435e258ab9f511910a7
// const sheetId = "1N3-xFOqrEDqTK9heWhqZoJKy1jXur7LcDEz64DtihCg";
// // Sheets 中要取得的資料範圍，格式如下
// const range = "工作表1!A1:B5";
// // Sheets API 的 URL
// const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

 
// // 使用 fetch 打 API
// fetch(url)
//   .then((response) => response.json())
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((error) => console.error("Error:", error));

async function connectMongoDB () {
    try {
        await mongoose.connect(process.env.dburl)
        console.log('Connected to MongoDB...');
    } catch (error) {
        console.log(error)
    }
}
  
connectMongoDB();

const todoSchema = new mongoose.Schema({
    id: Number,
    date:String,
    classification: String,
    word_char:String,
    word_chinese: String,
    word_text: String,
});

const Todo = mongoose.model('WordList', todoSchema);

const {
    Client,
    GatewayIntentBits,
    Partials,
    Events,
    ChannelManager,
    EmbedBuilder ,
} = require('discord.js');

const client = new Client({
intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent],
    partials:[
        Partials.Channel
    ]
});

const updateSheets = async () => {
    let data = await Todo.find();
    for(let i=0;i<data.length;i++){
        await updateSpreadsheet([data[i]["date"],data[i]["word_char"],data[i]["word_text"],data[i]["word_chinese"],data[i]["classification"]],i+2,2);
    }
    
}
// updateSheets();

client.once(Events.ClientReady, () => {
    console.log('Ready!');
});

let flag_user=[];

client.on(Events.InteractionCreate, async (interaction)=>{
    const date = new Date;
    // console.log(interaction)
    if (interaction.commandName === 'ping') {
        await interaction.reply("||說! 你是誰||");
    }
    if(interaction.commandName==='inputword'){
        await interaction.reply({content:"請輸入您今天學到的單字吧\n(請記得按照格式輸入)\nex:高い たかい 高的 形容詞(含漢字日文、純日文、中文、詞性)",ephemeral:true});
        flag_user.push(interaction.user.username);
    }
    if(interaction.commandName==='editword'){
        
    }
    if(interaction.commandName==='randomword'){
        // console.log(await Todo.find());
        interaction.reply(makelist(0));
    }
    if(interaction.customId === 'click_today'){
        let data =  await Todo.find({date:date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()});
        if(data.length<=0){
            interaction.reply("今天您目前沒有練習的單字喔");
            return 0;
        }
        // console.log(data);
        interaction.reply(makelist(1,1));
    }
    if(interaction.customId === 'click_fiveword'){
        interaction.reply(makelist(1,2));
    }
    if(interaction.customId === 'click_word_c_1' || interaction.customId === 'click_word_j_1'){
        let data =  await Todo.find({date:date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()});
        let type = interaction.customId.replace(/click_word_|_1/g,"")=="c"?1:2;
        interaction.reply({content:PrintAns(type,data),ephemeral: true});
    }
    if(interaction.customId === 'click_word_j_2' || interaction.customId === 'click_word_c_2'){
        let data = await Todo.find();
        let type = interaction.customId.replace(/click_word_|_2/g,"")=="c"?1:2;
        let random_data = [];
        while(random_data.length<5){
            let flashdata = data[Math.floor(Math.random()*data.length)];
            data.splice(data.indexOf(flashdata),1);
            random_data.push(flashdata);
            if(data.length==0)break;
        }
        interaction.reply({content:PrintAns(type,random_data),ephemeral: true});

    }
    if(interaction.customId === 'click_word_c_3' || interaction.customId === 'click_word_j_3'){
        let word_class_list = [],data=[];
        data = await Todo.find();//.select('-__v -_id')
        while(true){
            let word_class = [];
            //console.log(data)
            if(data==undefined || data=="")break;
            if(Array.isArray(data)){
                word_class = data[0].classification;
                word_class_list.push(word_class);
                // console.log(word_class);
                data = data.filter(e=>{return e.classification!=word_class});
            }
            else{
                word_class = data.classification;
                word_class_list.push(word_class);
                break;
            }
            
            // console.log(Array.isArray(data));
            // data = data.find(e=>{return e.classification!=word_class});//if(e.classification!=word_class)return e
            
            // data=_data.splice(0,_data.length);
        }
        // word_class_list = data.map(e=>{return e.classification});
        // console.log(Array.from(set(word_class_list)))

        // console.log(data[0]);
        // console.log(word_class_list);
        interaction.reply(makelist(2,word_class_list,interaction.customId === 'click_word_c_3'?1:2));
    }
    if(interaction.customId === "click_class")interaction.reply(makelist(1,3));
    if(interaction.customId === "class_select_classification_1" || interaction.customId === "class_select_classification_2"){
        let data = await Todo.find({classification:interaction.values});
        let type = interaction.customId.replace("class_select_classification_","");
        let random_data = [];
        while(random_data.length<5){
            let flashdata = data[Math.floor(Math.random()*data.length)];
            data.splice(data.indexOf(flashdata),1);
            random_data.push(flashdata);
            if(data.length==0)break;
        }
        interaction.reply({content:PrintAns(type,random_data),ephemeral: true});
    }
    if(interaction.commandName === "wordlist"){
        interaction.reply({content:"https://docs.google.com/spreadsheets/d/1N3-xFOqrEDqTK9heWhqZoJKy1jXur7LcDEz64DtihCg/edit?usp=sharing",ephemeral: true});
        // updateSheets();
    }
    
});

const PrintAns = (type,data) =>{
    let re_data="";
    if(type==1){
        for(let i=0;i<data.length;i++){
            re_data+=`純日文: ${data[i]["word_char"]} ,漢字日文: ${data[i]["word_text"]} \n答:|| 中文: ${data[i]["word_chinese"]}||\n`;
        }
    }else{
        for(let i=0;i<data.length;i++){
            re_data+=`中文: ${data[i]["word_chinese"]} \n答:|| 純日文: ${data[i]["word_char"]} ,漢字日文: ${data[i]["word_text"]}||\n`;
        }
    }
    return re_data;
}


client.on(Events.MessageCreate,async (interaction)=>{
    // console.log(interaction);
    if(flag_user.indexOf(interaction.author.username)!=-1){
        const date = new Date;
        let finishflag = 0;
        // console.log("%s %s",interaction.author.username,interaction.content);
        flag_user.splice(flag_user.indexOf(interaction.author.username),1);
        // console.log(date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate());
        // console.log(flag_user);
        // console.log(interaction.content);
        let data_defualt = (interaction.content).split("\n");
        // console.log(data);
        for(let i=0;i<data_defualt.length;i++){
            
            let data = data_defualt[i].split(/ |　/);
            if(data.length==1 && data=="取消")break;
            if(data.length!=4)continue;
            const todo_list = new Todo({
                date:date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate(),
                classification:data[3],
                word_char:data[0],
                word_chinese:data[2],
                word_text:data[1],
            });
            let check = await Todo.findOne({word_text:data[1],word_chinese:data[2]});
            // console.log(check);
            if (check!=null){
                console.log(data,"已重複了");
                continue;
            }
            let num = (await Todo.find()).length + 2;
            await updateSpreadsheet(data,num,1);
            console.log(data,"sheets儲存成功");
            await todo_list.save();
            console.log(data,"database儲存成功");
            // console.log(todo_list);
            finishflag+=1;
        }
        interaction.channel.send(finishflag!=0?`已成功儲存${finishflag}個單字`:"儲存失敗");
        interaction.delete();
    }
});

client.login(process.env.Discord_ID);
>>>>>>> c8dd4ad5708223d3fe8145b82deeeeef733f7739

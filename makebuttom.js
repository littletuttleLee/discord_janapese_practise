const makelist = (n,data,type) => {
    if(n==0){
        return {
            "content": "隨機單字練習~",
            "components": [
                {
                    "type": 1,
                    "components": [
                        {
                            "type": 2,
                            "label": "重新複習某日單字",
                            "style": 1,
                            "custom_id": "click_oneday"
                        },
                        {
                            "type": 2,
                            "label": "隨機複習5個單字",
                            "style": 1,
                            "custom_id": "click_fiveword"
                        },
                        {
                            "type": 2,
                            "label": "選擇詞性練習",
                            "style": 1,
                            "custom_id": "click_class"
                        },
                    ]
        
                }
            ]
        }
    }else if(n==1){
        return {
            "content": "請選擇重新複習方式",
            "components": [
                {
                    "type": 1,
                    "components": [
                        {
                            "type": 2,
                            "label": "看中練日",
                            "style": 1,
                            "custom_id": `click_word_j_${data}`
                        },
                        {
                            "type": 2,
                            "label": "看日練中",
                            "style": 1,
                            "custom_id": `click_word_c_${data}`
                        }
                    ]
        
                }
            ],
            ephemeral: true
        }
    }else if(n==2){
        const list = [];
        for(let i=0;i<data.length;i++){
            list.push({
                    label: data[i],
                    value: data[i],
                })
        }
        return {
            content: `請選擇需練習之詞性`,
            type:1,
            components: [{
                type: 1,
                components: [
                    {
                    type: 3,
                    custom_id: `class_select_classification_${type}`,
                    options:list,
                "placeholder": "Choose a class", //提示字元
                "min_values": 1,
                "max_values": 1
                }
              ]
    
          }],
            ephemeral: true
        }
    }else if(n==3){
        const date = new Date;
        const list = [];

        for(let i=data.length-1;i>=0;i--){
            list.push({
                    label: data[i]==date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()?data[i]+"(今日)":data[i],
                    value: data[i],
                })
        }
        return {
            content: `請選擇需練習日子`,
            type:1,
            components: [{
                type: 1,
                components: [
                    {
                    type: 3,
                    custom_id: `class_select_day_${type}`,
                    options:list,
                "placeholder": "Choose a class", //提示字元
                "min_values": 1,
                "max_values": 1
                }
              ]
    
          }],
            ephemeral: true
        }
    }

}
exports.makelist=makelist;

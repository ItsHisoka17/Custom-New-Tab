function handleHistory(){
    let date = 1000 * 60 * 60 * 24 * 7;
    let range = (new Date()).getTime() - date;
    let dataOBJ = {
         cache: true,
         history: true,
         downloads: true,
     };
   function deleteHistory(ms, callback){
    if (ms&&!isNaN(ms)){
        let t = (new Date()).getTime() - ms; 
        range = t;
    }
    chrome.browsingData.remove(
     {since:range},
     dataOBJ
    );
     if(callback){
         callback(dataOBJ)
     };
   };

    chrome.runtime.onMessage.addListener(function(d){
        if(d.m&&d.m==="del_history"){
            deleteHistory(null, function(data){
                chrome.runtime.sendMessage({data, m: "history_cleared"});
            });
        };
    });
    chrome.tabs.onRemoved.addListener((tabid)=>{
            deleteHistory();
            chrome.runtime.sendMessage({m: "del_history"});
    });
};

handleHistory();
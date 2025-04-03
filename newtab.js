  $(document).ready(function (){
    search();
    getRightNav();
    historyEvent();
    tabBG();
});
                        
function randomize(array){
        return array[Math.round(Math.random() * array["length"]-1)];
};

function getRightNav(){
    let time = moment().format('hh:mm A')
    let date = moment().toDate().toString();
    date = date.split(" ").slice(0, 3).join(" ");
    let timeDate = `${date}, ${time} `;
    let t = document.createElement('a');
    t.style.float = 'right';
document.getElementsByClassName('navbar')[0].appendChild(t);
    $('.time').html(timeDate);
    $('.time').click(()=>{
        let c = document.getElementsByClassName('time')[0].innerHTML;
        if (c===time){
            $('.time').html(date);
        } else if (c===timeDate){
            $('.time').html(time);
        } else if (c===date){
            $('.time').html(timeDate)
        }
    });
    let grt = document.getElementById('grt_t');
    let arr = ['Hey there, how\'s going?', 'Good day to you sir!','Amazing day ahead of us'];
    let g;
    function getA(){
       let a = randomize(arr);
       if (a===undefined){
        getA();
       } else {
        g = a;
       };
    };
    getA();
    grt.innerHTML = g;
};

function search(){
    function dspElements(...args){
        for (let e of args){
            let parent = document.getElementById(e[0]);
            let child = document.getElementById(e[1]);
            parent.addEventListener("mouseover", ()=>{
                $(`#${child.id}`).css("display", "block");
            });
            parent.addEventListener("mouseout", ()=>{
                $(`#${child.id}`).css("display", "none");
            });
            child.addEventListener("mouseover", ()=>{
                 $(`#${child.id}`).css("display", "block");
            });
            child.addEventListener("mouseout", ()=>{
                 $(`#${child.id}`).css("display", "none");
            });
        };
    };
    dspElements(["search", "inp"], ["yt", "ytsearch"], ["ent", "netflix"], ["ent", "disney"], ["netflix", "disney"], ["disney", "netflix"]);
    $("#gsearch").submit((e)=>{
        let val = $("#url").val();
        let urlregex = /^https?:\/\/([A-Za-z]|[0-9])+\.[a-z]{2,3}\/?(([A-Za-z]|[0-9])+)?$/;
        if (val.match(urlregex)){
            window.location.replace(val);
            e.preventDefault();
        };
    })
};

function historyEvent(){
    function createMessage(a){
     let e = document.createElement('a');
     e.id = "delM";
     e.style.fontSize = "16px";
     document.getElementById("nav").appendChild(e) ;
     function display(){
         e.innerHTML = `Browsing Data Cleared (${Object.keys(a).join(" | ")})`;
         return {display, remove}
     };
     function remove(){
         e.remove();
         return false;
     };
      return {display, remove};
    };
    
    chrome.runtime.onMessage.addListener((d)=>{
        let { m,data } = d;
        if (m === "history_cleared"){
            let nM = createMessage(data).display();
            setTimeout(nM.remove, 3000);
        };
    });
    document.getElementById("del").onclick = ()=>{
        chrome.runtime.sendMessage({m: "del_history"});
    };
    let keymap = {};
    
    document.onkeyup = function(e){
        if (keymap[e.code]){
            delete keymap[e.code];
        };
    };
    document.onkeydown = function(e){
        if (e.ctrlKey){
            keymap["ControlLeft"]=true;
            if (e.code==="KeyH"){
                e.preventDefault();
                keymap["KeyH"]=true;
               if (keymap["ControlLeft"]&&keymap["KeyH"]){
                chrome.runtime.sendMessage({m: "del_history"});
                e.preventDefault();
               };
            };              
    };
  };
};

function tabBG(){
    let m = Math.ceil(1);
    let mx = Math.floor(11);
    let fileN = Math.floor(Math.random()*(mx-m+1))+m;
    document.body.style.backgroundImage = `url(backgrounds/${fileN}.jpeg)`;
    document.body.style.backgroundSize = 'cover';
};
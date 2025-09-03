  $(document).ready(function (){
    search();
    getRightNav();
    historyEvent();
    tabBG();
    bookMark();
});
                        
function randomize(array){
        return array[Math.round(Math.random() * array["length"]-1)];
};

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

function validateURL(url){
    let urlRegex = /^https?:\/\/[A-Za-z0-9]+(\.[A-Za-z]{2,})+(\/[A-Za-z0-9]*)?$/;
    if (url.match(urlRegex)) {
        return true;
    } else {
        return false;
    };
}

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
    let arr = ["Hey there, how is it going?", "Good day!","Amazing day ahead of us"];
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
    dspElements(["search", "inp"], ["yt", "ytsearch"], ["ent", "netflix"], ["ent", "disney"], ["netflix", "disney"], ["disney", "netflix"]);
    $("#gsearch").submit((e)=>{
        let val = $("#url").val();
        if (validateURL(val)){
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
    document.body.style.backgroundImage = `url(public/${fileN}.jpeg)`;
    document.body.style.backgroundSize = 'cover';
};

function bookMark(){
    function append(n, u){
        let existingLinks = document.querySelectorAll("#bookmark5 a");
        for (let link of existingLinks) {
            if (link.href === u || link.textContent.replace("x", "").trim() === n.trim()) {
            return;;
        }
    }
        let b = document.createElement("a");
        b.href = u;
        b.innerHTML = n;
        let p = document.createElement("button");
        p.innerHTML = "x";
        p.title = "Remove Bookmark"
        p.className = "bookmark-remove";
        b.appendChild(p)
        document.getElementById("bookmark5").appendChild(b);
        p.addEventListener("click", (e) => {
            e.preventDefault();
            b.remove();
            chrome.storage.local.get("bookmarks", ( {bookmarks} ) => {
                if (!Array.isArray(bookmarks)) return;
                bookmarks.splice(bookmarks.indexOf(bookmarks.find((v)=> {v.name===b.textContent})), 1);
                chrome.storage.local.set({bookmarks: bookmarks});
            })
        })
    };
    chrome.storage.local.get("bookmarks", (b) => {
        let { bookmarks } = b;
        if (Array.isArray(bookmarks)){
            for (let e of bookmarks ) {
                append(e.name, e.url);
            };
        };
    });
    $("#bookmark").hover(
        ()=> {
            $("#bookmark5").show();
        },
        ()=> {
            $("#bookmark5").css("display", "none");
        }
    );
    $(".bookmark-wrapper").hover(
        ()=> {
            $("#bookmark5").show();
        },
        ()=> {
            $("#bookmark5").css("display", "none");
        }
    );
    $("#bookmark5").hover(
        ()=> {
            $("#bookmark5").show();
        },
        ()=> {
            $("#bookmark5").css("display", "none");
        }
    );
    $("#bookmark").click(()=> {
        $("#bookmark1").show();
    });
    $("#bookmark2").submit((e)=> {
        e.preventDefault();
        let name = $("#pageName").val();
        let url = $("#pageURL").val();
        console.log(name, url)
        if (!validateURL(url)) {
            alert("Invalid URL");
            return;
        };
        append(name, url);
        chrome.storage.local.get("bookmarks", (b) => {
            let bookmarks = Array.isArray(b.bookmarks) ? b.bookmarks : [];
            bookmarks.push({name, url});
            chrome.storage.local.set({bookmarks: bookmarks});
        });
        $("#bookmark1").css("display", "none");
        $("#pageName").val("");
        $("#pageURL").val("");
    });
    $("#bookmark3").click((e)=> {
        e.preventDefault();
        $("#bookmark1").css("display", "none");
    });
};
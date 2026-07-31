const musicFile =
document.getElementById("music-file");
const audio =
new Audio();

/*
노래 추가 버튼
*/
document
.getElementById("load-music")
.onclick=()=>{
    musicFile.click();
};

musicFile.onchange=e=>{
    const file =
    e.target.files[0];
    if(file){
        audio.src =
        URL.createObjectURL(file);
    }
};

/*
재생
*/
document
.getElementById("play")
.onclick=()=>{
    audio.play();
    animateLine();
};

/*
일시정지
*/
document
.getElementById("pause")
.onclick=()=>{
    audio.pause();
};

/*
초기화
*/
document
.getElementById("reset")
.onclick=()=>{
    audio.currentTime=0;
    updateLine();
};

/*
박자 변경
*/
document
.querySelectorAll(".division")
.forEach(button=>{
    button.onclick=()=>{
        division =
        button.dataset.value;
        drawBeatLines();
        console.log(
        "현재 박자 : 1/"+division
        );
    };
});

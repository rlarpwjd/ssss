const editor =
document.getElementById("editor");
const playLine =
document.getElementById("play-line");
const musicFile =
document.getElementById("music-file");
const audio =
new Audio();

/*
시간 설정
1/4 = 1초
*/
let division = 4;
const beatTime = {
4:1000,
8:500,
16:250,
32:125,
64:62.5,
128:31.25
};

/*
1초당 화면 이동 거리
*/
const timeHeight = 200;

/*
20레인 생성
*/
for(let i=0;i<20;i++){
    const lane =
    document.createElement("div");
    lane.className="lane";
    editor.appendChild(lane);
}

/*
시간선 생성
기본:
1초마다 흰색 선
*/
drawBeatLines();

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

/*
빨간선 부드럽게 이동시키는 함수
재생 중일 때만 계속 실행됨
*/
function animateLine(){

    updateLine();

    if(!audio.paused){
        requestAnimationFrame(animateLine);
    }

}

function updateLine(){
    let time =
    audio.currentTime;
    let y =
    time*timeHeight;
    playLine.style.bottom=
    y+"px";
}

/*
흰색 줄 그리기 함수
division에 맞는 간격으로 다시 그림
4의 배수 줄은 굵게 표시
*/
function drawBeatLines(){

    // 기존 흰색 줄 전부 제거
    document
    .querySelectorAll(".beat-line")
    .forEach(line => line.remove());

    // 이번 박자의 초 단위 간격 계산
    const intervalSec = beatTime[division] / 1000;

    // 초 단위 간격 * timeHeight = px 간격
    const pxInterval = intervalSec * timeHeight;
    let count = 1;   // 몇 번째 줄인지 세는 변수
    for(
    let y = pxInterval;
    y < 100000;
    y += pxInterval
    ){
        const line =
        document.createElement("div");
        line.className = "beat-line";

        // 4번째 줄마다 굵은 줄 클래스 추가
        if(count % 4 === 0){
            line.classList.add("beat-line-strong");
        }
        line.style.bottom = y + "px";
        editor.appendChild(line);
        count++;
    }
}

/*
노트 선택
*/
let selectedNote = null;   // 현재 선택된 노트 종류

document
.querySelectorAll(".note-type")
.forEach(button=>{
    button.onclick=()=>{

        // 기존 선택 표시 다 지우고
        document
        .querySelectorAll(".note-type")
        .forEach(b=>b.classList.remove("selected"));

        // 지금 누른 버튼만 선택 표시
        button.classList.add("selected");

        selectedNote = button.dataset.note;

    };
});

/*
노트 배치
선택된 노트 + 클릭한 위치(레인, 흰색선)를 기준으로 생성
*/
editor.addEventListener("click", e=>{

    // 선택된 노트가 없으면 아무것도 안 함
    if(!selectedNote) return;

    // 클릭한 지점의 에디터 내부 좌표 계산
    const rect = editor.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickYFromTop = e.clientY - rect.top;

    // 흰 선/빨간 선처럼 bottom 기준 좌표로 변환
    const clickYFromBottom = editor.offsetHeight - clickYFromTop;

    // 가장 가까운 흰색 줄 위치로 스냅(딱 붙임)
    const intervalSec = beatTime[division] / 1000;
    const pxInterval = intervalSec * timeHeight;
    const snappedY = Math.round(clickYFromBottom / pxInterval) * pxInterval;

    // 클릭한 x좌표로 레인 번호 계산 (20레인 기준)
    const laneWidth = editor.offsetWidth / 20;
    const laneIndex = Math.floor(clickX / laneWidth);

    // 노트 요소 생성
    const note = document.createElement("div");
    note.className = "note note-" + selectedNote;
    note.style.bottom = snappedY + "px";
    note.style.left = (laneIndex * laneWidth) + "px";
    note.style.width = laneWidth + "px";

    // 나중에 저장/불러오기할 때 쓸 데이터
    note.dataset.note = selectedNote;
    note.dataset.time = snappedY / timeHeight;
    note.dataset.lane = laneIndex;

    editor.appendChild(note);

});

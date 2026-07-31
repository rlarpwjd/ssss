const editor =
document.getElementById("editor");
const playLine =
document.getElementById("play-line");

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

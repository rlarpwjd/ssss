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

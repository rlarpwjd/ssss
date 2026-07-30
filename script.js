const editor = document.getElementById("editor");

for(let i = 0; i < 20; i++){
    const lane = document.createElement("div");
    lane.className = "lane";
    editor.appendChild(lane);
}

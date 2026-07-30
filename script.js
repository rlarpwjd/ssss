const timeline=document.getElementById("timeline");
const canvas=document.getElementById("preview");
const ctx=canvas.getContext("2d");

const audio=new Audio();

let notes=[];

for(let i=0;i<20;i++){

    let lane=document.createElement("div");

    lane.className="lane";

    lane.dataset.lane=i;

    lane.onclick=(e)=>{

        let rect=lane.getBoundingClientRect();

        let y=e.clientY-rect.top;

        let percent=y/rect.height;

        let time=audio.duration*percent;

        notes.push({

            lane:i,

            time:time

        });

        drawEditor();

    };

    timeline.appendChild(lane);

}

music.onchange=(e)=>{

    audio.src=URL.createObjectURL(e.target.files[0]);

};

play.onclick=()=>audio.play();

pause.onclick=()=>audio.pause();

clear.onclick=()=>{

    notes=[];

    drawEditor();

};

audio.ontimeupdate=()=>{

    time.innerText=audio.currentTime.toFixed(3);

    drawPreview();

};

function drawEditor(){

    document.querySelectorAll(".note").forEach(n=>n.remove());

    document.querySelectorAll(".lane").forEach((lane,index)=>{

        notes.filter(n=>n.lane==index).forEach(n=>{

            let div=document.createElement("div");

            div.className="note";

            let p=n.time/audio.duration;

            div.style.top=(p*600-4)+"px";

            lane.appendChild(div);

        });

    });

}

function drawPreview(){

    ctx.clearRect(0,0,1000,500);

    let laneWidth=1000/20;

    for(let i=0;i<20;i++){

        ctx.strokeStyle="#555";

        ctx.beginPath();

        ctx.moveTo(i*laneWidth,0);

        ctx.lineTo(i*laneWidth,500);

        ctx.stroke();

    }

    notes.forEach(n=>{

        let diff=n.time-audio.currentTime;

        let y=400-diff*200;

        if(y<0||y>500)return;

        ctx.fillStyle="cyan";

        ctx.fillRect(

            n.lane*laneWidth+2,

            y,

            laneWidth-4,

            8

        );

    });

}

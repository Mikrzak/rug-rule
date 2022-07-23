var c = document.getElementById("myCanvas");
var ctx = c.getContext('2d');

var amount = 300;
amount += 2;
size = c.width/(amount-2);

var display;
var mainloop;

arr = [];
copyarr = [];
for(var i = 0; i < amount; i++){
    arr.push([]);
    copyarr.push([]);
}

function Display(){
    ctx.clearRect(0,0,c.width,c.height);
    for(var i = 1; i < amount - 1; i++){
        for(var j = 1; j < amount - 1; j++){
            ctx.beginPath();
            ctx.fillStyle = "rgb(" + arr[i][j][0] + "," + arr[i][j][1] + "," + arr[i][j][2] + ")";
            //ctx.strokeStyle = 'black';
            ctx.fillRect(i*size - size, j*size - size, size, size);
            //ctx.rect(i*size - size, j*size - size, size, size);
            ctx.fill();
            ctx.stroke();
        }
    }

}

function Avg(i, j, index){
    // if(i == 0 && j == 0){
    //     //return 0;
    //     return (arr[1][0][index] + arr[1][1][index] + arr[0][1][index]) / 3;
    // }
    // if(i == arr.size - 1 && j == 0){
    //     //return 0;
    //     return (arr[arr.size - 2][0][index] + arr[arr.size - 2][1][index] + arr[arr.size - 1][1][index]) / 3;
    // }
    // if(i == 0 && j == arr.size - 1){
    //     //return 0;
    //     return (arr[0][arr.size - 2][index] + arr[1][arr.size - 2][index] + arr[1][arr.size - 1][index]) / 3;
    // }
    // if(i == arr.size - 1 && j == arr.size - 1){
    //     //return 0;
    //     return (arr[arr.size - 1][arr.size - 2][index] + arr[arr.size - 2][arr.size - 1][index] + arr[arr.size - 2][arr.size - 2][index]) / 3;
    // }
    // if(i == 0){
    //     //return 0;
    //     return (arr[i+1][j][index] + arr[i][j+1][index] + arr[i][j-1][index] + arr[i+1][j+1][index] + arr[i+1][j-1][index]) / 5;
    // }
    // if(i == arr.size - 1){
    //     //return 0;
    //     return (arr[i-1][j][index] + arr[i][j+1][index] + arr[i][j-1][index] + arr[i-1][j+1][index] + arr[i-1][j-1][index]) / 5;
    // }
    // if(j == 0){
    //     //return 0;
    //     return (arr[i+1][j][index] + arr[i-1][j][index] + arr[i-1][j+1][index] + arr[i+1][j+1][index] + arr[i][j+1][index]) / 5;
    // }
    // if(j == arr.size - 1){
    //     //return 0;
    //     return (arr[i+1][j][index] + arr[i-1][j][index] + arr[i-1][j-1][index] + arr[i+1][j-1][index] + arr[i][j-1][index]) / 5;
    // }
    //if(i > 0 && j > 0 && i < arr.size - 1 && j < arr.size - 1)
        return (arr[i+1][j][index] + arr[i][j+1][index] + arr[i-1][j][index] + arr[i][j-1][index] + arr[i+1][j+1][index] + arr[i-1][j-1][index] + arr[i+1][j-1][index] + arr[i-1][j+1][index]) / 8;
    //return 0;
}

function MakeNewarr(){

    for(let i = 1; i < amount - 1; i++){
        for(let j = 1; j < amount - 1; j++){
            copyarr[i][j][0] = Avg(i,j,0);
            copyarr[i][j][1] = Avg(i,j,1);
            copyarr[i][j][2] = Avg(i,j,2);
        }
    }

}

function MainLoop(){
    
    MakeNewarr();
    for(let i = 0; i < amount; i++){
        for(let j = 0; j < amount; j++){
            arr[i][j][0] = copyarr[i][j][0];
            arr[i][j][1] = copyarr[i][j][1];
            arr[i][j][2] = copyarr[i][j][2];
        }
    }
    Display();
}

function DrawCircle(event) {
    ctx.clearRect(0,0,c.width,c.height);
    ctx.beginPath();
    //ctx.fillStyle = "rgb(" + arr[i][j][0] + "," + arr[i][j][1] + "," + arr[i][j][2] + ")";
    ctx.arc(event.clientX , event.clientY, 15, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
}

function ChangeCellOnClick(event){
    if(!mousedown)
        return;
    i = Math.ceil(event.clientX/(size));
    j = Math.ceil(event.clientY/(size));

    for(var x = -1; x <= 1; x++){
        for(var y = -1; y <= 1; y++){
            arr[i+x][j+y][0] = parseFloat(document.getElementById("R").value);
            arr[i+x][j+y][1] = parseFloat(document.getElementById("G").value);
            arr[i+x][j+y][2] = parseFloat(document.getElementById("B").value);
        }
    }
    
}

function FillArray(random = false){

    for(let i = 0; i < amount; i++){
        for(let j = 0; j < amount; j++){
            if(random)
                var cell = [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)];
            else
            var cell = [255,255,255];
            arr[i][j] = cell;
            copyarr[i][j] = cell;
        }
    }
    
}

var mousedown = false;

function SetMouseDown(){
    mousedown = true;
}

function SetMouseUp(){
    mousedown = false;
}


function StartSim(){
    mainloop = setInterval(MainLoop,50);
}

function StopSim(){
    clearInterval(mainloop);
}

function SetSize(){
    amount = parseFloat(document.getElementById("len").value) + 2;
    size = c.width/(amount-2);
    Display();
}

//console.log(arr);
// Display();
// MakeNewarr();
// console.log(arr);
// //Display();
// //MakeNewarr();
window.onload = function() {
    document.getElementById("len").value = "100";
    SetSize();
};

FillArray(true);
Display();
display = setInterval(Display);
document.addEventListener("mousedown",SetMouseDown);
document.addEventListener("mouseup",SetMouseUp);
document.getElementById("body").addEventListener("mousemove",ChangeCellOnClick);


//setInterval(MainLoop);


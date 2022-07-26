var c = document.getElementById("myCanvas");
var ctx = c.getContext('2d');

var amount = 300;
size = c.width/(amount-2);

var display;
var mainloop;
var playButton;
var stopButton;
var imgCanvas, imgContext, uploadedFile, lightnessSlider, delay;

arr = [];
copyarr = [];
for(var i = 0; i < amount; i++){
    arr.push([]);
    copyarr.push([]);
}

function Display(colorMode = "rgb"){

    ctx.clearRect(0,0,c.width,c.height);
    for(var i = 0; i < amount; i++){
        for(var j = 0; j < amount; j++){
            ctx.beginPath();
            if(colorMode == "rgb")
                ctx.fillStyle = "rgb(" + arr[i][j][0] + "," + arr[i][j][1] + "," + arr[i][j][2] + ")";
            else if(colorMode == "hue")
                ctx.fillStyle = "hsl(" + arr[i][j][3] + ",100%," + lightnessSlider.value + "%)";
            else if(colorMode == "hs"){
                ctx.fillStyle = "hsl(" + arr[i][j][3] + "," + String(arr[i][j][4]) + "%," + lightnessSlider.value + "%)";
            }
            else if(colorMode == "hsv"){
                ctx.fillStyle = "hsl(" + arr[i][j][3] + "," + String(arr[i][j][4]) + "%" + "," + String(arr[i][j][5]) + "%)";
            }
            //ctx.strokeStyle = 'black';
            ctx.fillRect(i*size, j*size, size, size);
            //ctx.rect(i*size - size, j*size - size, size, size);
            ctx.fill();
            ctx.stroke();
        }
    }

}

function Avg(i, j, index, add = document.getElementById("addOne").checked){
    if(add == true)
        add = 1;
    else
        add = 0;
    if(i == 0 && j == 0){
        //return 0;
        return (arr[1][0][index] + arr[1][1][index] + arr[0][1][index]) / 3 + add;
    }
    if(i == amount - 1 && j == 0){
        //return 0;
        return (arr[amount - 2][0][index] + arr[amount - 2][1][index] + arr[amount - 1][1][index]) / 3 + add;
    }
    if(i == 0 && j == amount - 1){
        //return 0;
        return (arr[0][amount - 2][index] + arr[1][amount - 2][index] + arr[1][amount - 1][index]) / 3 + add;
    }
    if(i == amount - 1 && j == amount - 1){
        //return 0;
        return (arr[amount - 1][amount - 2][index] + arr[amount - 2][amount - 1][index] + arr[amount - 2][amount - 2][index]) / 3 + add;
    }

    if(i == 0){
        //return 0;
        return (arr[i+1][j][index] + arr[i][j+1][index] + arr[i][j-1][index] + arr[i+1][j+1][index] + arr[i+1][j-1][index]) / 5 + add;
    }
    if(i == amount - 1){
        //return 0;
        return (arr[i-1][j][index] + arr[i][j+1][index] + arr[i][j-1][index] + arr[i-1][j+1][index] + arr[i-1][j-1][index]) / 5 + add;
    }
    if(j == 0){
        //return 0;
        return (arr[i+1][j][index] + arr[i-1][j][index] + arr[i-1][j+1][index] + arr[i+1][j+1][index] + arr[i][j+1][index]) / 5 + add;
    }
    if(j == amount - 1){
        //return 0;
        return (arr[i+1][j][index] + arr[i-1][j][index] + arr[i-1][j-1][index] + arr[i+1][j-1][index] + arr[i][j-1][index]) / 5 + add;
    }
    
    if(i > 0 && j > 0 && i < amount - 1 && j < amount - 1)
        return (arr[i+1][j][index] + arr[i][j+1][index] + arr[i-1][j][index] + arr[i][j-1][index] + arr[i+1][j+1][index] + arr[i-1][j-1][index] + arr[i+1][j-1][index] + arr[i-1][j+1][index]) / 8 + add;
}

function MakeNewarr(){

    for(let i = 0; i < amount; i++){
        for(let j = 0; j < amount; j++){
            copyarr[i][j][0] = Avg(i,j,0);
            copyarr[i][j][1] = Avg(i,j,1);
            copyarr[i][j][2] = Avg(i,j,2);
            copyarr[i][j][3] = Avg(i,j,3);
            copyarr[i][j][4] = Avg(i,j,4);
            copyarr[i][j][5] = Avg(i,j,5);
        }
    }

}

function SetCopyToArr(){
    for(let i = 0; i < amount; i++){
        for(let j = 0; j < amount; j++){
            arr[i][j][0] = copyarr[i][j][0];
            arr[i][j][1] = copyarr[i][j][1];
            arr[i][j][2] = copyarr[i][j][2];
            arr[i][j][3] = copyarr[i][j][3];
            arr[i][j][4] = copyarr[i][j][4];
            arr[i][j][5] = copyarr[i][j][5];
        }
    }
}

function MainLoop(){
    
    MakeNewarr();
    SetCopyToArr();
    Display(document.getElementById("colorModeSelect").value);
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
    var r,g,b,hueval;
    if(!mousedown)
        return;
    i = Math.ceil(event.clientX/(size));
    j = Math.ceil(event.clientY/(size));

    brushSize = parseInt(document.getElementById("brushSize").value - 3);

    for(var x = -2 - Math.floor(brushSize/2); x <= 0 + Math.floor(brushSize/2); x++){
        for(var y = -2 - Math.floor(brushSize/2); y <= 0 + Math.floor(brushSize/2); y++){
            if(i+x >= 0 && i+x < amount && j+y >= 0 && j+y < amount){
                    const color = document.getElementById("colorInput").value;
                    r = parseInt(color.substr(1,2), 16);
                    g = parseInt(color.substr(3,2), 16);
                    b = parseInt(color.substr(5,2), 16);
                    arr[i+x][j+y][0] = r
                    arr[i+x][j+y][1] = g
                    arr[i+x][j+y][2] = b
                    arr[i+x][j+y][3] = CalculateHueVal(r,g,b);
                    arr[i+x][j+y][4] = CalculateSaturationVal(r,g,b);
                    arr[i+x][j+y][5] = CalculateLightnessVal(r,g,b);
            }
        }
    }

    Display(document.getElementById("colorModeSelect").value);
    
}

function FillArray(random = false){

    for(let i = 0; i < amount; i++){
        for(let j = 0; j < amount; j++){
                if(random)
                    var cell = [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 361), Math.floor(Math.random() * 101), Math.floor(Math.random() * 51)];
                else
                    var cell = [255,255,255,360,100,50];
                arr[i][j] = cell;
                copyarr[i][j] = cell;
        }
    }

    Display(document.getElementById("colorModeSelect").value);
    
}

var mousedown = false;

function SetMouseDown(){
    mousedown = true;
}

function SetMouseUp(){
    mousedown = false;
}


function StartSim(){
    playButton.style.backgroundColor = "#00FF00";
    stopButton.style.backgroundColor = "beige";
    mainloop = setInterval(MainLoop,delay);
    //setInterval(display);
}

function StopSim(){
    playButton.style.backgroundColor = "beige";
    stopButton.style.backgroundColor = "#00FF00";
    clearInterval(mainloop);
    //clearInterval(display);
}

function SetSize(){
    amount = parseFloat(document.getElementById("len").value);
    size = c.width/(amount);
    Display(document.getElementById("colorModeSelect").value);
}

// var loadFile = function(event) {
// 	var image = document.getElementById('output');
// 	image.src = URL.createObjectURL(event.target.files[0]);
//     var canvas = document.getElementById('imgCanvas');
//     canvas.width = image.width;
//     canvas.height = image.height;
//     var context = canvas.getContext('2d'); 
//     image.onload = function(){
//         context.drawImage(image, 0, 0);
//         data_ = context.getImageData(0,0,image.width,image.height).data;
//         console.log(data_);
//     };
// };

function initImageLoader(){
    uploadedFile.addEventListener("change", HandleManualUploadedFiles)
    
    function HandleManualUploadedFiles(ev){
        var file = ev.target.files[0];
        HandleFile(file);
    }
}

function HandleFile(file){
    var imageType = /image.*/;
    
    if(file.type.match(imageType)){
        var reader = new FileReader();

        reader.onloadend = function(event){
            var tempImageStore = new Image();

            tempImageStore.onload = function(ev){
                imgCanvas.height = ev.target.height;
                imgCanvas.width = ev.target.width;
                imgContext.drawImage(ev.target,0,0);
                if(ev.target.height < ev.target.width)
                    imgData = imgContext.getImageData(0, 0, ev.target.height, ev.target.height).data;
                else
                    imgData = imgContext.getImageData(0, 0, ev.target.width, ev.target.width).data;
                FillArrayWithImageData(imgData, ev.target.height)
            }

            tempImageStore.src = event.target.result;
        }

        reader.readAsDataURL(file);
    }
}

function FillArrayWithImageData(imgData, height){

    var index = 0, counter;

    var ratio = amount / Math.sqrt(imgData.length / 4);
    //console.log(ratio, imgData.length);
    counter = ratio;

    for(let i = 0; i < amount; i += ratio){
        for(let j = 0; j < amount; j += ratio){
            DrawPixel(Math.floor(i), Math.floor(j), ratio, imgData[index*4], imgData[index*4 + 1], imgData[index*4 + 2]);
            index++;
        }
    }

    //idk ą

    // for(let i = 0; i < amount; i++){
    //     for(let j = 0; j < amount; j++){
    //         CalculateHue(i,j);
    //     }
    // }

    Display(document.getElementById("colorModeSelect").value);
}

function DrawPixel(i,j,ratio,r,g,b){
    for(let x = i; x < i + ratio; x++){
        for(let y = j; y < j + ratio; y++){
            arr[y][x] = [r, g, b, CalculateHueVal(r,g,b), CalculateSaturationVal(r,g,b), CalculateLightnessVal(r,g,b)];
        }
    }
}

function CalculateHueVal(r,g,b){
    var R, G, B, min, max;
    var hue = 0;
    var errorVal = 240;
    R = r / 255;
    G = g / 255;
    B = b / 255;
    min = Math.min(R,G,B);
    max = Math.max(R,G,B);
    if(max == R){
            hue = 60 * ((G-B)/(max-min) % 6);
            if(isNaN(hue))
                return errorVal;
            return hue;
    }
    else if(max == G){
            hue = 60 * (2 + (B-R)/(max-min));
            if(isNaN(hue))
                return errorVal;
            return hue;   
    }
    else if(max == B){
            hue = 60 * (4 + (R-G)/(max-min));
            if(isNaN(hue))
                return errorVal;
            return hue;
    }
}

function CalculateSaturationVal(r,g,b){
    var sat;
    R = r / 255;
    G = g / 255;
    B = b / 255;
    max = Math.max(R,G,B);
    min = Math.min(R,G,B);
    if(max == 0)
        sat = 0;
    else
        sat = ((max - min) / max) * 100;
    return sat;
}

function CalculateLightnessVal(r,g,b){
    R = r / 255;
    G = g / 255;
    B = b / 255;
    return Math.max(R,G,B) * lightnessSlider.value;
}

// function CalculateHue(i,j){
//     var R, G, B, min, max, hue;
//     R = arr[i][j][0] / 255;
//     G = arr[i][j][1] / 255;
//     B = arr[i][j][2] / 255;
//     min = Math.min(Math.min(R,G), Math.min(G,B), Math.min(R,B));
//     max = Math.max(Math.max(R,G), Math.max(G,B), Math.max(R,B));
//     if(max == R){
//         hue = (G-B)/(max-min);
//         hue *= 60;
//         if(hue < 0)
//             hue += 360;
//         arr[i][j][3] = hue;   
//     }
//     else if(max == G){
//         hue = 2 + (B-R)/(max-min);
//         hue *= 60;
//         if(hue < 0)
//             hue += 360;
//         arr[i][j][3] = hue;   
//     }
//     else if(max == B){
//         hue = 4 + (R-G)/(max-min);
//         hue *= 60;
//         if(hue < 0)
//             hue += 360;
//         arr[i][j][3] = hue;   
//     }
// }

function UpdateDelay(){
    delay = document.getElementById("delaySlider").value;
}

function ChangeColorMode(){
    colorMode = document.getElementById("colorModeSelect").value;
    if(colorMode == "rgb"){
        clearInterval(display);
        display = setInterval(Display("rgb"),delay);
    }
    else if(colorMode == "hue"){
        clearInterval(display);
        display = setInterval(Display("hue"),delay);
    }
    else if(colorMode == "hs"){
        clearInterval(display);
        display = setInterval(Display("hs"), delay);
    }
    else if(colorMode == "hsv"){
        clearInterval(display);
        display = setInterval(Display("hsv"),delay);
    }
}

//console.log(arr);
// Display();
// MakeNewarr();
// console.log(arr);
// //Display();
// //MakeNewarr();
window.onload = function() {
    lightnessSlider = document.getElementById("lightnessSlider");
    delay = document.getElementById("delaySlider").value;

    FillArray(true);
    document.getElementById("len").value = 100;
    document.getElementById("brushSize").value = 5;

    playButton = document.getElementById("play");
    stopButton = document.getElementById("stop");

    imgCanvas = document.getElementById("imgCanvas");
    imgContext = imgCanvas.getContext('2d');
    uploadedFile = document.getElementById("imageInput");

    //display = setInterval(Display(document.getElementById("colorModeSelect").value));
    setInterval(ChangeColorMode());
    setInterval(UpdateDelay);

    for(let i = 0; i < amount; i++){
        for(let j = 0; j < amount; j++){
            arr[i][j][3] = CalculateHueVal(arr[i][j][0], arr[i][j][1],arr[i][j][2]);
            arr[i][j][4] = CalculateSaturationVal(arr[i][j][0], arr[i][j][1],arr[i][j][2]);
            arr[i][j][5] = CalculateLightnessVal(arr[i][j][0], arr[i][j][1],arr[i][j][2]);
            //console.log(arr[i][j][4])
        }
    }
    SetSize();
    initImageLoader();
};

//Display(document.getElementById("colorInput").value);
document.addEventListener("mousedown",SetMouseDown);
document.addEventListener("mouseup",SetMouseUp);
document.addEventListener("touchstart",SetMouseDown);
document.addEventListener("touchend",SetMouseUp);
document.getElementById("body").addEventListener("mousemove",ChangeCellOnClick);

//setInterval(MainLoop);

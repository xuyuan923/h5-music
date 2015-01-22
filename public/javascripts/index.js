/**
 * Created by cassie on 15/1/21.
 */
function $(s){
    return document.querySelectorAll(s);
}

var list = $('#list li');
for(var i = 0; i < list.length; i++){
    list[i].onclick = function(){
        for(var j = 0; j < list.length; j++){
            list[j].className = "";
        }
        this.className = "selected";
        load("/media/"+this.title);
    }
}

var xhr = new XMLHttpRequest();
var ac = new (window.AudioContext||window.webkitAudioContext)();
var gainNode = ac[ac.createGain?"createGain":"createGainNode"]();
gainNode.connect(ac.destination);

var source = null;
var count = 0;
function load(url){
    var n = ++count;
    //当前一首歌停止播放后一首歌
    source && source[source.stop?"stop":"noteOff"]();
    xhr.abort();
    xhr.open("GET",url);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function(){
        if(n != count) return;
        ac.decodeAudioData(xhr.response,function(buffer){
            if(n != count) return;
            var bufferSource = ac.createBufferSource();
            bufferSource.buffer = buffer;
            bufferSource.connect(gainNode);
            bufferSource.connect(ac.destination);
            bufferSource[bufferSource.start?"start":"noteOn"](0);
            source = bufferSource;
        },function(err){
            console.log(err);
        })
    }
    xhr.send();
}

function changeVolume(percent){
    gainNode.gain.value = percent * percent;
}

$('#volume')[0].onchange = function(){
    console.log('change');
    changeVolume(this.value/this.max);
};

//$('#volume')[0].onchange();
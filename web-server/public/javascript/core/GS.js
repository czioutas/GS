var globaltest = null;
$(function () {
  var socket;
  var socket_connect = function (usr) {
      return io(window.location.host, {
          query: 'username='+usr
      });
  }

  socket = socket_connect(window.location.pathname.replace('/',''));
  Run(socket);
  RecordEngine(socket);

  function Run(socket) {
    started = false;

    socket.on('connect',function(){
      setTimeout(function() {socket.emit('test', 'test'); console.log('request for test send.'); },3000);
    });

    socket.on('heartbeat', function(obj){
      document.getElementById('heartbeat-img').src='data:image/png;base64,'+obj.buffer;
    });

    socket.on('namespace-creation-success',function(data) {
      console.log(data);
    });

    socket.on('audio-blod-receive',function(data) {
      //$('#heartbeat-img').toggle();
      playAudio(data);
    });
  }

  function playAudio(buffer)
  {
    var audioCtx;
    var started = false;
    if(!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    source = audioCtx.createBufferSource();
    audioBuffer = audioCtx.createBuffer( 1, 2048, audioCtx.sampleRate );
    audioBuffer.getChannelData( 0 ).set( buffer );
    source.buffer = audioBuffer;
    source.connect( audioCtx.destination );
    source.start(0);
    console.log(buffer);
  }

  function RecordEngine(socket) {
    var recording = false;
    var initialized = false;
    var play = true;
    var stop = false;
    var errorCallback = function(e) {
      console.log(e.name);
    };

    navigator.getUserMedia  = navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia ||
                            navigator.msGetUserMedia;

    $('#Btn').click(function (){
      if(!initialized){
        navigator.getUserMedia({audio: true,video: false}, initializeRecorder, errorCallback);
        console.log('playing');
      }
      else if(play)
      {
        audioCtx.resume();
        recording = true;
        play = false;
        stop = true;
        console.log('playing');
      }
      else if(stop){
        audioCtx.suspend();
        recording = false;
        play = true;
        stop = false;
        console.log('stopped');
      }
    });

    function initializeRecorder(stream) {
      var bufferSize = 2048;
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      var source = audioCtx.createMediaStreamSource(stream);

      var recorder = audioCtx.createScriptProcessor(bufferSize, 1, 1);
      recorder.onaudioprocess = recorderProcess;
      source.connect(recorder);
      recorder.connect(audioCtx.destination);
      recording = true;
      initialized = true;
      play = false;
      stop = true;
    }
  }

  function recorderProcess(e) {
    var left = e.inputBuffer.getChannelData(0);
    socket.emit('audio-blod-send', left);
    //socket.emit('audio-blod-send', convertFloat32ToInt16(left));
  }

  function convertFloat32ToInt16(buffer) {
    l = buffer.length;
    buf = new Int16Array(l);
    while (l--) {
      buf[l] = Math.min(1, buffer[l])*0x7FFF;
    }
    return buf.buffer;
  }


  jQuery.fn.extend({
      disable: function(state) {
          return this.each(function() {
              var $this = $(this);
              if($this.is('input, button'))
                this.disabled = state;
              else
                $this.toggleClass('disabled', state);
          });
      }
  });
});

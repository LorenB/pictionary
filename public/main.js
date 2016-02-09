var pictionary = function() {
    var socket = io();
    var canvas, context;
    var playerRole = 'guesser';
    $("#player-role span").text(playerRole);

    var draw = function(position) {
        context.beginPath();
        context.arc(position.x, position.y,
                         6, 0, 2 * Math.PI);
        context.fill();
    };

    canvas = $('canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;
    canvas.on('mousemove', function(event) {
        var offset = canvas.offset();
        var position = {x: event.pageX - offset.left,
                        y: event.pageY - offset.top};
        draw(position);
        socket.emit('draw', position);
    });
    socket.on('draw', function(msg){
      draw(msg);
    });
    
    var guessBox, guess;
    var onKeyDown = function (event) {
        if (event.keyCode != 13) { // Enter
            return;
        }
        guess = guessBox.val();
        
        // console.log(guess);
        guessBox.val('');
        socket.emit('guess', guess);
    };
    guessBox = $('#guess input');
    guessBox.on('keydown', onKeyDown);
    socket.on('guess', function(msg){
        // console.log('Handling guess');
        // console.log(msg);
        $("#playerguess span").text(msg);
    });
    
    var becomeDrawerBtn = $('#become-drawer');
    becomeDrawerBtn.on('click', function(event) {
       console.log("you want to be the drawer") ;
       playerRole = 'drawer';
       $("#become-drawer").text('');
       $("#player-role span").text(playerRole);
       socket.emit('newDrawer', 'yes');
    });
    socket.on('newDrawer', function(msg){
        // console.log(msg);
        console.log("A user has become the drawer");
        playerRole = 'guesser';
        $("#player-role span").text(playerRole);
        $("#become-drawer").text('Become Drawer');
        
    });    
    
};



$(document).ready(function() {
    pictionary();
    
});
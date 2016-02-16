var socket = io();

function Pictionary() {
    this.playerRole = 'guesser';
}

Pictionary.prototype.draw = function(position, context) {
    context.beginPath();
    context.arc(position.x, position.y,
        6, 0, 2 * Math.PI);
    context.fill();
};

Pictionary.prototype.activateCanvas = function() {
    // Question: Is this the best syntax    
    var self = this;
    var canvas, context;
    canvas = $('canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;

    // var draw = this.draw;
    // var playerRole = this.playerRole;
    canvas.on('mousemove', function(event) {
        var offset = canvas.offset();
        var position = {
            x: event.pageX - offset.left,
            y: event.pageY - offset.top
        };
        if(self.playerRole == 'drawer'){
            self.draw(position, context);
            socket.emit('draw', position);            
        }

    });
    socket.on('draw', function(msg) {
        self.draw(msg, context);
    });
}

Pictionary.prototype.activateGuessButton = function () {
    var guessBox = $('#guess input');
    var guess;
    
    guessBox.on('keydown', function (event) {
        if (event.keyCode != 13) { // Enter
            return;
        }
        guess = guessBox.val();

        console.log("your guess: ", guess);
        guessBox.val('');
        socket.emit('guess', guess);        
    });
    
    socket.on('guess', function(msg) {
        console.log('Handling guess');
        console.log(msg);
        $("#playerguess span").text(msg);
    });
}

Pictionary.prototype.activateBecomeDrawerButton = function () {
    var self = this;
    var becomeDrawerBtn = $('#become-drawer');
    becomeDrawerBtn.on('click', function(event) {
        console.log("pictionary.playerRole was", self.playerRole);
        console.log("you want to be the drawer");
        self.playerRole = 'drawer';
        // console.log(this);
        console.log("pictionary.playerRole is", self.playerRole);
        $("#become-drawer").text('');
        $("#player-role span").text(this.playerRole);
        socket.emit('newDrawer', 'yes');
    });
 
    socket.on('newDrawer', function(msg) {
        // console.log(msg);
        console.log("A user has become the drawer");
        self.playerRole = 'guesser';
        $("#player-role span").text(this.playerRole);
        $("#become-drawer").text('Become Drawer');
    });    
}

// var pictionary = function() {
    // var socket = io();
    // var canvas, context;

    // var playerRole = 'guesser';
    // $("#player-role span").text(playerRole);

    // var draw = function(position) {
    //     context.beginPath();
    //     context.arc(position.x, position.y,
    //         6, 0, 2 * Math.PI);
    //     context.fill();
    // };

    // canvas = $('canvas');
    // context = canvas[0].getContext('2d');
    // canvas[0].width = canvas[0].offsetWidth;
    // canvas[0].height = canvas[0].offsetHeight;
    // canvas.on('mousemove', function(event) {
    //     var offset = canvas.offset();
    //     var position = {
    //         x: event.pageX - offset.left,
    //         y: event.pageY - offset.top
    //     };
    //     draw(position);
    //     socket.emit('draw', position);
    // });
    // socket.on('draw', function(msg) {
    //     draw(msg);
    // });

    // var guessBox, guess;
    // var onKeyDown = function(event) {
    //     if (event.keyCode != 13) { // Enter
    //         return;
    //     }
    //     guess = guessBox.val();

    //     // console.log(guess);
    //     guessBox.val('');
    //     socket.emit('guess', guess);
    // };
    // guessBox = $('#guess input');
    // guessBox.on('keydown', onKeyDown);
    // socket.on('guess', function(msg) {
    //     // console.log('Handling guess');
    //     // console.log(msg);
    //     $("#playerguess span").text(msg);
    // });

    // var becomeDrawerBtn = $('#become-drawer');
    // becomeDrawerBtn.on('click', function(event) {
    //     console.log("you want to be the drawer");
    //     playerRole = 'drawer';
    //     $("#become-drawer").text('');
    //     $("#player-role span").text(playerRole);
    //     socket.emit('newDrawer', 'yes');
    // });
    // socket.on('newDrawer', function(msg) {
    //     // console.log(msg);
    //     console.log("A user has become the drawer");
    //     playerRole = 'guesser';
    //     $("#player-role span").text(playerRole);
    //     $("#become-drawer").text('Become Drawer');

    // });
// };



$(document).ready(function() {
    var pictionary = new Pictionary();
    pictionary.activateCanvas();
    pictionary.activateGuessButton();
    pictionary.activateBecomeDrawerButton();
    
    // pictionary();

});
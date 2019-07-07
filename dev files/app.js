//DOM is a structured representation of an HTML document, used to connect webpages to Javascript
//javascript scope: unless you're in a function, the scope is GLOBAL. Functions have access to variables in GLOBAL scope, but GLOBAL scope does not have access to function variables.
/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score, i.e. score in current round.
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/
var scores, roundScore, activePlayer, dice;

scores = [0, 0];
roundScore = 0;
//0 is first player, 1 is second player. this number toggles.
activePlayer = 0;

//Math.random() returns a decimal between 0 and 1; floor truncates.
// ======> dice = Math.floor(Math.random()*6) + 1;

/*the object that gives us access to the DOM is called the document object
- there are methods to select elements from webpage.
- we want to select the text on line 19 of index.html, to replace current score with another number. To do that, we put the _id_ of that text into querySelector. 
- id selection is done with a hashtag symbol.
textContent interprets as plain text, replaces literally with dice.
the random dice score from above will appear and replace player activePlayer's 'current' score, on every refresh with a newly generated random value.
- querySelector changes values and elements of webpage by an index.
*/
//=> document.querySelector('#current-' + activePlayer).textContent = dice; 


/*//everytime we write HTML in our code, it needs to be a string.
//innerHTML interprets <em> dice </em> as italicizied dice value, not gonna literally put <em> dice </em> as current score.

=> document.querySelector('#current-' + activePlayer).innerHTML = '<em>' + dice + '</em>';
*/

//var x = document.querySelector('#score-0').textContent; i.e. reading a value. this puts the value attached to _id_ score-0 into variable x. 

/*CSS modification example, index.html line 36
- classes use dot selector, '.' 
*/
document.querySelector('.dice').style.display = 'none'; //hides the dice png

/* these lines modify the id associated with the score texts, on 
index.html lines 16, 19, 25, and 28. Again, use # for id, . for class.
*/
document.querySelector('#score-0').textContent = '0';
document.querySelector('#score-1').textContent =  '0';
document.querySelector('#current-0').textContent = '0';
document.querySelector('#current-1').textContent = '0';


/* What happens when someone clicks a button?
1. Need a random number
2. Display the result
3. Update the round score, only IF the rolled number was not a 1.
4. This also depends on which player it currently is, i.e. activePlayer value.
*/
//Called when btn-roll is clicked: is a CALLBACK function, because the event listener calls the function for us.
function onBtnClick() {
    //random number
    var dice = Math.floor(Math.random()*6) + 1;
    
    //display the dice with the right picture
    var diceDOM = document.querySelector('.dice'); //to save typing
    //so the dice actually displays instead of being hidden with 'none'
    diceDOM.style.display = 'block';
    //on index.html line 36, .png is an img element and src defines which image is displayed. 
    //the names of png files are conveniently chosen s.t. this dynamically suits which dice we want to show up.
    diceDOM.src = "dice-" + dice + '.png'; 
    
    if (dice > 1) {
        //add score
        roundScore += dice;
        //then display this current roundscore in GUI
        document.querySelector('#current-' + activePlayer).textContent = roundScore;
    } else {
        //hide the dice again
        document.querySelector('.dice').style.display = 'none';
        //reset current player's round score to 0
        roundScore = 0;
        //reset the current player's current score text to 0
        document.querySelector('#current-' + activePlayer).textContent = roundScore;
        //switch to the other player now.
        if (activePlayer === 0) {
            activePlayer = 1;
        }
        else {
            activePlayer = 0;
        }
        //need to show who's the active player: the bold text, the red dot, and the gray background that emphasizes active player.
        //on HTML line 14 and 23, the keyword 'active' in the class is what determines which player gets the emphasized graphics.
        //document.querySelector('.player-0-panel').classList.remove('active');
        //document.querySelector('.player-1-panel').classList.add('active');
        //alternatively there's a toggle method, to switch back and forth
        //document.querySelector('.player-0-panel').classList.toggle('active');
        document.querySelector('.player-1-panel').classList.toggle('active'); //when a bad dice roll comes up is when you flip to the other player.
        document.querySelector('.player-0-panel').classList.toggle('active');
            
        }   
    }

/*- execute hold callback function :
    - add the current roundscore into the score of that active player in the array.
    - display the new score on the website
    - as soon as hold is clicked, switch to the other player's turn: toggle activeness,         remove dice,
*/
function onBtnHold() {
    
    //update the player's global score
    scores[activePlayer] = scores[activePlayer] + roundScore;
    
    //display this on the website
    document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];
    
    //what if player has won (exceeded or equal to 100 points)?
    if (scores[activePlayer] >= 30) {
        //display them as the winner
        document.querySelector('#name-' + activePlayer).textContent = 'Winner!';
        document.querySelector('.dice').style.display = 'none';
        
        //the winner has a special class to append instead of 'active', called 'winner'.
        //a class is a group of visual properties, rather than just one manipulation at a time.
        
        document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
        document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
        //early exit from function
        return;
    } 
    //change to next player if score isnt greater than 100.
    togglePlayer();
    

}

/*index.html line 33, Roll dice needs an event listener. So when we click it, something happens.
- always select something by querySelector first, then do something with that selection.
- event type here is literally called 'click'. MDN event reference
- second argument is a function that will be called when button is clicked
- callback function: function that we pass into another function as an argument, and this function (eventListener) calls btn (callback fxn) for us
*/
document.querySelector('.btn-roll').addEventListener('click', onBtnClick);

/**********************************************************
Alternative to callback function is the anonymous function: it doesn't have a name, is specifically used only in one place.
document.querySelector('.btn-roll').addEventListener('click', function() {
    //do something here
});
**********************************************************/

/*to hold our score, the scores[] array needs to be updated when "hold" is pressed.
- when hold button is pressed...     
*/

document.querySelector('.btn-hold').addEventListener('click', onBtnHold);

document.querySelector('.btn-new').addEventListener('click', onBtnNew);


//the act of toggling the player is repetitive, both in onBtnClick and onBtnHold uses the same algorithm to change the player, so put it into a function.

function togglePlayer() {
    
    //reset current round to 0
    roundScore = 0;
    
    //visually display the current 0
    document.querySelector('#current-' + activePlayer).textContent = 0; 
    
    //change who gets the active emphasis
    document.querySelector('.player-1-panel').classList.toggle('active'); //when a bad dice roll comes up is when you flip to the other player.
    document.querySelector('.player-0-panel').classList.toggle('active');
    
    //hide dice
    document.querySelector('.dice').style.display = 'none';
    
    //toggle who the active player is
    if (activePlayer === 0) activePlayer = 1;
    else activePlayer = 0;
    
}


//this is the new game function...
function gameReset() {
    roundScore = 0;
    scores[0] = scores[1] = 0;
    document.querySelector("#current-" + 0).textContent = 0;
    document.querySelector("#current-" + 1).textContent = 0;
    document.querySelector('#score-' + 0).textContent = 0;
    document.querySelector('#score-' + 1).textContent = 0;
    
    //adding and removal of classes, where a class is a group of visual properties.
    document.querySelector('.player-' + activePlayer + '-panel').classList.remove('winner');
    document.querySelector('#name-' + activePlayer).textContent = ('PLAYER ' + (activePlayer+1)) ;
    
    document.querySelector('.player-0-panel').classList.add('active');
    
    activePlayer = 0;
    
}


function onBtnNew() {
    gameReset();
}


//testing










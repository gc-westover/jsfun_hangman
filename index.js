const readline = require('readline')
const wordBank = require('./word-bank.json')
const graphic = require('./ascii.json')

const rl = readline.createInterface(
    {
        input: process.stdin,
        output: process.stdout
    }
);

const allowedGuesses = 5
const allowedLetters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
let word, letters, guessCount, guessed
let rounds = 1
let wins = 0
let losses = 0

const round = () => {
    word = wordBank[Math.floor(Math.random()*wordBank.length)]
    letters = word.split('')
    guessCount = 0
    guessed = new Set()
    // Reset round variables
    console.log(`Welcome to Round ${rounds}! Press Ctrl + C to exit at any time.`)
    console.log(`This session, you have won ${wins===1 ? '1 time': `${wins} times`} and lost ${losses===1 ? '1 time': `${losses} times`}`)
    guess()
}

const guess = () => rl.question('Guess letter: ', (input) => {
    // Cleanup input. Strip extra characters and limit to lowercase
    let letter = input[0].toLowerCase()
    // Only allow valid letters, if not valid restart guess process
    if (!allowedLetters.includes(letter)) {
        guess()
    }

    // Check if too many guesses made, and game is over
    if (guessCount < allowedGuesses) {
        // Check if the player hasn't guessed the letter before and that the letter 
        if (!guessed.has(letter) && !letters.includes(letter)) {guessCount += 1}
        
        // Regardless, add the letter to the set of guessed letters
        guessed.add(letter)
        
        console.log('\n' + graphic[guessCount] + '\n')
        // Generate result string to display, ie. '_ e _ _', and display it
        let result = letters.map((letter) => guessed.has(letter) ? letter : '_').join(" ")
        console.log(result)

        // Instead of checking if all letters have been guessed, check if result string is in a winning state
        //  ie. 't e s t'
        if (result === letters.join(" ")) {
            console.log('You win!')
            rounds += 1
            wins += 1
            round()
            return undefined
        }
        // Display guesses remaining
        console.log(`${allowedGuesses+1-guessCount} guesses remaining...`)
        // Debug logging
        console.log(letter, guessCount, guessed, letters);
        // Recursively call guess() until out of allowed guesses
        guess()
    } else {
        // If out of guesses, display the correct word. Then update win/loss and start a new round.
        console.log(`Game over! The word was ${word}.`)
        losses += 1
        round()
    }
});

round()
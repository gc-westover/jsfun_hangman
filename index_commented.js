const readline = require('readline')
const wordBank = require('./assets/word-bank.json')
const graphic = require('./assets/ascii.json')
// Initialize interface for IO stream
const rl = readline.createInterface(
    {
        input: process.stdin,
        output: process.stdout
    }
);

// Initialize game constants
const allowedGuesses = 6
const allowedLetters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
// Declare game global game variables
let word, letters, guessCount, guessed, result
let rounds = 0
let wins = 0
let losses = 0

const round = () => {
    // Increment the round count
    rounds += 1

    // Re-assign all round variables.
    word = wordBank[Math.floor(Math.random()*wordBank.length)]
    letters = word.split('')
    guessCount = 0
    guessed = new Set()
    result = letters.map((guessedLetter) => guessed.has(guessedLetter) ? guessedLetter : '_').join(" ")

    // Display new round UI
    console.log(`\n Welcome to Round ${rounds}! Press Ctrl + C to exit at any time.`)
    console.log(`This session, you have won ${wins===1 ? '1 time': `${wins} times`} and lost ${losses===1 ? '1 time': `${losses} times`}`)
    console.log(result)
    
    // Begin new guess loop
    guess()
}

const guess = () => rl.question('\n Guess letter: ', (input) => {
    // Sanitize user input. If string exists, strip out first letter and set to lowercase. If no string, assign guest as undefined.
    let guessedLetter = input ? input[0].toLowerCase() : undefined
    // If the input isn't valid, skip to a new guess. Return undefined to end prior function call.
    if (!allowedLetters.includes(guessedLetter)) {guess(); return undefined}
    // If the guessed letter is not in the word, and the guessed letter has not been guessed before, increment the number of guesses used.
    if (!letters.includes(guessedLetter) && !guessed.has(guessedLetter)) {guessCount += 1}
    // Add the guessed character to the record of guesses.
    guessed.add(guessedLetter)
    // Display the guess count.
    console.log('\n' + graphic[guessCount] + '\n')
    
    // Check if game is lost!
    if (guessCount < allowedGuesses) {
        // If game continues, show current game state in form like "_ _ e _"
        result = letters.map((guessedLetter) => guessed.has(guessedLetter) ? guessedLetter : '_').join(" ")
        console.log(result)
        // Instead of checking if the set of guesses letters contains all of the letters in the target word
        // We check that the game state matches the intended end state, ie "t e s t" == "t e s t"
        if (result === letters.join(" ")) {
            // If it matches, you win! Tally the win, start a new round, and return undefined to end the current function call.
            console.log('You win!')
            wins += 1
            round()
            return undefined
        }

    } else {
        console.log(`Game over! The word was ${word}.`)
        losses += 1
        round()
    }
    console.log(`${allowedGuesses-guessCount} guesses remaining...`)
    guess()
});

round()
const readline = require('readline')
const wordBank = require('./word-bank.json')
const graphic = require('./ascii.json')

const rl = readline.createInterface(
    {
        input: process.stdin,
        output: process.stdout
    }
);

const allowedGuesses = 6
const allowedLetters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
let word, letters, guessCount, guessed
let rounds = 0
let wins = 0
let losses = 0

const round = () => {
    rounds += 1
    word = wordBank[Math.floor(Math.random()*wordBank.length)]
    letters = word.split('')
    guessCount = 0
    guessed = new Set()
    // Display new round text
    console.log(`\n Welcome to Round ${rounds}! Press Ctrl + C to exit at any time.`)
    console.log(`This session, you have won ${wins===1 ? '1 time': `${wins} times`} and lost ${losses===1 ? '1 time': `${losses} times`}`)

    guess()
}

const guess = () => rl.question('\n Guess letter: ', (input) => {
    let letter = input ? input[0].toLowerCase() : undefined
    if (!allowedLetters.includes(letter)) {guess(); return undefined}
    if (!letters.includes(letter) && !guessed.has(letter)) {guessCount += 1}
    guessed.add(letter)

    console.log('\n' + graphic[guessCount] + '\n')

    if (guessCount < allowedGuesses) {
        let result = letters.map((letter) => guessed.has(letter) ? letter : '_').join(" ")
        console.log(result)

        if (result === letters.join(" ")) {
            console.log('You win!')
            wins += 1
            round()
            return undefined
        }
        console.log(`${allowedGuesses-guessCount} guesses remaining...`)
        guess()
    } else {
        console.log(`Game over! The word was ${word}.`)
        losses += 1
        round()
    }
});

round()
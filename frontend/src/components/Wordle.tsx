import React, { useState } from "react";

const WORDS = ["apple", "brain", "chair", "grape", "plant"]; // Example words
const targetWord = WORDS[Math.floor(Math.random() * WORDS.length)];

const Wordle: React.FC = () => {
    const [currentGuess, setCurrentGuess] = useState<string>("");
    const [guesses, setGuesses] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<string[][]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length <= 5) {
            setCurrentGuess(e.target.value);
        }
    };

    const handleSubmit = () => {
        if (currentGuess.length !== 5) return;

        // Generate feedback
        const newFeedback: string[] = currentGuess.split("").map((char, idx) => {
            if (char === targetWord[idx]) return "green"; // Correct position
            else if (targetWord.includes(char)) return "yellow"; // Wrong position
            else return "gray"; // Not in word
        });

        setGuesses([...guesses, currentGuess]);
        setFeedback([...feedback, newFeedback]);
        setCurrentGuess("");
    };

    return (
        <div style={{ textAlign: "center" }}>
            <h2>Wordle Game</h2>
            <input
                type="text"
                value={currentGuess}
                onChange={handleInputChange}
                maxLength={5}
                placeholder="Guess a word"
            />
            <button onClick={handleSubmit}>Submit</button>

            <div>
                {guesses.map((guess, index) => (
                    <div key={index}>
                        {guess.split("").map((char, idx) => (
                            <span
                                key={idx}
                                style={{
                                    display: "inline-block",
                                    width: "20px",
                                    height: "20px",
                                    lineHeight: "20px",
                                    textAlign: "center",
                                    margin: "2px",
                                    backgroundColor: feedback[index][idx],
                                    color: "white",
                                }}
                            >
                                {char}
                            </span>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wordle;

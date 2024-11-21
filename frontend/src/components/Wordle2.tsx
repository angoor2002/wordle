import "../css/Wordle.css";
import React, { useState, useRef, useEffect } from "react";

// Example words (can be replaced with a large word list or fetched from an API)
const WORDS = ["apple", "brain", "chair", "grape", "plant"];
const targetWord = WORDS[Math.floor(Math.random() * WORDS.length)];

const Wordle: React.FC = () => {
    const [guesses, setGuesses] = useState<string[]>(Array(5).fill(""));
    const [feedback, setFeedback] = useState<string[][]>(Array(5).fill([]));
    const [currentRow, setCurrentRow] = useState<number>(0);
    const [currentCol, setCurrentCol] = useState<number>(0); // Track the active column
    // const [isFocused, setIsFocused] = useState<boolean>(true);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [invalidWord, setInvalidWord] = useState<boolean>(false); // Track if the word is valid
    const inputRefs = useRef<(HTMLDivElement | null)[][]>([]);

    useEffect(() => {
        // Automatically focus the first cell on page load
        inputRefs.current[0][0]?.focus();
        console.log(targetWord);
    }, []);

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const currentGuess = guesses[currentRow];

        if (e.key.match(/^[a-zA-Z]$/) && currentGuess.length < 5) {
            // Add letter to current guess
            const updatedGuess = currentGuess + e.key.toLowerCase();
            const updatedGuesses = [...guesses];
            updatedGuesses[currentRow] = updatedGuess;
            setGuesses(updatedGuesses);
            setCurrentCol(updatedGuess.length); // Update current column
        } else if (e.key === "Backspace" && currentGuess.length > 0) {
            // Remove last letter
            const updatedGuess = currentGuess.slice(0, -1);
            const updatedGuesses = [...guesses];
            updatedGuesses[currentRow] = updatedGuess;
            setGuesses(updatedGuesses);
            setCurrentCol(updatedGuess.length); // Update current column
            setInvalidWord(false); // Hide invalid word message when Backspace is pressed
        } else if (e.key === "Enter" && currentGuess.length === 5) {
            // Check if the word exists in the dictionary (case insensitive)
            if (!WORDS.includes(currentGuess)) {
                setInvalidWord(true); // Set invalid word flag
                return;
            } else {
                setInvalidWord(false); // Reset invalid word flag when a valid word is entered
            }

            // Generate feedback for the row
            const newFeedback = currentGuess.split("").map((char, idx) => {
                if (char === targetWord[idx]) return "green"; // Correct position
                else if (targetWord.includes(char)) return "yellow"; // Wrong position
                return "gray"; // Not in word
            });

            const updatedFeedback = [...feedback];
            updatedFeedback[currentRow] = newFeedback;
            setFeedback(updatedFeedback);

            if (currentGuess === targetWord) {
                setSuccess(true);
                setGameOver(true);
                return;
            }

            if (currentRow === 4) {
                setGameOver(true);
            } else {
                setCurrentRow(currentRow + 1); // Move to the next row
                setCurrentCol(0); // Reset column for next row
            }
        }
    };

    const handleCopyResults = () => {
        // Get current date in a readable format
        const currentDate = new Date().toLocaleString(); // You can change the format as per your needs
        const attemptCount = currentRow + 1;
    
        const result = guesses
            .map((guess, rowIndex) =>
                feedback[rowIndex]
                    .map((color) => (color === "green" ? "🟩" : color === "yellow" ? "🟨" : "⬛"))
                    .join("")
            )
            .filter((row) => row !== "")
            .join("\n");
    
        // Copy the date, attempts, and result to the clipboard
        const clipboardText = `Wordle Result: \n\nDate: ${currentDate}\nAttempts: ${attemptCount}/5\n\n${result}`;
    
        navigator.clipboard.writeText(clipboardText);
    };

    return (
        <div className="wordle-container">
            <div className="grid">
                {guesses.map((guess, rowIndex) => (
                    <div className="row" key={rowIndex}>
                        {Array(5)
                            .fill("")
                            .map((_, colIndex) => (
                                <div
                                    className={`cell ${feedback[rowIndex][colIndex] || ""} ${
                                        rowIndex === currentRow && colIndex === currentCol
                                            ? "active"
                                            : ""
                                    }`}
                                    key={colIndex}
                                    ref={(el) => {
                                        if (!inputRefs.current[rowIndex]) {
                                            inputRefs.current[rowIndex] = [];
                                        }
                                        inputRefs.current[rowIndex][colIndex] = el;
                                    }}
                                    tabIndex={0}
                                    onKeyDown={handleKeyPress}
                                >
                                    {guess[colIndex]?.toUpperCase() || ""}
                                </div>
                            ))}
                    </div>
                ))}
            </div>

            {!gameOver && (
                <div className="hidden-input-container">
                    <input
                        type="text"
                        className="hidden-input"
                        onKeyDown={handleKeyPress}
                        // autoFocus={isFocused}
                        // disabled={!isFocused}
                    />
                </div>
            )}

            {invalidWord && !gameOver && (
                <div className="invalid-word-message">
                    <p>The word doesn't exist in the dictionary.</p>
                </div>
            )}

            {gameOver && (
                <div className="game-over">
                    {success ? (
                        <div>
                            <h2>🎉 Congratulations! You guessed the word!</h2>
                            <p>Attempts: {currentRow + 1}/5</p>
                            <button onClick={handleCopyResults}>Copy Results</button>
                        </div>
                    ) : (
                        <div>
                            <h2>😢 Better luck next time! The word was "{targetWord}".</h2>
                            <p>Attempts: {currentRow + 1}/5</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Wordle;

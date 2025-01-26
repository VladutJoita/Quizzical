import { useState } from "react"

export default function Quiz({
  quiz,
  setQuiz,
  setResetQuiz,
  setStartQuiz
}) {
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [isFormNotCompleted, setIsFormNotCompleted] = useState(true)
  const [disabled, setDisabled] = useState(false) // State to disable the inputs
  const [isFormSubmitted, setIsFormSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  // Function to handle form submission
  function handleForm(e) {
    e.preventDefault() // Prevent page reload

    setDisabled(true) // Disable inputs after the "Check Answers" button is pressed
    setIsFormSubmitted(true)

    const selectedAnswersValuesArray = Object.values(selectedAnswers)
    console.log(selectedAnswersValuesArray)
    quiz.forEach(question => {
      selectedAnswersValuesArray.forEach(answer => {
        if (question.correctAnswer === answer) {
          setScore(prevScore => prevScore + 1)
        }
      })
    })

    setQuiz(prevQuiz => {
      return prevQuiz.map(question => {
        const updatedAnswers = question.allAnswers.map(answer => {
          const isCorrect = answer.answer === question.correctAnswer

          // Color answers based on their correctness
          if (isCorrect) {
            return {
              ...answer,
              color: "#94D7A2", // Green color for correct answers
            }
          } else if (!isCorrect && answer.isSelected) {
            return {
              ...answer,
              color: "#F8BCBC", // Red color for incorrect answers
              opacity: ".5", // Incorrect answers become more transparent
            }
          } else {
            return {
              ...answer,
              color: "#F5F7FB", // Default color for unselected answers
              opacity: ".5", // Transparency for unselected answers
            }
          }
        })
        return {
          ...question,
          allAnswers: updatedAnswers,
        }
      })
    })
  }

  // Function to handle answer selection
  function handleSelectedQuestion(questionIndex, answerTitle, answer) {
    if (disabled) return // If the form is already submitted, no more selection is allowed

    // Check if all answers have been selected
    const keysArray = Object.keys(selectedAnswers)
    if (keysArray.length === quiz.length) {
      setIsFormNotCompleted(false)
    }

    setSelectedAnswers(prevSelectedAnswers => {
      return {
        ...prevSelectedAnswers,
        [questionIndex]: answerTitle,
      }
    })

    // Update the quiz state to mark selected answers
    setQuiz(prevQuiz => {
      return prevQuiz.map((question, index) => {
        if (index === questionIndex) {
          const updatedAnswers = question.allAnswers.map(answerEl => {
            if (answerEl.answer_id === answer.answer_id) {
              return {
                ...answerEl,
                color: "#D6DBF5", // Color for selected answer
                isSelected: true,
              }
            }
            return {
              ...answerEl,
              color: "", // Reset color for other answers
              isSelected: false, // Reset selection state
            }
          })
          return {
            ...question,
            allAnswers: updatedAnswers,
          }
        }
        return question;
      })
    })
  }

  function resetQuiz() {
    setResetQuiz(true) // Activate quiz reset
    setScore(0)
    setIsFormNotCompleted(true)
    setIsFormSubmitted(false)
    setDisabled(false)
    setSelectedAnswers({})

    // Reset the quiz and return to the first page (StartQuiz)
    setStartQuiz(false); // This will return you to the start page
  }

  // Check if the quiz data is loaded
  if (!quiz || quiz.length === 0) {
    return <p className="loading">Loading quiz...</p>
  }

  // Generate question elements
  const questionElements = quiz.map((question, questionIndex) => {
    let answerEl = question.allAnswers.map(answer => {
      return (
        <label
          htmlFor={answer.answer_id}
          key={answer.answer_id}
          style={{ backgroundColor: answer.color, opacity: answer.opacity }}
          onClick={() => handleSelectedQuestion(questionIndex, answer.answer, answer)}
        >
          <input
            type="radio"
            id={answer.answer_id}
            aria-checked="false"
            name={`Answer${questionIndex}`}
            value={answer.answer}
            disabled={disabled} // Disable inputs after answers are checked
          />
          {answer.answer}
        </label>
      )
    })

    return (
      <div className="question-container" key={questionIndex}>
        <h2>{question.title}</h2>
        <div className="answers-container">
          {answerEl}
        </div>
        <hr />
      </div>
    )
  })

    return (
      <div className="quiz-container">
        {!quiz || quiz.length === 0 ? (
          <p className="loading">Loading quiz...</p>
        ) : (
          <form onSubmit={handleForm}>
            {questionElements}
            {!isFormSubmitted ? (
              <button className="check-answers-btn" type="submit" disabled={isFormNotCompleted}>
                Check answers
              </button>
            ) : (
              <div className="score-and-button">
                <h3 className="score-text">You scored {score}/5 correct answers</h3>
                <button 
                  className="play-again-btn" 
                  onClick={resetQuiz} 
                  type="button" 
                >
                  Play again
                </button>
              </div>
            )}
          </form>
        )}
      </div>
  )
}
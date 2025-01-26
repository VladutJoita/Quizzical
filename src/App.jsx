import React from 'react';
import { useState, useEffect, useRef } from "react"
import { decode } from "html-entities"
import { nanoid } from 'nanoid'
import StartQuiz from "../components/StartQuiz"
import Quiz from "../components/Quiz"
import blueBlob from './assets/blue-blob.png'
import yellowBlob from './assets/yellow-blob.png'

export default function App() {
  const [startQuiz, setStartQuiz] = useState(false)
  const [quiz, setQuiz] = useState([])
  const [quizOptions, setQuizOptions] = useState(null)
  const [loading, setLoading] = useState(false) // Track the loading state
  const [resetQuiz, setResetQuiz] = useState(false) // Track if the quiz is being reset
  const [error, setError] = useState("")
  console.log(error)
  const firstRender = useRef(true)

  const fetchQuizData = async () => {
    if (!quizOptions || loading) return; // Prevent fetching if already loading or no quiz options

    setLoading(true); // Set loading to true when the fetch starts

    try {
      const res = await fetch(
        `https://opentdb.com/api.php?amount=5${
          quizOptions?.category ? `&category=${quizOptions.category}` : ""
        }${
          quizOptions?.difficulty ? `&difficulty=${quizOptions.difficulty}` : ""
        }&type=multiple`
      )

      if (!res.ok) {
        if (res.status === 429) {
          throw new Error("Too many requests. Please wait a moment and try again.")
        }
        throw new Error(`API error: ${res.status}`)
      }

      const data = await res.json()

      if (!data.results || !Array.isArray(data.results)) {
        throw new Error("Invalid API response structure.")
      }

      const apiQuizData = data.results.map((question) => {
        let allAnswers = [question.correct_answer, ...question.incorrect_answers]
        allAnswers.sort(() => Math.random() - 0.5) // Shuffle answers
        allAnswers = allAnswers.map((answer) => decode(answer))

        return {
          id: nanoid(),
          title: decode(question.question),
          correctAnswer: decode(question.correct_answer),
          allAnswers: allAnswers.map((answer) => ({
            answer_id: nanoid(),
            answer,
            isSelected: false,
            color: "#F5F7FB", // Default color
          }))
        }
      })

      setQuiz(apiQuizData)
    } catch (err) {
      console.error(err)
      setError(err)
    } finally {
      setLoading(false); // Reset loading state after fetch is complete
    }
  }

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }

    // Only fetch quiz data when quizOptions are set and no fetch is in progress
    if (quizOptions && !loading) {
      fetchQuizData()
    }
  }, [quizOptions]); // Trigger effect only when quizOptions change

  const resetQuizData = () => {
    setQuiz([]); // Clear quiz data
    setResetQuiz(true); // Set reset flag to prevent further fetch calls
    setStartQuiz(false); // Return to the start screen
  }

  useEffect(() => {
    if (resetQuiz) {
      setQuizOptions(null); // Reset quiz options
      setResetQuiz(false); // Reset the reset flag
    }
  }, [resetQuiz]);

  return (
    <>
      <img className="blue-blob" src={blueBlob} alt="blue-blob" />
      <img className="yellow-blob" src={yellowBlob} alt="yellow-blob" />
      {error ? (
        <p className="error-message">{error.message || error.toString()}</p> // Ensure error is displayed as a string
      ) : !startQuiz ? (
        <StartQuiz setStartQuiz={setStartQuiz} setQuizOptions={setQuizOptions} />
      ) : (
        <Quiz
          quiz={quiz}
          setQuiz={setQuiz}
          setResetQuiz={resetQuizData}
          setStartQuiz={setStartQuiz}
        />
      )}
    </>
  )
}
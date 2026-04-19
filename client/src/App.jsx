const TEST_MODE = true;

import { useEffect, useState } from "react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

function App() {
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState([] || null);
  const [selectedAnswer, setSelectedAnswer] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const url = TEST_MODE
      ? "http://localhost:3000/test/mock"
      : "http://localhost:3000/api/quiz";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ topic: `${topic}` }),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      // .json() converts the JSON string into JavaScript Object
      const data = await response.json();

      console.log(data);

      const questionObject = data.questions.map((q) => q);
      setQuestions((prev) => [...prev, ...questionObject]);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (questionId, choiceIndex) => {
    setSelectedAnswer((prev) => ({ ...prev, [questionId]: choiceIndex }));
  };

  useEffect(() => {
    console.log("selectedAnswer updated:", selectedAnswer);
  }, [selectedAnswer]);

  // returns an array of objects with the text and math parts of the question
  const parseQuestion = (question) => {
    const parts = question.split(/\$(.*?)\$/g);

    return parts.map((part, index) =>
      index % 2 === 0
        ? { type: "text", content: part }
        : { type: "math", content: part },
    );
  };

  const handleExamSubmit = () => {
    let correctCount = 0;

    questions.forEach((q) => {
      const picked = selectedAnswer[q.id];
      if (picked === q.correctIndex) correctCount += 1;
    });
    setScore(correctCount);
    setSubmitted(true);
  };

  return (
    <>
      <section>
        <div className="text-center space-y-8">
          <h1 className="text-lg">Math worksheet generator</h1>
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-x-2">
            <label className="font-semibold">Please enter a topic:</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="topic"
              className="pl-2 border rounded border-gray-500"
            ></input>
            {loading ? (
              <button
                type="submit"
                className="bg-green-400 rounded-lg px-2 py-1 hover:scale-105 active:scale-100"
                disabled
              >
                Generating
              </button>
            ) : (
              <button
                type="submit"
                className="bg-green-500 rounded-lg px-2 py-1 hover:scale-105 active:bg-green-400"
              >
                Generate
              </button>
            )}
          </form>

          {questions.map((questionObject, index) => {
            const parts = parseQuestion(questionObject.question);
            const choices = questionObject.choices;
            // Debugging questions parsing
            // console.log("parts: ", parts);
            // console.log("choices: ", choices);
            return (
              <div
                key={index}
                className="flex flex-col justify-center h-64"
              >
                <div className="flex flex-row justify-center space-x-2">
                  {parts.map((part, j) =>
                    part.type === "math" ? (
                      <BlockMath
                        className="border"
                        math={part.content.replaceAll("$", "")}
                        key={j}
                      />
                    ) : (
                      <span className="flex items-center" key={j}>
                        {part.content}
                      </span>
                    ),
                  )}
                </div>
                <div className="flex flex-row justify-center space-x-2">
                  {choices.map((choice, k) => (
                    <button
                      type="button"
                      key={k}
                      onClick={() => handleClick(questionObject.id, k)}
                      className={`border w-1/4 h-32 mx-10 hover:scale-105 active:scale-100 ${selectedAnswer[questionObject.id] === k ? "bg-blue-400" : "bg-white"}`}
                    >
                      <BlockMath math={choice.replaceAll("$", "")} />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
          <button type="button" onClick={handleExamSubmit} className="bg-green-500 rounded-lg px-2 py-1 hover:scale-105 active:bg-green-400">
            {submitted ? `You scored ${score} out of ${questions.length}` : "SUBMIT"}
          </button>
        </div>
      </section>
    </>
  );
}

export default App;

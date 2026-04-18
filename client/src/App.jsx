import { useEffect, useState } from "react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import { InlineMath } from "react-katex";

function App() {
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const url = "http://localhost:3000/generate";
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

  const handleClick = (choice) => {
    setUserAnswer(choice);
  };


  // returns an array of objects with the text and math parts of the question
  const parseQuestion = (question) => {
    const parts = question.split(/\%(.*?)\$/g);
    

    return parts.map((part, index) => 
      index % 2 === 0 
    ? {type: "text", content: part}
    : {type: "math", content: part} )
  }

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

          {questions.length > 0 ? (
            <>
              {questions.map((questionObject, index) => {
                 const parts = parseQuestion(questionObject.question);

                 return (
                   <p>
                    {parts.map((part, j) => 
                      part.type === "math"
                      ? <BlockMath math={part.content.replaceAll("$", "")} key={j} />
                      : <span key={j}>{part.content}</span>
                    )}
                   </p>
                 )
              })}
            </>
          ) : (
            <>
              <p>Please enter a topic</p>
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default App;

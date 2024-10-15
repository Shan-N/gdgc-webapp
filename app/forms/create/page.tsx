'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateForm() {
  const [title, setTitle] = useState('')
  const [questions, setQuestions] = useState([{ text: '', type: 'text' }])
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/forms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, questions })
    })
    if (response.ok) {
      router.push('/forms')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="container mx-auto p-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Form Title"
        className="w-full p-2 mb-4 border rounded"
        required
      />
      {questions.map((question, index) => (
        <div key={index} className="mb-4">
          <input
            type="text"
            value={question.text}
            onChange={(e) => {
              const newQuestions = [...questions]
              newQuestions[index].text = e.target.value
              setQuestions(newQuestions)
            }}
            placeholder={`Question ${index + 1}`}
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <select
            value={question.type}
            onChange={(e) => {
              const newQuestions = [...questions]
              newQuestions[index].type = e.target.value
              setQuestions(newQuestions)
            }}
            className="w-full p-2 border rounded"
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="date">Date</option>
          </select>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setQuestions([...questions, { text: '', type: 'text' }])}
        className="bg-green-500 text-white p-2 rounded mr-2"
      >
        Add Question
      </button>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Create Form
      </button>
    </form>
  )
}
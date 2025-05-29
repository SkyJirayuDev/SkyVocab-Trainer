'use client'

import { useState } from 'react'
import { addWord } from './action'

export default function AddWordPage() {
  const [english, setEnglish] = useState('')
  const [thai, setThai] = useState('')
  const [definition, setDefinition] = useState('')
  const [example1, setExample1] = useState('')
  const [example2, setExample2] = useState('')
  const [partOfSpeech, setPartOfSpeech] = useState('noun')
  const [category, setCategory] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await addWord({
      english,
      thai,
      definition,
      example1,
      example2,
      partOfSpeech,
      category,
    })
    setMessage(result.message)
    setEnglish('')
    setThai('')
    setDefinition('')
    setExample1('')
    setExample2('')
    setPartOfSpeech('noun')
    setCategory('')
  }

  return (
    <div className="min-h-screen bg-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-gray-50 shadow-lg rounded-2xl p-6">
        <h1 className="text-xl font-semibold text-center mb-6">Add New Word</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">English</label>
            <input
              type="text"
              value={english}
              onChange={(e) => setEnglish(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Thai</label>
            <input
              type="text"
              value={thai}
              onChange={(e) => setThai(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Definition (English)</label>
            <input
              type="text"
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              placeholder="e.g. showing courage in the face of danger"
              className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Part of Speech</label>
            <select
              value={partOfSpeech}
              onChange={(e) => setPartOfSpeech(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="noun">Noun</option>
              <option value="verb">Verb</option>
              <option value="adjective">Adjective</option>
              <option value="adverb">Adverb</option>
              <option value="preposition">Preposition</option>
              <option value="conjunction">Conjunction</option>
              <option value="interjection">Interjection</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              placeholder="e.g. Emotion, Travel"
              className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Example Sentence 1</label>
            <input
              type="text"
              value={example1}
              onChange={(e) => setExample1(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Example Sentence 2</label>
            <input
              type="text"
              value={example2}
              onChange={(e) => setExample2(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 transition"
          >
            Add Word
          </button>
        </form>
        {message && (
          <p className="text-center text-green-600 mt-4 text-sm">{message}</p>
        )}
      </div>
    </div>
  )
}

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
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-md mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl rounded-2xl p-6 border border-gray-700">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">📚 Add New Word</h1>
          <p className="text-gray-400 text-sm">Expand your vocabulary collection</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              🇺🇸 English Word
            </label>
            <input
              type="text"
              value={english}
              onChange={(e) => setEnglish(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-600 bg-gray-800/50 p-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="Enter English word..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              🇹🇭 Thai Translation
            </label>
            <input
              type="text"
              value={thai}
              onChange={(e) => setThai(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-600 bg-gray-800/50 p-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              placeholder="ใส่คำแปลภาษาไทย..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              📖 Definition (English)
            </label>
            <input
              type="text"
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              placeholder="e.g. showing courage in the face of danger"
              className="w-full rounded-lg border border-gray-600 bg-gray-800/50 p-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              📝 Part of Speech
            </label>
            <select
              value={partOfSpeech}
              onChange={(e) => setPartOfSpeech(e.target.value)}
              className="w-full rounded-lg border border-gray-600 bg-gray-800/50 p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
            >
              <option value="noun">Noun (คำนาม)</option>
              <option value="verb">Verb (คำกริยา)</option>
              <option value="adjective">Adjective (คำคุณศัพท์)</option>
              <option value="adverb">Adverb (คำกริยาวิเศษณ์)</option>
              <option value="preposition">Preposition (คำบุพบท)</option>
              <option value="conjunction">Conjunction (คำสันธาน)</option>
              <option value="interjection">Interjection (คำอุทาน)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              🏷️ Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              placeholder="e.g. Emotion, Travel, Business"
              className="w-full rounded-lg border border-gray-600 bg-gray-800/50 p-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              💬 Example Sentence 1
            </label>
            <input
              type="text"
              value={example1}
              onChange={(e) => setExample1(e.target.value)}
              className="w-full rounded-lg border border-gray-600 bg-gray-800/50 p-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
              placeholder="First example sentence..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              💭 Example Sentence 2
            </label>
            <input
              type="text"
              value={example2}
              onChange={(e) => setExample2(e.target.value)}
              className="w-full rounded-lg border border-gray-600 bg-gray-800/50 p-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
              placeholder="Second example sentence..."
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white rounded-lg py-3 font-semibold hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            ✨ Add Word to Collection
          </button>
        </form>
        
        {message && (
          <div className="mt-6 p-3 bg-green-800/30 border border-green-600/50 rounded-lg">
            <p className="text-center text-green-300 text-sm font-medium">
              ✅ {message}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
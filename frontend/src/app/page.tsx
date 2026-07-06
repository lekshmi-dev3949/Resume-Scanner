'use client'

import { useState, useCallback } from 'react'
import { ReviewResult } from './types'
import ResultCard from '@/components/ResultCard'
import ScoreRing from '@/components/ScoreRing'

type State = 'idle' | 'loading' | 'done' | 'error'

export default function Home() {
  const [state, setState] = useState<State>('idle')
  const [result, setResult] = useState<ReviewResult | null>(null)
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')
  const [dragging, setDragging] = useState(false)

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.pdf')) {
      setError('Please upload a PDF file.')
      setState('error')
      return
    }

    setFileName(file.name)
    setState('loading')
    setResult(null)
    setError('')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('http://localhost:8000/review', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Server error')
      }
      const data: ReviewResult = await res.json()
      setResult(data)
      setState('done')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
      setState('error')
    }
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const reset = () => {
    setState('idle')
    setResult(null)
    setError('')
    setFileName('')
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">📄</span>
          <h1 className="text-3xl font-bold text-gray-900">Resume Reviewer</h1>
        </div>
        <p className="text-gray-500 text-base">
          Upload your resume and get instant AI feedback — what's strong, what's missing, and how to improve.
        </p>
      </div>

      {/* Upload zone — always visible */}
      {state !== 'done' && (
        <div
          onDrop={onDrop}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-colors cursor-pointer
            ${dragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50/40'}`}
        >
          <input
            type="file"
            accept=".pdf"
            onChange={onInputChange}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          {state === 'loading' ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-600 font-medium">Analyzing <span className="text-blue-600">{fileName}</span>…</p>
              <p className="text-gray-400 text-sm">This takes about 10–15 seconds</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-2xl">📤</div>
              <p className="text-gray-700 font-semibold text-lg">Drop your resume here</p>
              <p className="text-gray-400 text-sm">or click to browse — PDF only</p>
              {state === 'error' && (
                <p className="text-red-500 text-sm mt-2">⚠️ {error}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {state === 'done' && result && (
        <div className="space-y-6">
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-sm">
              Results for <span className="font-medium text-gray-700">{fileName}</span>
            </p>
            <button
              onClick={reset}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Review another
            </button>
          </div>

          {/* Score + summary */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 flex gap-6 items-start">
            <ScoreRing score={result.overall_score} />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Overall Assessment</h2>
              <p className="text-gray-600 leading-relaxed text-sm">{result.summary}</p>
            </div>
          </div>

          {/* Feedback grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard
              title="Strengths"
              emoji="✅"
              items={result.strengths}
              color="green"
            />
            <ResultCard
              title="Weaknesses"
              emoji="⚠️"
              items={result.weaknesses}
              color="amber"
            />
            <ResultCard
              title="Missing sections"
              emoji="❌"
              items={result.missing_sections.length > 0 ? result.missing_sections : ['None — good coverage!']}
              color={result.missing_sections.length > 0 ? 'red' : 'green'}
            />
          </div>

          {/* Improvement tips */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">💡 How to improve</h3>
            <ol className="space-y-3">
              {result.improvement_tips.map((tip, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-700">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold text-xs">
                    {i + 1}
                  </span>
                  {tip}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </main>
  )
}

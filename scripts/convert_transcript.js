#!/usr/bin/env node

/**
 * Convert Google Speech-to-Text API JSON format to simplified format
 *
 * Input format:
 * {
 *   "results": [{
 *     "alternatives": [{
 *       "words": [
 *         { "word": "Проект", "endOffset": "1.520s" },
 *         { "word": "Достоевский", "startOffset": "1.520s" },
 *         ...
 *       ]
 *     }]
 *   }]
 * }
 *
 * Output format:
 * {
 *   "words": [
 *     { "word": "Проект", "start": 0, "end": 1.52 },
 *     { "word": "Достоевский", "start": 1.52, "end": 1.52 },
 *     ...
 *   ]
 * }
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function parseOffset(offsetStr) {
  if (!offsetStr) return 0
  return parseFloat(offsetStr.replace('s', ''))
}

function convertTranscript(inputData) {
  const rawWords = inputData.results[0].alternatives[0].words

  const convertedWords = rawWords.map((word, index) => {
    // Apply fallback logic for missing offsets
    const startOffset = word.startOffset || (index > 0 ? rawWords[index - 1].endOffset : '0s') || '0s'
    const endOffset = word.endOffset || '0s'

    return {
      word: word.word,
      start: parseOffset(startOffset),
      end: parseOffset(endOffset)
    }
  })

  return {
    words: convertedWords
  }
}

function main() {
  const args = process.argv.slice(2)

  if (args.length < 2) {
    console.error('Usage: node convert_transcript.js <input.json> <output.json>')
    console.error('Example: node convert_transcript.js kiCxBpSvz0.json kiCxBpSvz0.json')
    process.exit(1)
  }

  const inputPath = path.resolve(args[0])
  const outputPath = path.resolve(args[1])

  // Read input file
  console.log(`Reading from: ${inputPath}`)
  const inputData = JSON.parse(fs.readFileSync(inputPath, 'utf8'))

  // Convert
  console.log('Converting format...')
  const outputData = convertTranscript(inputData)

  // Write output file
  console.log(`Writing to: ${outputPath}`)
  fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf8')

  console.log(`✓ Conversion complete!`)
  console.log(`  Words processed: ${outputData.words.length}`)
}

main()

# Shadowing Marey

A web app for practicing Russian through shadowing with an audiobook reading of Dostoevsky's short story "The Peasant Marey" (Мужик Марей).

## Features

- **Word-level highlighting** - Each word is highlighted in real-time as it's spoken
- **Click to seek** - Click any word to jump to that position
- **Repeat phrases** - Right-click to set start/end points for loop practice
- **Auto-scroll** - The current word stays centered on screen

## Content

«Мужик Марей» (The Peasant Marey, 1876) — Фёдор Достоевский (Fyodor Dostoevsky)  
Читает: Лариса Емец (Read by: Larisa Emets)  
From the "Достоевский вслух" project by Православный блог

Audio used with gratitude, not affiliation.

YouTube: https://www.youtube.com/watch?v=-kiCxBpSvz0

## Development

```bash
pnpm install
pnpm dev
```

## Scripts

### convert_transcript.js

The application expects JSON format output by `scripts/convert_transcript.js`. To convert JSON from Google Speech-to-Text API format, use the following command:

```bash
node scripts/convert_transcript.js <input.json> <output.json>
```

## Tech Stack

- Vue 3 (Vapor Mode)
- TypeScript
- Vite
- YouTube IFrame API

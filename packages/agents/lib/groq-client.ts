import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export interface StreamChunk {
  content: string
  done: boolean
}

export async function* streamCompletion(
  prompt: string,
  systemPrompt: string,
  model: string = 'llama-3.1-70b-versatile'
): AsyncGenerator<StreamChunk> {
  try {
    const stream = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      model,
      temperature: 0.7,
      max_tokens: 8000,
      stream: true,
    })

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || ''
      const done = chunk.choices[0]?.finish_reason === 'stop'
      
      if (content) {
        yield { content, done: false }
      }
      
      if (done) {
        yield { content: '', done: true }
      }
    }
  } catch (error) {
    console.error('Groq API error:', error)
    throw error
  }
}

export async function completePrompt(
  prompt: string,
  systemPrompt: string,
  model: string = 'llama-3.1-70b-versatile'
): Promise<string> {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      model,
      temperature: 0.7,
      max_tokens: 8000,
    })

    return completion.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('Groq API error:', error)
    throw error
  }
}

export { groq }

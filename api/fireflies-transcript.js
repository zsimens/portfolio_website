// api/fireflies-transcript.js
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { id } = req.query;
  const apiKey = process.env.FIREFLIES_API_KEY;

  if (!id || !apiKey) return res.status(400).json({ error: 'Missing ID or API key' });

  try {
    const response = await fetch(`https://api.fireflies.ai/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        query: `
          query Transcript($id: String!) {
            transcript(id: $id) {
              id
              title
              transcript
              summary
              actionItems
              topics
              date
            }
          }
        `,
        variables: { id },
      }),
    });

    const data = await response.json();
    res.status(200).json(data.data.transcript);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch transcript' });
  }
}

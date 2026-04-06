// api/fireflies-upload.js
export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.FIREFLIES_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Fireflies API key not configured' });

  try {
    const form = new FormData();
    const fileBuffer = Buffer.from(req.body.file, 'base64');
    form.append('file', new Blob([fileBuffer], { type: req.body.fileType }), req.body.fileName);

    const response = await fetch('https://api.fireflies.ai/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
    });

    const data = await response.json();
    res.status(200).json({ transcriptId: data.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload to Fireflies' });
  }
}

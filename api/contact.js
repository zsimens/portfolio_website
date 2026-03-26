export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, company, message } = req.body;

  if (!email || !name) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const apiKey = process.env.APOLLO_API_KEY;
  if (!apiKey) {
    console.error('Apollo API key missing');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // Step 1: Enrich contact with Apollo (gets title, LinkedIn, company details, etc.)
    const enrichRes = await fetch('https://api.apollo.io/api/v1/people/match', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        email: email.trim(),
        name: name.trim(),
        organization_name: company ? company.trim() : undefined,
        reveal_personal_emails: true,
      }),
    });

    const enrichData = await enrichRes.json();

    // Step 2: Create (or update) the contact in your Apollo workspace
    const createRes = await fetch('https://api.apollo.io/api/v1/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        first_name: name.trim().split(' ')[0],
        last_name: name.trim().split(' ').slice(1).join(' ') || '',
        email: email.trim(),
        organization_name: company ? company.trim() : enrichData.organization_name,
        title: enrichData.title || undefined,
        label_names: ['Portfolio Inbound'],
        run_dedupe: true,
        // merge all enriched fields
        ...enrichData,
      }),
    });

    const contactData = await createRes.json();

    return res.status(200).json({
      success: true,
      message: '✅ Saved to Apollo!',
      contact_id: contactData.contact?.id,
    });
  } catch (err) {
    console.error('Apollo error:', err);
    return res.status(500).json({ error: 'Failed to save contact' });
  }
}

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
    // === YOUR ORIGINAL APOLLO FLOW (unchanged) ===
    // Step 1: Enrich contact with Apollo
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

    // Step 2: Create (or update) the contact in Apollo
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
        ...enrichData,
      }),
    });

    const contactData = await createRes.json();

    // === NEW: Silent Supabase backup + analytics ===
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      await fetch(`${supabaseUrl}/rest/v1/contact_submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          company: company ? company.trim() : null,
          message: message ? message.trim() : null,
          apollo_contact_id: contactData.contact?.id || null,
        }),
      }).catch(err => console.warn('Supabase backup failed (non-blocking):', err));
    }

    return res.status(200).json({
      success: true,
      message: '✅ Saved to Apollo + Supabase backup!',
      contact_id: contactData.contact?.id,
    });
  } catch (err) {
    console.error('Apollo error:', err);
    return res.status(500).json({ error: 'Failed to save contact' });
  }
}

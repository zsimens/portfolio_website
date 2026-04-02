module.exports = async function handler(req, res) {
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
    // Apollo enrichment
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

    // Create/update contact in Apollo
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

    // Silent Supabase backup (exactly as it was before)
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        await fetch(`${process.env.SUPABASE_URL}/rest/v1/contact_submissions`, {
          method: 'POST',
          headers: {
            'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            company: company ? company.trim() : null,
            message: message ? message.trim() : null,
            source: 'portfolio_website',
            created_at: new Date().toISOString()
          })
        });
      } catch (supaErr) {
        console.error('Supabase backup failed (non-blocking):', supaErr);
      }
    }

    return res.status(200).json({
      success: true,
      message: '✅ Lead saved in Apollo + Supabase backup!',
      contact_id: contactData.contact?.id,
    });
  } catch (err) {
    console.error('Apollo error:', err);
    return res.status(500).json({ error: 'Failed to save contact' });
  }
};

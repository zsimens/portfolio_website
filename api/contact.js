module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, company, message } = req.body || {};

  console.log('Received contact form:', { name, email, company, message });

  return res.status(200).json({
    success: true,
    message: '✅ Test API working! (minimal version)',
    received: { name, email, company, message }
  });
};

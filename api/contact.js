export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fn, ln, em, ph, msg } = req.body;

  if (!fn || !ln || !em) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'notifications@maldencircle.com',
      to: ['design@listella.co'],
      subject: `New inquiry — 16462 Malden Circle`,
      html: `
        <p><strong>Name:</strong> ${fn} ${ln}</p>
        <p><strong>Email:</strong> ${em}</p>
        ${ph ? `<p><strong>Phone:</strong> ${ph}</p>` : ''}
        ${msg ? `<p><strong>Message:</strong><br>${msg.replace(/\n/g, '<br>')}</p>` : ''}
      `,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }

  return res.status(200).json({ ok: true });
}

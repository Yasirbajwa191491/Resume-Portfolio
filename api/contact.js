// Vercel Serverless Function for Contact Form
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed' 
    });
  }

  try {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Check if access key exists
    if (!process.env.WEB3FORMS_ACCESS_KEY) {
      console.error('WEB3FORMS_ACCESS_KEY environment variable is not set');
      return res.status(500).json({ 
        success: false, 
        message: 'Server configuration error. Please contact administrator.' 
      });
    }

    // Send to Web3Forms API (server-side)
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_key: process.env.WEB3FORMS_ACCESS_KEY, // From Vercel environment variable
        name: name,
        email: email,
        message: message,
        subject: '🚀 New Contact from Portfolio - ' + name, // Customizable subject
        from_name: 'Portfolio Contact Form', // Sender name
        replyto: email, // Reply-To header (visitor's email)
      }),
    });

    const data = await response.json();

    if (data.success) {
      return res.status(200).json({ 
        success: true, 
        message: 'Message sent successfully!' 
      });
    } else {
      console.error('Web3Forms API Error:', data);
      return res.status(500).json({ 
        success: false, 
        message: data.message || 'Failed to send message' 
      });
    }
  } catch (error) {
    console.error('Server Error:', error.message, error.stack);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + error.message 
    });
  }
}

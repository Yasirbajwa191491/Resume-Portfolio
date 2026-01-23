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

    // Log the access key (first 10 chars only for security)
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
    console.log('Access Key (first 10 chars):', accessKey ? accessKey.substring(0, 10) + '...' : 'NOT SET');

    // Send to Web3Forms API (server-side)
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        access_key: accessKey,
        name: name,
        email: email,
        message: message,
        subject: '🚀 New Contact from Portfolio - ' + name,
        from_name: 'Portfolio Contact Form',
        replyto: email,
      }),
    });

    console.log('Web3Forms Response Status:', response.status);
    console.log('Web3Forms Response Headers:', response.headers.get('content-type'));

    // Check if response is OK
    if (!response.ok) {
      const text = await response.text();
      console.error('Web3Forms Error Response:', text);
      return res.status(500).json({
        success: false,
        message: 'Failed to send message. Status: ' + response.status
      });
    }

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON Response from Web3Forms:', text.substring(0, 200));
      return res.status(500).json({
        success: false,
        message: 'Invalid response from email service'
      });
    }

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

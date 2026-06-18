require('dotenv').config();

const getToken = async() => {
    const response = await fetch('https://public-api.wordpress.com/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      username: process.env.WORDPRESS_USERNAME,
      password: process.env.WORDPRESS_PASSWORD,
      grant_type: 'password',
      client_id: process.env.WORDPRESS_CLIENT_ID,
      client_secret: process.env.WORDPRESS_CLIENT_SECRET,
    }),
  });
    const data = await response.json()
    console.log("data:", data)
}

getToken()
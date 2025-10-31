const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
async function request2Captcha(apiKey, sitekey, pageurl) {
  const inUrl = 'http://2captcha.com/in.php';
  const resUrl = 'http://2captcha.com/res.php';
  const params = new URLSearchParams({ key: apiKey, method: 'userrecaptcha', googlekey: sitekey, pageurl, json: 1 });
  const inResp = await axios.post(inUrl, params.toString(), { headers: {'Content-Type':'application/x-www-form-urlencoded'} });
  if (inResp.data.status !== 1) throw new Error(JSON.stringify(inResp.data));
  const id = inResp.data.request;
  for (let i=0;i<20;i++) {
    await new Promise(r=>setTimeout(r,5000));
    const r = await axios.get(resUrl, { params: { key: apiKey, action: 'get', id, json: 1 } });
    if (r.data.status === 1) return r.data.request;
  }
  throw new Error('Timeout');
}
app.post('/api/solve-recaptcha', async (req, res)=>{
  try {
    const { sitekey, pageurl, devApiKey } = req.body;
    const apiKey = process.env.TWOCAPTCHA_API_KEY || devApiKey;
    const token = await request2Captcha(apiKey, sitekey, pageurl);
    res.json({ request: token });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.listen(3000, ()=>console.log('Servidor na porta 3000'));

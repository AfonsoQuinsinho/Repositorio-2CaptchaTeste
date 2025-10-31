const solveBtn = document.getElementById('solve-btn');
solveBtn.addEventListener('click', async () => {
  const sitekey = document.getElementById('sitekey').value;
  const pageurl = document.getElementById('pageurl').value;
  const apiKey = document.getElementById('dev-api-key').value;
  const resultDiv = document.getElementById('result');
  resultDiv.textContent = 'A resolver...';
  try {
    const res = await fetch('/api/solve-recaptcha', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({sitekey, pageurl, devApiKey: apiKey})
    });
    const data = await res.json();
    resultDiv.textContent = data.request ? 'Token: ' + data.request : 'Erro: ' + data.error;
  } catch (e) { resultDiv.textContent = 'Erro: ' + e.message; }
});

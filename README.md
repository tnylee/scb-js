```
scb.config(apiKey, apiSecret, guid, billerId)
const { data } = await scb.createAccessToken()
const { accessToken } = data

const transRef = '202005184XOpuqz4T8KoRWt'
const sendingBank = '014'
const response = await scb.verifyPromptpayQRCode(accessToken, transRef, sendingBank)
console.log(response)

const response = await scb.createPromptpayQRCode(accessToken, '100.00', 'TH1234', 'OG44', 'KKK')
console.log(response)
```
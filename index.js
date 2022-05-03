const fetch = require('node-fetch')

const apiEndpoint = 'https://api-sandbox.partners.scb/partners/sandbox/v1/'

let _apiKey
let _apiSecret
let _guid
let _billerId

class SCB {
    constructor() {
        this.createAccessToken = this.createAccessToken.bind(this)
        this.createPromptpayQRCode = this.createPromptpayQRCode.bind(this)
        this.verifyPromptpayQRCode = this.verifyPromptpayQRCode.bind(this)
    }

    config(apiKey, apiSecret, guid, billerId) {
        _apiKey = apiKey
        _apiSecret = apiSecret
        _guid = guid
        _billerId = billerId
    }

    getHeaders() {
        const headers = {
            'requestUID': _guid,
            'resourceOwnerID': _apiKey,
            'accept-language': 'EN',
            'Content-Type': 'application/json'
        }

        return headers
    }

    createAccessToken() {
        const accessTokenEndpoint = `${apiEndpoint}oauth/token`
        const headers = this.getHeaders()

        const body = {
            applicationKey: _apiKey,
            applicationSecret: _apiSecret
        }

        return new Promise((resolve, reject) => {
            return fetch (accessTokenEndpoint, {
                headers,
                method: 'POST',
                cache: 'no-cache',
                body: JSON.stringify(body)
            }).then(async (response) => {
                if (response.ok) {
                    resolve(response.json())
                } else {
                    console.log('response not ok', response)
                    reject(response.json())
                }
            }).catch((error) => resolve(error))
        })
    }

    createPromptpayQRCode(accessToken, amount, ref1, ref2, ref3) {
        const createQREndpoint = `${apiEndpoint}payment/qrcode/create`
        const headers = this.getHeaders()

        const body = {
            ref1,
            ref2,
            ref3,
            amount,
            qrType: 'PP',
            ppType: 'BILLERID',
            ppId: _billerId
        }

        return new Promise((resolve, reject) => {
            return fetch(createQREndpoint, {
                headers: {
                    ...headers,
                    'authorization': 'Bearer ' + accessToken
                },
                method: 'POST',
                cache: 'no-cache',
                body: JSON.stringify(body)
            }).then(response => {
                if (response.ok && response.status === 200) {
                    resolve(response.json())
                } else {
                    console.log('response not ok', response)
                    reject(response.json())
                }
            }).catch((error) => {
                console.log(error)
                resolve(error)
            })
        })
    }

    verifyPromptpayQRCode(accessToken, transRef, sendingBank) {
        const verificationEndpoint = `${apiEndpoint}payment/billpayment/transactions/${transRef}?sendingBank=${sendingBank}`
        const headers = this.getHeaders()

        return new Promise((resolve, reject) => {
            return fetch(verificationEndpoint, {
                headers: {
                    ...headers,
                    'authorization': 'Bearer ' + accessToken
                },
                method: 'GET'
            }).then(response => {
                if (response.ok && response.status === 200) {
                    resolve(response.json())
                } else {
                    console.log('response not ok', response)
                    reject(response.json())
                }
            }).catch((error) => {
                console.log(error)
                resolve(error)
            })
        })
    }
}

const scb = new SCB()

module.exports = {
    config: scb.config,
    createAccessToken: scb.createAccessToken,
    createPromptpayQRCode: scb.createPromptpayQRCode,
    verifyPromptpayQRCode: scb.verifyPromptpayQRCode
}
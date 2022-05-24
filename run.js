const fs = require('fs')
const puppeteer = require('puppeteer')
const axios = require('axios').default

const SCHOOL_UUID = process.argv[2];

get_organisation(SCHOOL_UUID)
    .then(school => {
        let base_url = "https://somtoday.nl/oauth2/authorize?redirect_uri=somtodayleerling://oauth/callback&client_id=D50E0C06-32D1-4B41-A137-A9A850C892C2&response_type=code&prompt=login&scope=openid&code_challenge=tCqjy6FPb1kdOfvSa43D8a7j8FLDmKFCAz8EdRGdtQA&code_challenge_method=S256&tenant_uuid={TENANT_UUID}&oidc_iss={OIDC_ISS}".toString();

        (async () => {
            console.log(`Logging into ${school.naam} with ID: ${school.uuid}`)

            let oauth_url = base_url.replace('{TENANT_UUID}', school.uuid).replace('{OIDC_ISS}', school.oidcurls[0].url);
            const browser = await puppeteer.launch({
                defaultViewport: null,
                headless: false
            })
            const page = await browser.newPage()
            page.on('console', async msg => {
                if (msg.text().includes('Failed to launch')) {
                    let url = msg.text().match(/'([^']+)'/)[1]
                    let params = new URL(url).searchParams
                    let code = params.get('code')

                    axios.post('https://somtoday.nl/oauth2/token', new URLSearchParams({
                        grant_type: 'authorization_code',
                        redirect_uri: 'somtodayleerling://oauth/callback',
                        code_verifier: "t9b9-QCBB3hwdYa3UW2U2c9hhrhNzDdPww8Xp6wETWQ",
                        code: code,
                        scope: "openid",
                        client_id: "D50E0C06-32D1-4B41-A137-A9A850C892C2"
                    }), {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    })
                        .then(function (response) {
                            console.log('Saved token to token.js')
                            fs.writeFileSync('./token.json', JSON.stringify(response.data))
                        })
                        .catch(function (error) {
                            console.log(error)
                        })

                    await browser.close()
                }
            });
            await page.goto(oauth_url)
        })();
    })
    .catch(e => {
        console.log(e)
    })

async function get_organisation(uuid) {
    return new Promise((resolve, reject) => {
        axios.get('https://servers.somtoday.nl/organisaties.json')
            .then(function (response) {
                let school = response.data[0].instellingen.filter(v => v.uuid == uuid)
                if (school.length == 1) {
                    resolve(school[0])
                } else {
                    reject('No school found')
                }
            })
            .catch(function (error) {
                reject(error)
            })
    })
}
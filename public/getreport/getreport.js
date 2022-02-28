import fetch from 'node-fetch';
import fs from 'fs';
import { readFile } from 'fs/promises';
import { createInterface } from 'readline';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let cookie = '';
let token = '';

async function main() {
    console.log(__dirname);
    try {
        [cookie, token] = JSON.parse(
            await readFile(`${__dirname}/account.json`, 'utf-8')
        );
    } catch (err) {
        if (err.errno != -4058) {
            console.error(err);
            process.exit();
        }
        console.log('没有发现已经保存的凭证信息。');
    }
    try {
        while (1) {
            if (cookie != '' && GetInfo(cookie)) {
                break;
            }
            if (token != '' && Checktoken(token)) {
                await Login(token);
                break;
            } else {
                let [phone, password] = await GetPhoneAndPasswordbyinput();
                await GetTokenByPhonePassword(phone, password);
            }
        }
        const BattleReport = await GetBattleReport(cookie);
        fs.writeFile(
            `${__dirname}/playerBattleReport.json`,
            BattleReport,
            err => {
                if (err) {
                    return console.error(err);
                }
            }
        );
        console.log(`报告已成功生成。`);
    } catch (err) {
        console.error(err);
        process.exit(0);
    }
    fs.writeFile(
        `${__dirname}/account.json`,
        JSON.stringify([cookie, token]),
        err => {
            if (err) {
                return console.error(err);
            }
        }
    );
}

async function GetPhoneAndPasswordbyinput() {
    return new Promise((resolve, _) => {
        console.log('输入的手机号和密码不会上传到服务器。');
        console.log('仅会保留必要的凭证在本地保存，请放心使用。');
        const rl = createInterface({
            input: process.stdin,
            output: process.stdout
        });
        let [phone, password] = ['', ''];
        rl.question('请输入手机号:', res => {
            phone = res;
            rl.question('请输入密码:', res => {
                password = res;
                rl.close();
                resolve([phone, password]);
            });
            rl.stdoutMuted = true;
        });
        rl._writeToOutput = function _writeToOutput(stringToWrite) {
            if (rl.stdoutMuted) rl.output.write('*');
            else rl.output.write(stringToWrite);
        };
    });
}

async function GetTokenByPhonePassword(phone, password) {
    const response = await fetch(
        'https://as.hypergryph.com/user/auth/v1/token_by_phone_password',
        {
            headers: {
                accept: '*/*',
                'accept-language':
                    'zh-CN,zh-HK;q=0.9,zh;q=0.8,en-US;q=0.7,en;q=0.6,zh-TW;q=0.5',
                'content-type': 'application/json;charset=UTF-8',
                'sec-ch-ua':
                    '" Not A;Brand";v="99", "Chromium";v="98", "Microsoft Edge";v="98"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
                Referer: 'https://ak.hypergryph.com/',
                'Referrer-Policy': 'strict-origin-when-cross-origin'
            },
            body: `{"phone":"${phone}","password":"${password}"}`,
            method: 'POST'
        }
    );
    const data = await response.json();
    console.log(data);
    if (data.status == 0) {
        token = data.data.token;
    } else if (data.status == 1) {
        console.log('目前本工具暂时无法处理人机验证，请稍后再试。');
        throw data.msg;
    } else if (data.status == 100) {
        throw data.msg;
    }
    return token;
}

async function Login(token) {
    const response = await fetch('https://ak.hypergryph.com/is/login', {
        headers: {
            accept: 'application/json, text/plain, */*',
            'accept-language':
                'zh-CN,zh-HK;q=0.9,zh;q=0.8,en-US;q=0.7,en;q=0.6,zh-TW;q=0.5',
            'content-type': 'application/json',
            'sec-ch-ua':
                '" Not A;Brand";v="99", "Chromium";v="98", "Microsoft Edge";v="98"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            Referer: 'https://ak.hypergryph.com/is/crimsonsolitaire',
            'Referrer-Policy': 'strict-origin-when-cross-origin'
        },
        body: `{"channelId":1,"token":"${token}"}`,
        method: 'POST'
    });
    const data = await response.json();
    if (typeof data.code == undefined || data.code != 0 || data.statusCode) {
        console.log(data);
        throw data.msg;
    }
    cookie = response.headers
        .raw()
        ['set-cookie'][0].replace(/(akisw=.*?);.*/gm, `$1`);
    return cookie;
}
async function Checktoken(token) {
    const response = await fetch(
        'https://as.hypergryph.com/user/info/v1/token_by_cookie',
        {
            headers: {
                accept: '*/*',
                'accept-language':
                    'zh-CN,zh-HK;q=0.9,zh;q=0.8,en-US;q=0.7,en;q=0.6,zh-TW;q=0.5',
                'content-type': '',
                'sec-ch-ua':
                    '" Not A;Brand";v="99", "Chromium";v="98", "Microsoft Edge";v="98"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
                cookie: `token=${token}`,
                Referer: 'https://ak.hypergryph.com/',
                'Referrer-Policy': 'strict-origin-when-cross-origin'
            },
            body: null,
            method: 'GET'
        }
    );
    const data = await response.json();
    if (
        typeof data.status == undefined ||
        data.status != 0 ||
        data.statusCode
    ) {
        return false;
    }
    return true;
}
async function GetInfo(cookie) {
    const response = await fetch('https://ak.hypergryph.com/is/info', {
        headers: {
            accept: 'application/json, text/plain, */*',
            'accept-language':
                'zh-CN,zh-HK;q=0.9,zh;q=0.8,en-US;q=0.7,en;q=0.6,zh-TW;q=0.5',
            'if-none-match': 'W/"5b-h8ZXrROb5J46NEiW5Hszn5R0zuM"',
            'sec-ch-ua':
                '" Not A;Brand";v="99", "Chromium";v="98", "Microsoft Edge";v="98"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            cookie: `${cookie}`,
            Referer: 'https://ak.hypergryph.com/is/crimsonsolitaire',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Cache-Control': 'no-cache'
        },
        body: null,
        method: 'GET'
    });
    const data = await response.json();
    console.log(data);
    if (data.code != 0) {
        return false;
    }
    return true;
}
async function GetBattleReport(cookie) {
    const response = await fetch(
        'https://ak.hypergryph.com/is/api/topic/crimsonsolitaire/playerBattleReport',
        {
            headers: {
                accept: 'application/json, text/plain, */*',
                'accept-language':
                    'zh-CN,zh-HK;q=0.9,zh;q=0.8,en-US;q=0.7,en;q=0.6,zh-TW;q=0.5',
                'sec-ch-ua':
                    '" Not A;Brand";v="99", "Chromium";v="98", "Microsoft Edge";v="98"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                cookie: `${cookie}`,
                Referer: 'https://ak.hypergryph.com/is/crimsonsolitaire',
                'Referrer-Policy': 'strict-origin-when-cross-origin'
            },
            body: null,
            method: 'GET'
        }
    );
    const data = await response.text();
    return data;
}
async function Logout(token, cookie) {
    fetch('https://as.hypergryph.com/user/info/v1/logout', {
        headers: {
            accept: '*/*',
            'accept-language':
                'zh-CN,zh-HK;q=0.9,zh;q=0.8,en-US;q=0.7,en;q=0.6,zh-TW;q=0.5',
            'content-type': 'application/json;charset=UTF-8',
            'sec-ch-ua':
                '" Not A;Brand";v="99", "Chromium";v="98", "Microsoft Edge";v="98"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-site',
            cookie: `token=${token}`,
            Referer: 'https://ak.hypergryph.com/',
            'Referrer-Policy': 'strict-origin-when-cross-origin'
        },
        body: '{}',
        method: 'POST'
    });
    fetch('https://ak.hypergryph.com/is/logout', {
        headers: {
            accept: 'application/json, text/plain, */*',
            'accept-language':
                'zh-CN,zh-HK;q=0.9,zh;q=0.8,en-US;q=0.7,en;q=0.6,zh-TW;q=0.5',
            'content-type': 'application/json',
            'sec-ch-ua':
                '" Not A;Brand";v="99", "Chromium";v="98", "Microsoft Edge";v="98"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            cookie: `${cookie}`,
            Referer: 'https://ak.hypergryph.com/is/crimsonsolitaire',
            'Referrer-Policy': 'strict-origin-when-cross-origin'
        },
        body: '{}',
        method: 'POST'
    });
}

main();

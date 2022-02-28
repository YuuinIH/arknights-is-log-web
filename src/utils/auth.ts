import axios from 'axios';

const baseurl = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8080';
const authconfig = {
    timeout: 1000 * 12,
    responseEncoding: 'utf8',
    headers: {
        'Content-Type': 'application/json'
    },
    baseURL: `${baseurl}/auth/`
};
const auth = axios.create(authconfig);

export function GetNewUUID() {
    auth.get('uuid').then(res => {
        if (res.data.data.uuid) {
            window.localStorage.setItem('uuid', res.data.data.uuid);
        }
    });
}

export function Login() {
    let form = new FormData();
    form.append('uuid', window.localStorage.getItem('uuid') ?? '');
    auth.post('login', form).then(res => {
        if (res.data.data.token) {
            window.localStorage.setItem('accessToken', res.data.data.token);
            window.localStorage.setItem(
                'accessLastTime',
                Date.now().toString()
            );
        }
    });
}

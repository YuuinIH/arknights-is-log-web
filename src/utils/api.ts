import axios from 'axios';
import { Report } from './report';

const baseurl = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8080';
const v1config = {
    timeout: 1000 * 12,
    responseEncoding: 'utf8',
    headers: {
        'Content-Type': 'application/json'
    },
    baseURL: `${baseurl}/api/v1/`
};
const v1 = axios.create(v1config);

v1.interceptors.request.use(
    config => {
        const token = window.localStorage.getItem('accessToken');
        if (token && config.headers) {
            config.headers.authorization = 'Bearer ' + token;
            return config;
        }
    },
    error => {
        return Promise.reject(error);
    }
);

export function GetReportList(page: number = 1, pagesize: number = 10) {
    return new Promise<Report[]>((resolve, reject) => {
        v1.get('report', {
            params: {
                page: page,
                pagesize: pagesize
            }
        })
            .then(res => {
                if (res.data.code == 200) {
                    resolve(res.data.data);
                } else throw res.data.msg;
            })
            .catch(err => {
                reject(err);
            });
    });
}

export function GetReport(id: string) {
    return new Promise<Report>((resolve, reject) => {
        v1.get(`report/${id}`)
            .then(res => {
                if (res.data.code == 200) {
                    resolve(res.data.data);
                } else reject(res.data.msg);
            })
            .catch(err => {
                reject(err);
            });
    });
}

export function PostReport(report: Report) {
    return new Promise<Report>((resolve, reject) => {
        v1.post(`report`, report)
            .then(res => {
                if (res.data.code == 201) {
                    resolve(res.data.data);
                } else reject(res.data.msg);
            })
            .catch(err => {
                reject(err);
            });
    });
}

export function PostReports(reports: Report[]) {
    return new Promise<Report>((resolve, reject) => {
        v1.post(`reports`, reports)
            .then(res => {
                if (res.data.code == 201) {
                    resolve(res.data.data);
                } else reject(res.data.msg);
            })
            .catch(err => {
                reject(err);
            });
    });
}

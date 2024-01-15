import http from './http-common';
import { GET_USERS, USER} from './routes';

export class Api {
    static getUsers = async (page: number = 1, search: string = '') => {
        const response = await http.get(`${GET_USERS}?page=${page}${search && ('&search=' + search)}`);
        return response;
    };
    static getTransactions = async (id: string) => {
        const response = await http.get(`${USER}/${id}/transactions`);
        return response;
    };
}
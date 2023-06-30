import { makeAutoObservable } from "mobx";
import { IUser } from "../models/IUser";
import AuthService from "../service/AuthService";
import axios from 'axios'
import { AuthResponse } from "../models/response/AuthResponse";
import { API_URL } from "../http";

export default class Store {
    user = {} as IUser;
    isAuth = false;
    isLoading = false;

    constructor() {
        makeAutoObservable(this)
    }

    setAuth(bool: boolean) {
        this.isAuth = bool;
    }

    setUser(user: IUser) {
        this.user = user;
    }

    setLoading(bool: boolean) {
        this.isLoading = bool;
    }

    async login(email: string, password: string) {
        try {
            const response = await AuthService.login(email, password);
            //Получение ответа с сервера
            console.log(response);

            this._setData(response)
        } catch(e: any) {
            console.log(e.response?.data?.message)
        }
    }

    async registration(email: string, password: string) {
        try {
            const response = await AuthService.registration(email, password);
            //Получение ответа с сервера
            console.log(response);

            this._setData(response)
        } catch(e: any) {
            console.log(e.response?.data?.message)
        }
    }

    async logout() {
        try {
            const response = await AuthService.logout();
            //Получение ответа с сервера
            localStorage.removeItem('token');
            //Удаляем accessToken из localStorage

            this.setAuth(false);
            this.setUser({} as IUser)
            //Изменяем состояния в глобальном state. Флаг isAuth меняем на false, а в user записываем получаемого пустой объект
        } catch(e: any) {
            console.log(e.response?.data?.message)
        }
    }

    async checkAuth() {
        this.setLoading(true)
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true})
            //Здесь напрямую обращаемся к axios, т.к. с сервера может вернуться статус 401 и мы уже знаем, что пользователь не авторизован. Чтобы интрецептор не выполнял лишнюю работу
            //Получение текнов и пользователя
            console.log(response);

            this._setData(response)
        } catch(e: any) {
            console.log(e.response?.data?.message)
        } finally {
            this.setLoading(false)
        }
    }

    _setData({data}: any) {
            localStorage.setItem('token', data.accessToken);
            //Добавляем accessToken в localStorage, чтобы интерцептор мог подхватывать занчения из хранилища

            this.setAuth(true);
            this.setUser(data.user)
            //Изменяем состояния в глобальном state. Флаг isAuth меняем на true, а в user записываем получаемого user с сервера
    }   
}
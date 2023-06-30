import axios from "axios";
import { AuthResponse } from "../models/response/AuthResponse";

export const API_URL = 'http://localhost:5000/api'

const $api = axios.create({
    withCredentials: true, //Поле чтобы куки к каждому запросу цеплялись автоматически
    baseURL: API_URL //Базовый url 
})
//Создаем инстанс axios

$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config
})
//Вешаем интерцептор на запрос. В нем мы автоматичсеки прикрепляем к хэдору запроса refreshToken
//config является конфигом инстанса axios со всеми полями

$api.interceptors.response.use((config) => {
    return config
}, async (error) => {
    const originalReq = error.config;
    //Переменная хранит в себе данные для запроса

    if(error.response.status == 401 && error.config && !error.config._isRetry) {
        //Проверяем статус код, сущетвование конфига и поле _isRetry != true. Иначе мы можем уйти в бесконечный цикл
        originalReq._isRetry = true
        //Поле сообщающее о том, что запрос мы уже делали 
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true})
            //Делаем запрос на эндпоинт с рефрешом токенов
            localStorage.setItem('token', response.data.accessToken)
            return $api.request(originalReq)
            //Записываем в локальное хранилище полученный токен и делаем повторный запрос 
        } catch(e) {
            console.log('Пользователь не авторизирован')
        }
    }
    throw error;
    //Вешаем интерцептор на ответ. В нем, при получении 401 статус кода мы получаем новый токен и делаем запрос еще раз 
})

export default $api;
import React, {FC, useEffect, useContext, useState} from 'react'
import LoginForm from './component/LoginForm';
import { Context } from '.';
import { observer } from 'mobx-react-lite';
import { IUser } from './models/IUser';
import { UserService } from './service/UserService';

const App: FC = () => {
	const {store} = useContext(Context)
	const [users, setUsers] = useState<IUser[]>([])

	useEffect(() => {
		if (localStorage.getItem('token')) {
			store.checkAuth()
		}
	}, [])

	const getUsers = async () => {
		try {
			const response = await UserService.fetchUsers()
			//Получаем пользователей через наш сервис с сервера

			setUsers(response.data)
		} catch(e) {
			console.log(e)
		}
	}

	if (store.isLoading) {
		return (
			<h1>Загрузка...</h1>
		)
	}

	if (!store.isAuth) {
		return (
			<>
				<h1>Пользователь не авторизован</h1>
				<LoginForm/>
				<button onClick={() => getUsers()}>Получить пользователей</button>
			</>
		)	
	}

	return (
		<div>
			<h1>{'Пользователь авторизован: ' + store.user.email}</h1>
			<button onClick={() => store.logout()}>Выйти</button>
			{store.user.isActivated ? 
									<div>Пользователь подтвердил аккаунт</div>
									:
									<div>Поддтеврдите аккаунт по почте</div>}
			<div>
				<button onClick={() => getUsers()}>Получить пользователей</button>
			</div>
			{users.map(user => {
				return <div key={user.email}>{user.email}</div>
			})}
		</div>
	)
}

export default observer(App);

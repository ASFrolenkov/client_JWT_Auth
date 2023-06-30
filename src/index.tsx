import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Store from './store/store';

interface IStore {
	store: Store
}

const store = new Store();
//Создаем экземпляр класса Store

export const Context = createContext<IStore>({store});
//Создаем контекст для передачи store внтури приложения

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
	<Context.Provider value={{
		store
	}}>
		<App />
	</Context.Provider>	
);

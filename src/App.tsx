import React, { useState } from 'react';
import axios from 'axios';

interface User {
  name: string;
  public_repos: number;
}

interface Repo {
  full_name: string;
  stargazers_count: number;
}

type Data = User | Repo | null;

const App: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [type, setType] = useState<'user' | 'repo'>('user');
  const [data, setData] = useState<Data>(null);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    try {
      if (type === 'user') {
        const response = await axios.get<User>(`https://api.github.com/users/${input}`);
        setData(response.data);
      } else {
        const response = await axios.get<Repo>(`https://api.github.com/repos/${input}`);
        setData(response.data);
      }
    } catch (err) {
      setError('Произошла ошибка при запросе данных');
      setData(null);
    }
  };

  return (
      <div>
        <h2>Тестовое задание</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="input">Введите значение:</label>
            <input
                id="input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="type">Выберите тип:</label>
            <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as 'user' | 'repo')}
            >
              <option value="user">User</option>
              <option value="repo">Repo</option>
            </select>
          </div>
          <button type="submit">Отправить</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {data && type === 'user' && (
            <div>
              <p>Полное имя: {(data as User).name}</p>
              <p>Число репозиториев: {(data as User).public_repos}</p>
            </div>
        )}
        {data && type === 'repo' && (
            <div>
              <p>Название репозитория: {(data as Repo).full_name}</p>
              <p>Число звезд: {(data as Repo).stargazers_count}</p>
            </div>
        )}
      </div>
  );
};

export default App;

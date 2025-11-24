import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import Home from './pages/Home';
import TechnologyList from './pages/TechnologyList';
import TechnologyDetail from './pages/TechnologyDetail';
import AddTechnology from './pages/AddTechnology';
import Stats from './pages/Stats';
import NotFound from './pages/NotFound';

// Главный компонент приложения
function App() {
  const [technologies, setTechnologies] = useState([]);

  // 🔁 Загрузка из localStorage при старте
  useEffect(() => {
    const saved = localStorage.getItem('technologies');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTechnologies(parsed);
      } catch (e) {
        console.error('Ошибка загрузки из localStorage', e);
      }
    }
  }, []);

  // 💾 Автосохранение в localStorage
  useEffect(() => {
    localStorage.setItem('technologies', JSON.stringify(technologies));
  }, [technologies]);

  // 🛠️ Функции для управления данными
  const addTechnology = (newTech) => {
    const nextId = technologies.length > 0
      ? Math.max(...technologies.map(t => t.id)) + 1
      : 1;
    setTechnologies(prev => [...prev, { ...newTech, id: nextId }]);
  };

  const updateTechnology = (id, updates) => {
    setTechnologies(prev =>
      prev.map(tech => (tech.id === id ? { ...tech, ...updates } : tech))
    );
  };

  const deleteTechnology = (id) => {
    setTechnologies(prev => prev.filter(tech => tech.id !== id));
  };

  const getTechnologyById = (id) => {
    return technologies.find(t => t.id === Number(id));
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/technologies"
            element={
              <TechnologyList
                technologies={technologies}
                onDelete={deleteTechnology}
              />
            }
          />
          <Route
            path="/technology/:techId"
            element={
              <TechnologyDetail
                getTechnology={getTechnologyById}
                onUpdate={updateTechnology}
              />
            }
          />
          <Route
            path="/add-technology"
            element={<AddTechnology onAdd={addTechnology} />}
          />
          <Route
            path="/stats"
            element={<Stats technologies={technologies} />}
          />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
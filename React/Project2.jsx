import React, { useState, useEffect } from 'react';

// ================
// ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ
// ================

// 📌 Карточка технологии
function TechnologyCard({ technology, onStatusChange, onNotesChange }) {
  const handleStatusClick = () => {
    const statuses = ['not-started', 'in-progress', 'completed'];
    const currentIndex = statuses.indexOf(technology.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    onStatusChange(technology.id, nextStatus);
  };

  const handleNotesChange = (e) => {
    onNotesChange(technology.id, e.target.value);
  };

  const statusLabels = {
    'not-started': 'Не начато',
    'in-progress': 'В процессе',
    'completed': 'Завершено'
  };

  const statusColors = {
    'not-started': '#ff6b6b',
    'in-progress': '#4ecdc4',
    'completed': '#45b7d1'
  };

  return (
    <div
      className="technology-card"
      onClick={handleStatusClick}
      style={{
        borderLeft: `4px solid ${statusColors[technology.status]}`,
        padding: '16px',
        marginBottom: '16px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
    >
      <h3>{technology.title}</h3>
      <p>{technology.description}</p>
      <div style={{ marginTop: '10px', fontSize: '0.9em' }}>
        <strong>Статус:</strong> {statusLabels[technology.status]}
      </div>
      {technology.notes && (
        <div style={{ marginTop: '10px', color: '#555', fontSize: '0.9em' }}>
          <strong>Заметки:</strong> {technology.notes}
        </div>
      )}
      <textarea
        value={technology.notes}
        onChange={handleNotesChange}
        placeholder="Добавьте заметку..."
        rows="2"
        style={{
          width: '100%',
          marginTop: '10px',
          padding: '6px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          fontSize: '0.9em'
        }}
      />
    </div>
  );
}

// 📌 Прогресс-бар
function ProgressBar({ progress, label }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span>{label}</span>
        <span>{progress}%</span>
      </div>
      <div
        style={{
          height: '12px',
          backgroundColor: '#e0e0e0',
          borderRadius: '6px',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            backgroundColor: '#4CAF50',
            transition: 'width 0.3s ease'
          }}
        />
      </div>
    </div>
  );
}

// 📌 Быстрые действия (QuickActions)
function QuickActions({ onMarkAllCompleted, onResetAll, onRandomTech, technologies }) {
  const getRandomTech = () => {
    if (technologies.length === 0) return;
    const randomTech = technologies[Math.floor(Math.random() * technologies.length)];
    if (window.confirm(`Случайная технология: ${randomTech.title}\nПерейти?`)) {
      onRandomTech(randomTech.id);
    }
  };

  return (
    <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
      <h3>Быстрые действия</h3>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button onClick={onMarkAllCompleted} style={{ padding: '8px 12px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          ✅ Отметить все как выполненные
        </button>
        <button onClick={onResetAll} style={{ padding: '8px 12px', backgroundColor: '#ff9800', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          🔄 Сбросить все статусы
        </button>
        <button onClick={getRandomTech} style={{ padding: '8px 12px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          🎲 Случайная технология
        </button>
      </div>
    </div>
  );
}

// ================
// ОСНОВНОЙ КОМПОНЕНТ
// ================

export default function Project2() {
  // 🔹 Начальные данные
  const initialTechnologies = [
    {
      id: 1,
      title: 'React Components',
      description: 'Изучение базовых компонентов',
      status: 'not-started',
      notes: ''
    },
    {
      id: 2,
      title: 'JSX Syntax',
      description: 'Освоение синтаксиса JSX',
      status: 'not-started',
      notes: ''
    },
    {
      id: 3,
      title: 'State Management',
      description: 'Работа с состоянием компонентов',
      status: 'not-started',
      notes: ''
    },
    {
      id: 4,
      title: 'React Router',
      description: 'Настройка маршрутизации в приложении',
      status: 'not-started',
      notes: ''
    }
  ];

  // 🔹 Состояния
  const [technologies, setTechnologies] = useState(initialTechnologies);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'not-started', 'in-progress', 'completed'

  // 🔹 Загрузка из localStorage
  useEffect(() => {
    const saved = localStorage.getItem('techTrackerData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setTechnologies(parsed);
      } catch (e) {
        console.error('Ошибка загрузки из localStorage', e);
      }
    }
  }, []);

  // 🔹 Автосохранение в localStorage
  useEffect(() => {
    localStorage.setItem('techTrackerData', JSON.stringify(technologies));
  }, [technologies]);

  // 🔹 Обновление статуса
  const updateStatus = (id, newStatus) => {
    setTechnologies(prev =>
      prev.map(tech => (tech.id === id ? { ...tech, status: newStatus } : tech))
    );
  };

  // 🔹 Обновление заметок
  const updateNotes = (id, newNotes) => {
    setTechnologies(prev =>
      prev.map(tech => (tech.id === id ? { ...tech, notes: newNotes } : tech))
    );
  };

  // 🔹 Быстрые действия
  const markAllCompleted = () => {
    setTechnologies(prev =>
      prev.map(tech => ({ ...tech, status: 'completed' }))
    );
  };

  const resetAll = () => {
    setTechnologies(prev =>
      prev.map(tech => ({ ...tech, status: 'not-started' }))
    );
  };

  const goToRandomTech = (id) => {
    const element = document.getElementById(`tech-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.style.boxShadow = '0 0 0 3px #2196F3';
      setTimeout(() => {
        element.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      }, 2000);
    }
  };

  // 🔹 Расчёт статистики
  const completedCount = technologies.filter(t => t.status === 'completed').length;
  const notStartedCount = technologies.filter(t => t.status === 'not-started').length;
  const inProgressCount = technologies.filter(t => t.status === 'in-progress').length;
  const total = technologies.length;
  const progressPercent = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  // 🔹 Фильтрация + поиск
  const filteredTechnologies = technologies.filter(tech => {
    const matchesSearch =
      tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      tech.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>🚀 Трекер технологий</h1>

      {/* Статистика */}
      <div style={{ backgroundColor: '#e8f5e9', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>Статистика</h2>
        <p>Всего: {total} | Завершено: {completedCount} | В процессе: {inProgressCount} | Не начато: {notStartedCount}</p>
        <ProgressBar progress={progressPercent} label="Общий прогресс" />
      </div>

      {/* Быстрые действия */}
      <QuickActions
        onMarkAllCompleted={markAllCompleted}
        onResetAll={resetAll}
        onRandomTech={goToRandomTech}
        technologies={technologies}
      />

      {/* Поиск */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Поиск технологий..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '1em'
          }}
        />
        <p style={{ marginTop: '8px', color: '#666' }}>
          Найдено: {filteredTechnologies.length} из {total}
        </p>
      </div>

      {/* Фильтры */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {['all', 'not-started', 'in-progress', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 12px',
              backgroundColor: filter === f ? '#2196F3' : '#e0e0e0',
              color: filter === f ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {f === 'all' ? 'Все' : 
             f === 'not-started' ? 'Не начато' :
             f === 'in-progress' ? 'В процессе' : 'Завершено'}
          </button>
        ))}
      </div>

      {/* Список технологий */}
      {filteredTechnologies.length === 0 ? (
        <p>Нет технологий, соответствующих фильтру и поиску.</p>
      ) : (
        filteredTechnologies.map((tech) => (
          <div key={tech.id} id={`tech-${tech.id}`}>
            <TechnologyCard
              technology={tech}
              onStatusChange={updateStatus}
              onNotesChange={updateNotes}
            />
          </div>
        ))
      )}
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const catSounds = [
  'meow',
  'mrrrow',
  'miau',
  'nyaa',
  'prr-prr',
  'mrow'
];

const achievements = [
  { id: 1, name: 'Котик-новичок', clicks: 10, icon: 'Cat', color: 'bg-orange-500' },
  { id: 2, name: 'Кошачий друг', clicks: 50, icon: 'Heart', color: 'bg-pink-500' },
  { id: 3, name: 'Мяу-мастер', clicks: 100, icon: 'Star', color: 'bg-yellow-500' },
  { id: 4, name: 'Король котов', clicks: 500, icon: 'Crown', color: 'bg-purple-500' },
  { id: 5, name: 'Легенда мурчания', clicks: 1000, icon: 'Trophy', color: 'bg-red-500' }
];

export default function Index() {
  const [clicks, setClicks] = useState(0);
  const [currentSound, setCurrentSound] = useState('');
  const [isPressed, setIsPressed] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState<number[]>([]);
  const [showNewBadge, setShowNewBadge] = useState<number | null>(null);

  useEffect(() => {
    const savedClicks = localStorage.getItem('catClicks');
    const savedAchievements = localStorage.getItem('unlockedAchievements');
    if (savedClicks) setClicks(parseInt(savedClicks));
    if (savedAchievements) setUnlockedAchievements(JSON.parse(savedAchievements));
  }, []);

  useEffect(() => {
    localStorage.setItem('catClicks', clicks.toString());
    
    achievements.forEach(achievement => {
      if (clicks >= achievement.clicks && !unlockedAchievements.includes(achievement.id)) {
        setUnlockedAchievements(prev => {
          const updated = [...prev, achievement.id];
          localStorage.setItem('unlockedAchievements', JSON.stringify(updated));
          return updated;
        });
        setShowNewBadge(achievement.id);
        setTimeout(() => setShowNewBadge(null), 3000);
      }
    });
  }, [clicks]);

  const handleClick = () => {
    const randomSound = catSounds[Math.floor(Math.random() * catSounds.length)];
    setCurrentSound(randomSound);
    setClicks(prev => prev + 1);
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 200);
    setTimeout(() => setCurrentSound(''), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-orange-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl animate-float">🐱</div>
        <div className="absolute top-20 right-20 text-5xl animate-float" style={{animationDelay: '1s'}}>🐾</div>
        <div className="absolute bottom-20 left-20 text-5xl animate-float" style={{animationDelay: '2s'}}>🐾</div>
        <div className="absolute bottom-10 right-10 text-6xl animate-float" style={{animationDelay: '0.5s'}}>🐱</div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 max-w-4xl w-full">
        <div className="text-center space-y-2 animate-bounce-in">
          <h1 className="text-6xl md:text-7xl font-bold text-primary drop-shadow-lg">
            Кошачья Кнопка
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium">
            Жми и слушай мурчание! 🎵
          </p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm p-8 shadow-2xl border-4 border-primary/20">
          <div className="flex flex-col items-center gap-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                Всего нажатий
              </p>
              <p className="text-6xl md:text-8xl font-bold text-primary animate-pulse-grow">
                {clicks}
              </p>
            </div>

            <button
              onClick={handleClick}
              onMouseDown={() => setIsPressed(true)}
              onMouseUp={() => setIsPressed(false)}
              onMouseLeave={() => setIsPressed(false)}
              className={`
                relative w-64 h-64 md:w-80 md:h-80 rounded-full 
                bg-gradient-to-br from-red-500 via-red-600 to-red-700
                shadow-2xl hover:shadow-red-500/50
                transition-all duration-200 ease-out
                cursor-pointer select-none
                border-8 border-red-800/30
                ${isPressed ? 'scale-90' : 'scale-100 hover:scale-105'}
                active:scale-90
              `}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-8xl animate-wiggle">🐱</span>
              </div>
              
              <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse"></div>
            </button>

            {currentSound && (
              <div className="text-4xl font-bold text-primary animate-bounce-in">
                {currentSound.toUpperCase()}!
              </div>
            )}
          </div>
        </Card>

        <div className="w-full">
          <h2 className="text-3xl font-bold text-center mb-6 text-primary">
            🏆 Достижения
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map(achievement => {
              const isUnlocked = unlockedAchievements.includes(achievement.id);
              const isNew = showNewBadge === achievement.id;
              
              return (
                <Card
                  key={achievement.id}
                  className={`
                    p-6 transition-all duration-300
                    ${isUnlocked 
                      ? 'bg-gradient-to-br from-white to-gray-50 border-4 border-green-500 shadow-lg' 
                      : 'bg-white/40 backdrop-blur-sm border-2 border-gray-300 opacity-60'
                    }
                    ${isNew ? 'animate-bounce-in scale-105' : ''}
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className={`
                      w-16 h-16 rounded-full flex items-center justify-center
                      ${isUnlocked ? achievement.color : 'bg-gray-400'}
                      text-white shadow-lg
                    `}>
                      <Icon name={achievement.icon as any} size={32} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-foreground">
                        {achievement.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {achievement.clicks} нажатий
                      </p>
                      {isUnlocked && (
                        <Badge className="mt-2 bg-green-500 text-white">
                          Получено! ✓
                        </Badge>
                      )}
                      {!isUnlocked && (
                        <Badge variant="outline" className="mt-2">
                          Ещё {achievement.clicks - clicks}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {isNew && (
                    <div className="mt-4 text-center">
                      <Badge className="bg-yellow-500 text-white text-lg animate-pulse-grow">
                        🎉 НОВОЕ!
                      </Badge>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

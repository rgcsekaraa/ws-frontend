// File: client/src/App.tsx
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';
import { RefreshCw } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  color: string;
  score: number;
  isAdmin?: boolean;
  country?: {
    code: string;
    name: string;
  };
}

interface GridSquare {
  id: number;
  color: string;
  ownerId: string;
  ownerName: string;
}

const countryFlags: { [key: string]: string } = {
  AF: '🇦🇫',
  AL: '🇦🇱',
  DZ: '🇩🇿',
  AS: '🇦🇸',
  AD: '🇦🇩',
  AO: '🇦🇴',
  AI: '🇦🇮',
  AQ: '🇦🇶',
  AR: '🇦🇷',
  AM: '🇦🇲',
  AW: '🇦🇼',
  AU: '🇦🇺',
  AT: '🇦🇹',
  AZ: '🇦🇿',
  BS: '🇧🇸',
  BH: '🇧🇭',
  BD: '🇧🇩',
  BB: '🇧🇧',
  BY: '🇧🇾',
  BE: '🇧🇪',
  BZ: '🇧🇿',
  BJ: '🇧🇯',
  BM: '🇧🇲',
  BT: '🇧🇹',
  BO: '🇧🇴',
  BA: '🇧🇦',
  BW: '🇧🇼',
  BV: '🇧🇻',
  BR: '🇧🇷',
  IO: '🇮🇴',
  VG: '🇻🇬',
  BN: '🇧🇳',
  BG: '🇧🇬',
  BF: '🇧🇫',
  BI: '🇧🇮',
  KH: '🇰🇭',
  CM: '🇨🇲',
  CA: '🇨🇦',
  CV: '🇨🇻',
  KY: '🇰🇾',
  CF: '🇨🇫',
  TD: '🇹🇩',
  CL: '🇨🇱',
  CN: '🇨🇳',
  CX: '🇮🇴',
  CC: '🇨🇨',
  CO: '🇨🇴',
  KM: '🇰🇲',
  CG: '🇨🇬',
  CD: '🇨🇩',
  CK: '🇨🇰',
  CR: '🇨🇷',
  HR: '🇭🇷',
  CU: '🇨🇺',
  CY: '🇨🇾',
  CZ: '🇨🇿',
  DK: '🇩🇰',
  DJ: '🇩🇯',
  DM: '🇩🇲',
  DO: '🇩🇴',
  EC: '🇪🇨',
  EG: '🇪🇬',
  SV: '🇸🇻',
  GQ: '🇬🇶',
  ER: '🇪🇷',
  EE: '🇪🇪',
  SZ: '🇸🇿',
  ET: '🇪🇹',
  FK: '🇫🇰',
  FO: '🇫🇴',
  FJ: '🇫🇯',
  FI: '🇫🇮',
  FR: '🇫🇷',
  GF: '🇬🇫',
  PF: '🇵🇫',
  TF: '🇹🇫',
  GA: '🇬🇦',
  GM: '🇬🇲',
  GE: '🇬🇪',
  DE: '🇩🇪',
  GH: '🇬🇭',
  GI: '🇬🇮',
  GR: '🇬🇷',
  GL: '🇬🇱',
  GD: '🇬🇩',
  GP: '🇬🇵',
  GU: '🇬🇺',
  GT: '🇬🇹',
  GN: '🇬🇳',
  GW: '🇬🇼',
  GY: '🇬🇾',
  HT: '🇭🇹',
  HM: '🇭🇲',
  VA: '🇻🇦',
  HN: '🇭🇳',
  HK: '🇭🇰',
  HU: '🇭🇺',
  IS: '🇮🇸',
  IN: '🇮🇳',
  ID: '🇮🇩',
  IR: '🇮🇷',
  IQ: '🇮🇶',
  IE: '🇮🇪',
  IL: '🇮🇱',
  IT: '🇮🇹',
  JM: '🇯🇲',
  JP: '🇯🇵',
  JO: '🇯🇴',
  KZ: '🇰🇿',
  KE: '🇰🇪',
  KI: '🇰🇮',
  KP: '🇰🇵',
  KR: '🇰🇷',
  KW: '🇰🇼',
  KG: '🇰🇬',
  LA: '🇱🇦',
  LV: '🇱🇻',
  LB: '🇱🇧',
  LS: '🇱🇸',
  LR: '🇱🇷',
  LY: '🇱🇾',
  LI: '🇱🇮',
  LT: '🇱🇹',
  LU: '🇱🇺',
  MO: '🇲🇴',
  MK: '🇲🇰',
  MG: '🇲🇬',
  MW: '🇲🇼',
  MY: '🇲🇾',
  MV: '🇲🇻',
  ML: '🇲🇱',
  MT: '🇲🇹',
  MH: '🇲🇭',
  MQ: '🇲🇶',
  MR: '🇲🇷',
  MU: '🇲🇺',
  YT: '🇾🇹',
  MX: '🇲🇽',
  FM: '🇫🇲',
  MD: '🇲🇩',
  MC: '🇲🇨',
  MN: '🇲🇳',
  ME: '🇲🇪',
  MS: '🇲🇸',
  MA: '🇲🇦',
  MZ: '🇲🇿',
  MM: '🇲🇲',
  NA: '🇳🇦',
  NR: '🇳🇷',
  NP: '🇳🇵',
  NL: '🇳🇱',
  NC: '🇳🇨',
  NZ: '🇳🇿',
  NI: '🇳🇮',
  NE: '🇳🇪',
  NG: '🇳🇬',
  NU: '🇳🇺',
  NF: '🇳🇫',
  MP: '🇲🇵',
  NO: '🇳🇴',
  OM: '🇴🇲',
  PK: '🇵🇰',
  PW: '🇵🇼',
  PS: '🇵🇸',
  PA: '🇵🇦',
  PG: '🇵🇬',
  PY: '🇵🇾',
  PE: '🇵🇪',
  PH: '🇵🇭',
  PN: '🇵🇳',
  PL: '🇵🇱',
  PT: '🇵🇹',
  PR: '🇵🇷',
  QA: '🇶🇦',
  RE: '🇷🇪',
  RO: '🇷🇴',
  RU: '🇷🇺',
  RW: '🇷🇼',
  BL: '🇧🇱',
  SH: '🇸🇭',
  KN: '🇰🇳',
  LC: '🇱🇨',
  PM: '🇵🇲',
  VC: '🇻🇨',
};

const App: React.FC = () => {
  const [socket, setSocket] = useState<any>(null);
  const [playerName, setPlayerName] = useState('');
  const [playerColor, setPlayerColor] = useState(generateRandomColor());
  const [isJoined, setIsJoined] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameGrid, setGameGrid] = useState<GridSquare[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [winner, setWinner] = useState<Player | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  // Function to generate a random color
  function generateRandomColor(): string {
    let color;
    do {
      color = Math.floor(Math.random() * 1610495).toString(16);
      color = '#' + color.padStart(6, '0'); // Ensure it's 6 digits
    } while (color === '#000000'); // Avoid black color
    return color;
  }

  // Function to refresh the color
  const refreshColor = () => {
    setPlayerColor(generateRandomColor());
  };

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_BACKEND_URL as string);
    setSocket(newSocket);

    newSocket.on(
      'gameState',
      (data: {
        grid: GridSquare[];
        players: Player[];
        timeLeft: number;
        countdown: number | null;
        winner: Player | null;
      }) => {
        setGameGrid(data.grid);
        setPlayers(data.players);
        setTimeLeft(data.timeLeft);
        setCountdown(data.countdown);
        setWinner(data.winner);
      }
    );

    newSocket.on('adminStatus', (status: boolean) => {
      setIsAdmin(status);
      // If user is admin, automatically join the game as admin
      if (status && !isJoined) {
        setPlayerName('Admin');
        setPlayerColor('#000000'); // Black color for admin

        // Delay this slightly to ensure socket is fully connected
        setTimeout(() => {
          newSocket.emit(
            'joinGame',
            { name: 'Admin', color: '#000000', isAdmin: true },
            (response: { success: boolean; message?: string }) => {
              if (response.success) {
                setIsJoined(true);
              }
            }
          );
        }, 500);
      }
    });

    newSocket.on('error', (message) => {
      alert(message);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Add an effect to monitor players and set winner when game ends
  useEffect(() => {
    // If the game is over (timeLeft === 0) and there's no winner yet
    if (timeLeft === 0 && !winner && players.length > 0) {
      // Find the player with the highest score
      const highestScorer = [...players].sort((a, b) => b.score - a.score)[0];

      // If there are no other players except admin, admin wins by default
      const adminPlayer = players.find((player) => player.isAdmin);
      const nonAdminPlayers = players.filter((player) => !player.isAdmin);

      if (nonAdminPlayers.length === 0 && adminPlayer) {
        setWinner(adminPlayer);
      } else {
        setWinner(highestScorer);
      }
    }
  }, [timeLeft, winner, players]);

  const joinGame = () => {
    if (!playerName.trim()) {
      alert('Please enter your name');
      return;
    }

    setLoading(true);
    setJoinError(null);

    // Make sure to pass the selected color when joining
    socket.emit(
      'joinGame',
      {
        name: playerName,
        color: playerColor,
        isAdmin: false, // Explicitly mark as not admin
      },
      (response: { success: boolean; message?: string }) => {
        setLoading(false);
        if (response.success) {
          setIsJoined(true);
        } else {
          setJoinError(response.message || 'Failed to join the game.');
        }
      }
    );
  };

  const claimSquare = (squareId: number) => {
    if (!isJoined || winner) return;
    socket.emit('claimSquare', squareId);
  };

  // Generate grid with 100 squares (10x10)
  const renderGrid = () => {
    const grid = [];
    for (let i = 0; i < 100; i++) {
      const square = gameGrid[i] || {
        id: i,
        color: '#FFFFFF',
        ownerId: '',
        ownerName: '',
      };

      // Highlight admin squares differently if needed
      const isAdminSquare = square.ownerName === 'Admin';

      grid.push(
        <div
          key={i}
          className={`grid-square ${isAdminSquare ? 'admin-square' : ''}`}
          style={{ backgroundColor: square.color }}
          onClick={() => claimSquare(i)}
          title={
            square.ownerName ? `Owned by: ${square.ownerName}` : 'Unclaimed'
          }
        />
      );
    }
    return grid;
  };

  // Render player list with scores and flags
  const renderPlayers = () => {
    return players
      .sort((a, b) => b.score - a.score)
      .map((player) => (
        <div
          key={player.id}
          className={`player-item ${player.isAdmin ? 'admin-player' : ''}`}
        >
          <div
            className="player-color"
            style={{ backgroundColor: player.color }}
          ></div>
          <div className="player-flag">
            {player.country && countryFlags[player.country.code] ? (
              <span title={player.country.name}>
                {countryFlags[player.country.code]}
              </span>
            ) : (
              <span></span>
            )}
          </div>
          <div className="player-name">
            {player.name}
            {player.isAdmin && <span className="admin-label">(Chan)</span>}
            {player.id === socket?.id && !player.isAdmin && (
              <span className="you-label">(You)</span>
            )}
          </div>
          <div className="player-score">{player.score}</div>
        </div>
      ));
  };

  if (!socket) {
    return <div className="loading">Connecting to server...</div>;
  }

  if (!isJoined) {
    return (
      <div className="join-screen">
        <h1>Colour Territory 🚩</h1>
        <div className="game-description">
          <p>Claim as many squares as you can!</p>
          <p>Each game lasts 1 minute.</p>
          <p> Player with the most territory wins.</p>
        </div>
        <div className="join-form">
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={15}
          />
          <div className="color-picker-container">
            <label>Your Color:</label>
            <div
              className="color-preview"
              style={{ backgroundColor: playerColor }}
            ></div>
            <button onClick={refreshColor}>
              <RefreshCw className="icon-width" width={16} height={16} />
            </button>
          </div>
          <button onClick={joinGame} disabled={loading}>
            {loading ? 'Joining...' : 'JOIN GAME'}
          </button>
          {joinError && <div className="error-message">{joinError}</div>}
        </div>
        <div className="active-players">
          <p>Active players: {players.length}</p>
          {players.length > 0 && players.some((p) => p.isAdmin) && (
            <p className="admin-note">
              Admin is always in the game by default.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="game-container">
        <h1 className="title-game-container">Colour Territory 🚩</h1>
        <div className="game-header">
          <div className="timer">
            {countdown !== null ? (
              <div className="countdown">
                New game starting in: {countdown}s
              </div>
            ) : (
              <div>Time left: {timeLeft}s</div>
            )}
          </div>

          <div className="stats">
            <div className="players-count">🟢 Players: {players.length}</div>
            {isAdmin && <div className="admin-badge">Admin</div>}
          </div>
        </div>

        {winner && (
          <div
            className="winner-announcement"
            style={{ borderColor: winner.color }}
          >
            <h2>Game Over!</h2>
            <div className="winner-info">
              {winner.country && countryFlags[winner.country.code] ? (
                <span title={winner.country.name}>
                  {countryFlags[winner.country.code]}
                </span>
              ) : (
                <span></span>
              )}
              <p style={{ color: winner.color }}>
                {winner.name} wins with {winner.score} squares!
                {winner.isAdmin &&
                  players.length === 1 &&
                  ' (Default win as only player)'}
              </p>
            </div>
          </div>
        )}

        <div className="game-content">
          <div className="grid-container">{renderGrid()}</div>

          <div className="sidebar">
            <h3>Players</h3>
            <div className="player-list">
              <div className="player-header">
                <div className="player-color"></div>
                <div className="player-flag"></div>
                <div className="player-name">Name</div>
                <div className="player-score">Score</div>
              </div>
              {renderPlayers()}
            </div>

            <div className="game-instructions">
              <h4>How to Play</h4>
              <p>Click on any square to claim it with your color.</p>
              <p>
                The player with the most squares at the end of the round wins!
              </p>
              <p className="note">
                Note: The admin (black) always controls the first square and
                will win by default if no other players join.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;

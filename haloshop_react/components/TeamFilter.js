import React from 'react';

const TeamFilter = ({ teams, selectedTeam, onSelectTeam }) => {
  return (
    <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
      {teams.map(team => (
        <div
          key={team.id}
          onClick={() => onSelectTeam(team.id)} // 🔥 클릭 시 팀 필터 적용
          style={{
            border: selectedTeam === team.id ? '2px solid #c8102e' : '2px solid transparent',
            borderRadius: '50%',
            padding: '5px',
            cursor: 'pointer',
            transition: 'border 0.3s'
          }}
        >
          <img
            src={team.logoUrl}
            alt={team.name}
            style={{ width: '50px', height: '50px', borderRadius: '50%' }}
          />
        </div>
      ))}
    </div>
  );
};

export default TeamFilter;

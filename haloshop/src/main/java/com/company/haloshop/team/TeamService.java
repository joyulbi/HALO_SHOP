package com.company.haloshop.team;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class TeamService {

    private final TeamMapper teamMapper;

    public TeamService(TeamMapper teamMapper) {
        this.teamMapper = teamMapper;
    }

    public Team createTeam(String name) {
        Team team = new Team();
        team.setName(name);
        teamMapper.insertTeam(team);
        return team; // id가 세팅된 상태로 반환됨
    }

    public Team getTeam(Long id) {
        return teamMapper.findById(id);
    }

    public List<Team> getAllTeams() {
        return teamMapper.findAllTeam();
    }

    public void updateTeam(Long id, String name, Boolean active) {
        Map<String, Object> params = new HashMap<>();
        params.put("id", id);
        if (name != null) params.put("name", name);
        if (active != null) params.put("active", active);

        teamMapper.updateTeamSelective(params);
    }
}
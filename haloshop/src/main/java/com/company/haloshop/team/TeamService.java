package com.company.haloshop.team;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TeamService {


    private final TeamMapper teamMapper;

    @EventListener(ApplicationReadyEvent.class)
    public void insertInitialTeams() {
        // 기존 데이터가 있는지 확인
        List<Team> teams = teamMapper.findAllTeam();
        if (teams == null || teams.isEmpty()) {
            // 초기 데이터 삽입
            Team[] initialTeams = new Team[] {
                Team.builder().name("기아 타이거즈").active(true).build(),
                Team.builder().name("두산 베어스").active(true).build(),
                Team.builder().name("롯데 자이언츠").active(true).build(),
                Team.builder().name("삼성 라이언즈").active(true).build(),
                Team.builder().name("한화 이글스").active(true).build(),
                Team.builder().name("키움 히어로즈").active(true).build(),
                Team.builder().name("KT 위즈").active(true).build(),
                Team.builder().name("LG 트윈스").active(true).build(),
                Team.builder().name("NC 다이노스").active(true).build(),
                Team.builder().name("SSG 랜더스").active(true).build()
            };

            for (Team team : initialTeams) {
                teamMapper.insertTeam(team);
            }
        }
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
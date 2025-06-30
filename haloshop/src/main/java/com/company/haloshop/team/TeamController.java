package com.company.haloshop.team;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    // 팀 생성
    @PostMapping
    public ResponseEntity<Team> createTeam(@RequestBody TeamRequestDto request) {
        Team created = teamService.createTeam(request.getName());
        return ResponseEntity.ok(created);
    }

    // 전체 팀 조회
    @GetMapping
    public ResponseEntity<List<Team>> getAllTeams() {
        List<Team> teams = teamService.getAllTeams();
        return ResponseEntity.ok(teams);
    }

    // ID로 팀 조회
    @GetMapping("/{id}")
    public ResponseEntity<Team> getTeam(@PathVariable Long id) {
        Team team = teamService.getTeam(id);
        if (team == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(team);
    }

    // 팀 업데이트
    @PatchMapping("/{id}")
    public ResponseEntity<Void> updateTeam(@PathVariable Long id, @RequestBody TeamRequestDto request) {
        teamService.updateTeam(id, request.getName(), request.getActive());
        return ResponseEntity.ok().build();
    }
}

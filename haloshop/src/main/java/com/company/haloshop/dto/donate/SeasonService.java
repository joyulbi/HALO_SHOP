package com.company.haloshop.dto.donate;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.company.haloshop.donate.Season;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SeasonService {

    private final SeasonMapper seasonMapper;

    public List<Season> findAll() {
        return seasonMapper.findAllSeason();
    }

    public Season findById(Long id) {
        return seasonMapper.findById(id);
    }

    @Transactional
    public void create(Season season) {
        seasonMapper.insertSeason(season);
    }

    @Transactional
    public void update(Season season) {
        int updated = seasonMapper.updateSeason(season);
        if (updated == 0) {
            throw new IllegalArgumentException("Update failed, season not found id=" + season.getId());
        }
    }

    @Transactional
    public void delete(Long id) {
        int deleted = seasonMapper.deleteSeason(id);
        if (deleted == 0) {
            throw new IllegalArgumentException("Delete failed, season not found id=" + id);
        }
    }
}

package com.company.haloshop.season;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SeasonService {

    private final SeasonMapper seasonMapper;

    @Transactional
    public int insertSeason(Season season) {
        return seasonMapper.insertSeason(season);
    }

    public List<Season> findAllSeason() {
        return seasonMapper.findAllSeason();
    }

    public Season findById(Long id) {
        return seasonMapper.findById(id);
    }

    @Transactional
    public int updateSeason(Season season) {
        return seasonMapper.updateSeason(season);
    }

    @Transactional
    public int deleteSeason(Long id) {
        return seasonMapper.deleteSeason(id);
    }
}

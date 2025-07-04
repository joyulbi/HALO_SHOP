package com.company.haloshop.season;

public class SeasonDeleteEvent {
    private final Long seasonId;

    public SeasonDeleteEvent(Long seasonId) {
        this.seasonId = seasonId;
    }

    public Long getSeasonId() {
        return seasonId;
    }
}

package com.company.haloshop.season;

public class SeasonCreateEvent {
    private final Season season;

    public SeasonCreateEvent(Season season) {
        this.season = season;
    }

    public Season getSeason() {
        return season;
    }
}

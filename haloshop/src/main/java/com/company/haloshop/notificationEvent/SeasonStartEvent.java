package com.company.haloshop.notificationEvent;

import org.springframework.context.ApplicationEvent;

import com.company.haloshop.season.Season;

public class SeasonStartEvent extends ApplicationEvent {

    private final Season season;

    public SeasonStartEvent(Object source, Season season) {
        super(source);
        this.season = season;
    }

    public Season getSeason() {
        return season;
    }
}
package com.company.haloshop.donate_domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class Season {
	@Id
    @GeneratedValue
	private Long id;
	private String name;
	private LocalDateTime start_date;
	private LocalDateTime end_date;
	
	private Long level_1;
	private Long level_2;
	private Long level_3;
	
	private LocalDateTime createdAt = LocalDateTime.now();

	@OneToMany(mappedBy = "season")
    private List<DonationCampaign> campaigns = new ArrayList<>();
	
	@Builder
	public Season(String name, LocalDateTime start_date, LocalDateTime end_date, Long level_1, Long level_2,
			Long level_3) {
		super();
		this.name = name;
		this.start_date = start_date;
		this.end_date = end_date;
		this.level_1 = level_1;
		this.level_2 = level_2;
		this.level_3 = level_3;
	}
	
	
	
}

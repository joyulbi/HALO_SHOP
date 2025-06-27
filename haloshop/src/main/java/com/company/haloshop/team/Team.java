package com.company.haloshop.team;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.OneToMany;

import com.company.haloshop.donate_domain.DonationCampaign;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class Team {
	private Long id;
	private String name;
	private boolean active = true;
	
	
	@Builder
	public Team(String name, boolean active) {
		super();
		this.name = name;
		this.active = active;
	}
	

    @OneToMany(mappedBy = "team")
    private List<DonationCampaign> campaigns = new ArrayList<>();
}

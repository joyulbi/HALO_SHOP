package com.company.haloshop.team;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import com.company.haloshop.donationcampaign.DonationCampaign;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Team {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(nullable = false)
	private String name;

	@Column(nullable = false, columnDefinition = "TINYINT(1) default 1")
	private Boolean active;
	
	
	@Builder
	public Team(String name, Boolean active) {
	    this.name = name;
	    this.active = (active != null) ? active : true;
	}
	

    @OneToMany(mappedBy = "team")
    private List<DonationCampaign> campaigns = new ArrayList<>();
    
}

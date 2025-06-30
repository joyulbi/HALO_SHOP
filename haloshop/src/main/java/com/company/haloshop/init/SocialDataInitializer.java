package com.company.haloshop.init;

import java.util.Arrays;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.company.haloshop.dto.member.SocialDto;
import com.company.haloshop.member.mapper.SocialMapper;

@Component
public class SocialDataInitializer implements CommandLineRunner {

    private final SocialMapper socialMapper;

    public SocialDataInitializer(SocialMapper socialMapper) {
        this.socialMapper = socialMapper;
    }

    @Override
    public void run(String... args) throws Exception {
        List<SocialDto> defaultSocials = Arrays.asList(
            new SocialDto(1, "none"),
            new SocialDto(2, "google"),
            new SocialDto(3, "kakao"),
            new SocialDto(4, "apple")
        );

        for (SocialDto social : defaultSocials) {
            if (socialMapper.selectById(social.getId()) == null) {
                socialMapper.insertSocial(social);
                System.out.println("Inserted social type: " + social.getSocialType());
            } else {
                System.out.println("Social type already exists: " + social.getSocialType());
            }
        }
    }
}

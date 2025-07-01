package com.company.haloshop.inquiryanswer;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.MapsId;
import javax.persistence.OneToOne;
import javax.persistence.PrePersist;
import javax.persistence.Table;

import com.company.haloshop.inquiry.Inquiry;

import lombok.Data;

@Data
@Entity
@Table(name = "inquiry_answer")
public class InquiryAnswer {

    @Id
    private Long inquiryId;  // PK이자 FK (Inquiry의 PK)

    @OneToOne
    @MapsId  // inquiryId 필드를 PK와 동시에 FK로 사용
    @JoinColumn(name = "inquiry_id")
    private Inquiry inquiry;

    @Column(columnDefinition = "TEXT")
    private String answer;

    private Long accountId; // 답변 작성자 FK

    private LocalDateTime createdAt = LocalDateTime.now();

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}


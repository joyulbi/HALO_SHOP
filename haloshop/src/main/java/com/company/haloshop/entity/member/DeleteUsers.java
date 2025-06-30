package com.company.haloshop.entity.member;

import lombok.*;
import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "deleteusers")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class DeleteUsers {

    @Id
    @Column(name = "account_id")
    private Long accountId;

    @Column(name = "deleted_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date deletedAt;
}

package BackAnt.entity.chatting;

import BackAnt.entity.User;
import BackAnt.entity.chatting.Dm;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class DmMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Dm dm;

    @ManyToOne
    private User user;

    // 새로운 생성자 추가: Dm과 User를 받아서 DmMember 초기화
    public DmMember(Dm dm, User user) {
        this.dm = dm;
        this.user = user;
    }
}
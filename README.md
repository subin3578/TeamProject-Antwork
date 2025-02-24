# AntWork - 그룹웨어 프로젝트

![header](https://capsule-render.vercel.app/api?type=egg&color=gradient&height=250&section=header&text=AntWork%20Project&fontSize=70&fontAlign=50)

## 📖 프로젝트 개요
AntWork는 롯데 그룹의 사내 협업 플랫폼을 현대화하고, 실무 환경과 유사한 경험을 제공하기 위해 설계된 **풀스택 웹 애플리케이션**입니다.  
효율적인 업무 처리를 위한 **전자 결재 시스템**, **실시간 협업**, **데이터 관리** 등 **비즈니스 최적화**를 목표로 합니다.

---

## 🎯 프로젝트 목표
1. **사용자 중심의 그룹웨어 제공**  
   - 직관적이고 반응형 UI/UX 설계.
2. **실시간 협업 기능 강화**  
   - 채팅, 파일 공유, 일정 관리.
3. **확장 가능한 시스템 설계**  
   - 현대적 기술 스택을 활용하여 유연한 구조 구축.
---

## 🧑‍💻 담당 기능

- 실시간 공유 문서 **페이지**

   - 페이지 생성 및 실시간 수정
   - 페이지 삭제 및 복구
   - 페이지 협업자 추가 및 권한 부여
   - 페이지 협업자 권한 수정 및 삭제
   - 페이지 템플릿 생성 및 사용

- 랜딩 페이지 **문의하기 (CS)**
- 전체 **디자인 기획 및 레이아웃 구현**

 **📄 페이지** </br>

<img src="https://private-user-images.githubusercontent.com/174754200/412234175-53456f8f-f65a-4478-9b28-69273bfa7213.gif?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NDAzODIxOTksIm5iZiI6MTc0MDM4MTg5OSwicGF0aCI6Ii8xNzQ3NTQyMDAvNDEyMjM0MTc1LTUzNDU2ZjhmLWY2NWEtNDQ3OC05YjI4LTY5MjczYmZhNzIxMy5naWY_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUwMjI0JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MDIyNFQwNzI0NTlaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT02MWMwZWQzZDcxZDA2MmEwYTczNDkwNTdkMWJkMTgxMmMxODBjYjU5MjNmMGQyMTE4NTljMzIyZWRhZDk2Yjg1JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.E3yWnp5uv3LuuHgvDxs4sK5kQ6GRiQdqFpq-dWzMqtY">

 **🙋‍♂️ 문의하기** </br>
<img src = "https://github.com/user-attachments/assets/cd103be1-2cee-40b7-b1a9-8361fc475d7d">



## 🎥 기능 시연
[시연 영상 바로가기](https://www.youtube.com/watch?v=awnQofAVuoo)

---

## 📝 Trouble Shooting

### 📄 페이지 - 실시간 공유문서


### 1. 실시간 반영 (웹소켓 이용)

- **문제1** : 수정하고 있는 페이지에서도 수정 사항 반영
    
    <aside>
    💡
    
    - 상황: 수정하고 있는 페이지에서도 수정사항이 화면에 반영되어 원할한 수정 어려움
    - 최종 해결방안
        - 랜덤한 uuid를 생성하여 웹 소켓 메시지를 쏠 때 함께 넣어 함께 보내줌
        - 방송 받은 uuid 와 현재 페이지의 uuid를 비교하여 같을 땐 화면에 반영하지 않음
            
            ⇒ 이 때, uuid 생성 시점때문에 null로 보내지는 문제 발생 : 초기 값 자체를 uuid로 부여하여 해결
            
            ```jsx
            const generateUUID = () => {
              return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
                const r = (Math.random() * 16) | 0;
                const v = c === "x" ? r : (r & 0x3) | 0x8;
                return v.toString(16);
              });
            };  
            
            const [componentId] = useState(() => generateUUID());
            ```
            
        
    
    </aside>
    

- **문제2** : 배포 시 속도 저하
    
    <aside>
    💡
    
    - 상황 : **onChange**로 변화를 감지하여 웹소켓 방송 & DB 저장 구현 후 배포
    - 문제 : 배포시 굉장히 느려짐, 너무 잦은 수정으로 인한 성능 저하
    - 속도 개선을 위한 시도
        - 웹소켓 방송과 DB 저장 로직 분리하여 일정 주기로 DB 저장 
        ⇒ 데이터 무결성에 취약해짐
        - mongo에 저장하는 것을 redis로 저장하고 주기적으로 mongo로 업데이트
            
            ⇒ Redis의 저장속도가 더 빨라서 고안해보았으나 ms단위의 차이이기에 인간인 사용자가 느끼기엔 별다른 차이가 없음
            
    
    ### 최종 해결방안 : **Throttle**을 이용하여 수정사항을 모아서 웹소켓 방송 & DB 저장
    
    ```jsx
      const throttledBroadcast = useThrottle(async (savedData) => {
        console.log("throttledBroadcast - throttle된 브로드캐스트 함수 실행");
        console.log("🔍 componentId", componentId);
        if (stompClientRef.current?.active) {
          const currentId = new URLSearchParams(window.location.search).get("id");
          const message = {
            _id: currentId,
            content: JSON.stringify(savedData),
            componentId: componentId,
            uid: uid,
          };
    
          stompClientRef.current.publish({
            destination: `/app/page/${currentId}`,
            body: JSON.stringify(message),
          });
        }
      }, 500);
    ```
    
    ```jsx
    import { useCallback, useRef } from "react";
    
    export const useThrottle = (callback, delay = 1000) => {
      const lastRun = useRef(Date.now());
      const lastValue = useRef(null);
      const timeoutRef = useRef(null);
    
      return useCallback(
        (...args) => {
          const now = Date.now();
          lastValue.current = args;
    
          if (now - lastRun.current >= delay) {
            // 딜레이 시간이 지났으면 즉시 실행
            callback(...args);
            lastRun.current = now;
    
            // 이전 예약된 타임아웃이 있다면 제거
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
          } else {
            // 이전 예약된 타임아웃이 있다면 제거
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
    
            // 마지막 변경사항을 위한 새로운 타임아웃 설정
            timeoutRef.current = setTimeout(() => {
              callback(...lastValue.current);
              lastRun.current = Date.now();
              timeoutRef.current = null;
            }, delay);
          }
        },
        [callback, delay]
      );
    };
    ```
    
    </aside>
    

### 2. 제목 수정 시 Aside 실시간 반영

- **문제** : 기존의 방송을 이용 ? 새로운 방송 생성
    
    <aside>
    💡
    
    상황 : 제목 수정 시 aside에 실시간 반영을 구현해야 함
    
    문제 : 기존에 사용하던 방송을 이용한다면, 사용자가 모든 페이지 아이디에 대하여 aside에서 구독을 해야하는 상황 또 내용이 바뀔 때마다 방송이 옴
    
    해결 방안 : 제목, 내용 수정 웹소켓 방송을 분리
               제목 수정 시 aside 채널로 방송 
               aside 전용 채널만 구독하도록 구현
    
    </aside>
    

### 3.라이브러리 Editor.js css 커스텀 - react

- **문제** : 라이브러리 자체 디폴트 css 수정
    
    <aside>
    💡
    
    - 문제사항 : 라이브러리 디폴트 css가 존재, 어떻게 수정하나 ?
    - 해결 : 검사 도구에서 해당하는 태그의 class명을 알아낸 후 최상단 Scss 파일에 작성
        
        ```scss
        .pageWrite {
          #editorjs .ce-block__content,
          #editorjs .ce-toolbar__content,
          #editorjs .ce-inline-tool,
          #editorjs .cdx-input,
          #editorjs .cdx-block,
          #editorjs .ce-paragraph,
          #editorjs .ce-list,
          #editorjs .ce-quote,
          #editorjs .cdx-marker {
            font-size: 15px !important;
            line-height: 1.5; /* 가독성을 위해 추가 설정 */
          }
          #editorjs {
            .ce-toolbar__content {
              max-width: 1200px !important;
              width: 100% !important;
            }
            .ce-block__content {
              max-width: 1200px !important;
              width: 100% !important;
            }
          }
        }

        ...
        
    
    </aside>
    

## 🙋‍♂️ 문의하기

### Email 처리 로직으로 인한 응답 지연 - 비동기 처리

<aside>
💡

상황 : 문의하기 답변을 작성하면 해당 문의자에게 이메일이 가는 서비스 구현, 이메일 처리 로직이 끝날 때 까지 사용자에게 응답 지연

문제 : 사용자가 느끼기에 답변한 뒤 2초 뒤  ‘답변이 완료되었습니다’ 가 뜸

해결 : AOP를 통해 핵심 로직(답변 작성)과 부가 로직(이메일 전송)을 구분한 뒤 이메일 전송을 **비동기 처리**하여 메인 응답 흐름과 분리했습니다. 이를 통해 사용자는 빠르게 답변 완료 메시지를 확인할 수 있고, 이메일 전송은 별도의 쓰레드에서 처리되어 시스템 성능을 최적화하였습니다.

```java
@**Aspect**
@Component
@RequiredArgsConstructor
@Log4j2
public class EmailAspect {
    private final EmailService emailService;

    **@Async** // 메인스레드가 아닌 별도스레드에서 비동기로 실행
    @AfterReturning(value = "execution(* BackAnt.service.landing.QnaService.updateAnswer(..))", returning = "response")
    public void sendEmailAfterUpdate(JoinPoint joinPoint, QnaResponseDTO response) {
        Object[] args = joinPoint.getArgs();
        Long id = (Long) args[0];
        String answer = (String) args[1];

        // Qna 정보 활용
        log.info("AOP 실행: id={}, answer={}", id, answer);

        // 이메일 전송 로직
        String targetEmail = response.getEmail(); // QnaResponseDTO에 이메일 필드가 있다고 가정
        String title = "문의내역에 답변이 작성되었습니다.";
        String body =
                "작성하신 문의내역에 답변이 작성되었습니다.\n" +
                        "확인하시겠습니까 ? \n";

        try {
            emailService.sendEmailMessage(targetEmail, title, body);
            log.info("이메일 전송 완료: {}", targetEmail);
        } catch (Exception e) {
            log.error("이메일 전송 실패: {}", targetEmail, e);

        }
    }
}
```

</aside>

---
## 🛠️ 기술 스택

### **Frontend**
- **React**: 사용자 인터페이스 개발.
- **TypeScript**: 코드 안정성과 유지보수성 향상.
- **TailwindCSS**: 빠른 개발과 일관된 스타일링.
- **Redux Toolkit**: 상태 관리.
- **Axios**: 효율적인 API 요청 처리.
- **React Query**: 서버 상태 관리 및 데이터 캐싱.
- **Jest**: UI/UX 테스트.

### **Backend**
- **Node.js**: 비동기 이벤트 기반 서버.
- **Express**: RESTful API 설계.
- **MongoDB**: NoSQL 데이터 저장소.
- **Mongoose**: 데이터베이스 스키마 설계.
- **JWT**: 사용자 인증 및 세션 관리.
- **Socket.IO**: 실시간 통신 (채팅, 알림).
- **PM2**: 프로덕션 서버 프로세스 관리.

### **DevOps & Tools**
- **GitHub Actions**: CI/CD 파이프라인 자동화.
- **AWS EC2**: 서버 배포.
- **Slack**: 팀 커뮤니케이션.
- **Postman**: API 테스트. 
- **Notion & Google Sheets**: 작업 관리와 일정 공유.

---

## 🧑‍💻 팀원 소개
| 이름          | 역할                           | 주요 담당 기능                                 |
|---------------|--------------------------------|-----------------------------------------------|
| **최준혁(팀장)**    | 프로젝트 관리, 관리자 기능, 전자결재 및 유저기능, 백 서버 배포 | 프로젝트 기획 및 계획 수립, 프로젝트 및 일정관리, 로그인/회원가입/약관, 관리자(팝업/알림/결재/부서관리/멤버접근로그), 전자결재(휴가&출장신청), 백 서버 배포 및 관리|
| **황수빈**       | 페이지 기능, 문의하기 기능      | 메인 페이지 기획 및 레이아웃 작업, 페이지 생성/삭제/복구협업자 추가 & 실시간 공유 및 수정, 페이지 템플릿 생성 및 공유, 문의 작성/답변/조회, mongoDB 서버 배포 및 운영|
| **김민희**       | 게시판 기능                    | 게시판 글쓰기/전체목록/페이징, 첨부파일 업로드/다운로드, 글 상세보기/검색/수정/삭제, 댓글입력/수정/삭제/비밀댓글 |
| **정지현**       | 드라이브 기능                  | 드라이브 폴더 생성 및 수정, 드라이브 폴더 삭제/복원, 공유드라이브 구현 |
| **박경림**       | 채팅 기능                      | 채팅 채널 생성/초대/나가기, DM, 채팅 메세지 전송/조회/검색, 채팅 금칙어 설정 및 필터링 |
| **하정훈**       | 캘린더 기능, 유저기능           | 캘린더 일정관리 및 수정 ,아이디&비밀번호 찾기 ,사용자 정보 수정 ,관리자 메인 & 유저 관리 |
| **강은경**       | 프로젝트 기능, 프론트 서버 배포 | 프로젝트 기능 구현, 협업자 추가 & 실시간 공유 및 수정, 프로젝트 설정 기능 구현 , 프론트 서버 배포 및 관리 |

---

## 📅 개발 일정
**2024년 11월 18일 ~ 2024년 12월 27일 (6주)**

1. **11월 3주차**: 요구사항 분석 및 화면 설계
2. **11월 4주차**: 프론트 화면 구현, DB 설계 
3. **12월 1주차**: 사용자 중심 주요 기능 개발
4. **12월 2주차**: 통합 테스트 및 리팩토링
5. **12월 3주차**: 최종 검토 및 배포

---

## 🏗️ 시스템 설계

### **아키텍처**
- **프론트엔드와 백엔드 분리**: React 기반 SPA와 RESTful API 연동.
- **3계층 구조**: Controller, Service, Repository.

---

## 🚀 주요 기능
#### 사용자 기능
- **회원가입/약관**: 관리자 멤버 초대를 통한 이메일로 토큰을 실은 회원가입 링크를 통한 가입, 각종 유효성 검사 진행
- **로그인**: JWT 토큰 인증 방식으로 JwtProvider를 통한 토큰 관리, JwtAuthenticationFilter를 통한 검증 진행 후 AccessToken -> 로컬 스토리지, RefreshToken -> Http-Only 저장 후 Zustand로 인증정보 관리 
- **유저 정보 수정**: 이름, 이메일, 프로필 이미지 등 유저 정보 수정
- **아이디/비밀번호 찾기**: 이메일 인증을 통한 아이디, 비밀번호 찾기 및 재설정 가능 

#### 관리자 기능
- **회원 관리**: 멤버 초대, 직위 변경, 멤버 삭제, 상태별 조회, 비밀번호 초기화
- **팝업 관리**: 팝업 추가, 팝업 수정, 팝업 삭제, 팝업 보기, Redis를 사용한 _일간 안보기 캐싱처리  
- **부서 관리**: 부서 생성, 부서 수정, 부서 내 소속 유저 드래그 앤 드랍으로 부서 이동, 부서 삭제(삭제시 소속 유저 다른 부서 이동)
- **근태 관리**: 유저 출,퇴근 처리, 근태 출력, 검색 및 필터링 기능, 누적시간 확인, 주간 월간별 출력
- **멤버 접근 로그**: Spring AOP 사용 특정 PointCut으로 로그 남길 메서드 지정, Kafka와 MongoDB를 사용한 대규모 데이터 효과적으로 처리
- **알림 관리**: 회사 전체 부서 특정 유저별 알림 전송(웹 소켓을 사용한 실시간 알림 처리), 보낸 알림 히스토리 출력
- **전자 결제**: 결제 상태에 따라 필터링 구분, 결제 승인 및 반려 처리, 결제 담당자는 유저 결제 요청시 웹소켓으로 실시간 알림 구현 
  
#### 게시판 기능
- **글 작성**: 제목, 본문 작성 및 첨부파일 업로드
- **글 수정**: 게시글 편집 가능
- **글 삭제**: 게시글 삭제 
- **댓글 관리**: 댓글 추가/수정/삭제, 비밀댓글 기능 
- **첨부파일 관리**: 파일 업로드/다운로드
- **검색 및 필터링**: 제목, 작성자, 내용별 검색

#### 캘린더 기능
- **일정 추가**: 이벤트 생성, 알림 설정
- **일정 수정**: 일정 수정 및 재할당
- **일정 삭제**: 일정 삭제 및 복구
- **공유 캘린더**: 부서별/팀별 캘린더 공유
- **언어 변경**: 캘린더 내 사용 언어 변경
- **동기화**: FullCalendar API 사용 

#### 드라이브 기능
- **파일 업로드**: 개별 파일 업로드, 대용량 지원
- **파일 다운로드**: 실시간 동기화된 파일 제공
- **폴더 관리**: 폴더 생성/이동/삭제
- **권한 설정**: 읽기/쓰기 권한 관리
- **파일 복구**: 삭제된 파일 복원 기능
- **드라이브 설정**: 휴지통 복원가능 기간 설정

#### 프로젝트 기능
- **프로젝트 생성**: 제목, 목표, 협업자 추가.
- **진행 상태 관리**: Kanban 보드 스타일 상태 변경.
- **문서 관리**: 프로젝트별 문서 첨부 및 공유.
- **멤버 역할 설정**: 멤버별 역할 및 권한 관리.
- **통계**: 프로젝트 진행 상태 통계 제공

#### 페이지 기능
- **페이지 생성**: 템플릿 선택 및 사용자 지정
- **페이지 삭제 및 복구**: 잘못된 페이지 복구 가능
- **공유 템플릿 관리**: 템플릿 생성 및 공유 삭제, 복구
- **공유 페이지**: 공유자 추가해서 공유페이지 추가 및 실시간 동시 수정 가능 문서

  
####  채팅 기능
- **DM (Direct Message)**: 개인 대화 기능
- **그룹 채팅(채널)**: 팀 채팅방 생성
- **파일 공유**: 실시간 파일 전송
- **알림**: 새로운 메시지 알림
- **읽음 확인**: 읽은 메시지 여부 표시

---



## 🤝 질문 및 피드백
- 황수빈 : ghkdtnqls95@naver.com
- **GitHub Issues**: [프로젝트 관련 이슈 보고](https://github.com/subin3578/Antwork)

---

## 💎 배웠던 점
1. **새로운 기술 도입과 적응**  
   - React를 처음 사용하며 컴포넌트 기반 개발의 이점을 이해하고, 상태 관리와 라이프사이클에 대한 개념을 익혔습니다.
   - JWT 인증 및 상태 관리, 토큰 보안 저장 방식(Zustand 사용)을 통해 안전하고 효율적인 인증 시스템 구축 경험을 쌓았습니다.
2. **협업 효율성 증대**  
   - 실시간 채팅, 알림, 파일 공유 기능을 구현하며, 팀원 간의 협업 생산성을 높이는 방법을 배웠습니다.
   - WebSocket과 Redis를 활용해 실시간 데이터를 처리하는 방법과 관련 최적화 기술을 익혔습니다.
3. **효율적인 데이터 관리와 확장성**  
   - MongoDB와 Kafka를 연동해 대규모 데이터를 효과적으로 처리하고 로그를 관리하는 기술을 경험했습니다.
   - 대규모 사용자와 데이터를 처리할 수 있도록 확장 가능한 시스템 설계의 중요성을 깨달았습니다.
3. **DevOps 기술 활용**
   - GitHub Actions를 통해 CI/CD 파이프라인을 자동화하며 배포 프로세스를 단순화했습니다.
4. **팀워크와 협업의 중요성**
   - 역할을 명확히 분배하고 팀원들과의 소통을 통해 프로젝트를 효율적으로 진행하는 방법을 배웠습니다.
   - Notion과 Google Sheets를 사용하여 일정과 작업을 체계적으로 관리하며 협업 도구의 중요성을 실감했습니다.
---

## 🌟 감사합니다!
AntWork 프로젝트에 관심 가져주셔서 감사합니다. 여러분의 피드백은 저희에게 곧 기회가 됩니다.😊

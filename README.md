# testwork

간단한 정적 웹페이지 예제입니다. `index.html`을 브라우저에서 열면 마크다운 문법을 입력하고 실시간 미리보기를 확인할 수 있습니다.

## 실행 방법

```bash
python3 -m http.server 4173
```

그다음 브라우저에서 <http://localhost:4173>로 접속하세요.

## 사용법

왼쪽 입력창에 마크다운을 입력하면 오른쪽 미리보기에 바로 반영됩니다.

### 유튜브 링크 넣기

유튜브 영상은 URL을 한 줄에 단독으로 입력하면 자동으로 영상 플레이어로 표시됩니다.

```markdown
https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

아래처럼 짧은 링크도 사용할 수 있습니다.

```markdown
https://youtu.be/dQw4w9WgXcQ
```

마크다운 링크 문법으로 한 줄 전체를 작성해도 같은 방식으로 임베드됩니다.

```markdown
[영상 보기](https://www.youtube.com/watch?v=dQw4w9WgXcQ)
```

지원 형식: `youtube.com/watch?v=...`, `youtu.be/...`, `youtube.com/embed/...`, `youtube.com/shorts/...`, `youtube.com/live/...`

### 이미지 넣기

이미지는 일반 마크다운 이미지 문법을 사용합니다.

```markdown
![이미지 설명](https://example.com/image.png)
```

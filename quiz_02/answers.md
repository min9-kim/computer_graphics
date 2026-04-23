# Quiz 02 — My Answers

답안 작성 후 "퀴즈 2 채점해줘" 라고 요청하세요.

---

## 객관식

### 문제 1 (1점)
1 




### 문제 2 (1점)
2

### 문제 3 (1점)
3

### 문제 4 (1점)
3

---

## 단답형

### 문제 5 (1점)
- I = I_? + I_? + I_?

### 문제 6 (1점)
- 4가지 광원:
directional light
point light 
sport light 
ambient light 



### 문제 7 (1점)
- 연산 이름:
 divide 


---

## 서술형

### 문제 8 (2점) — Bump Mapping
bump mapping is that change normal vector more detail 
(범프 매핑은 노말벡터가 기존에 3개가 있다면 더 세분화해서 
노말벡터를 사용한다. 돌의 울퉁불퉁한 부분을 표현하는데 사용된다. 
)


---

### 문제 9 (3점) — Texture Mapping Pipeline 4단계
1. Projector function:
   - What it does: 3D 좌표의 값을 UV로 변경한다. 
   - Input → Output: 3D models pixel -> uv vector mapping

2. Corresponder function:
   - What it does: UV가 [0,1] 안에 들어가는지 보고 넘어가면 다시
   사이에 들어가게 특정 알고리즘을 적용한다. 
   - Input → Output:

3. Obtain value:
   - What it does: texture mapping에서 u,v 가 표시하는 값을 
   가져온다.
   - Input → Output:

4. Value transformation:
   - What it does: texture value를 3D에 적용한다.  
   - Input → Output:

---

### 문제 10 (3점) — Orthographic vs Perspective (3 관점)
1. Parallel lines (평행선 거동):
orth: 계속 평행하다.
perspective: vanish  point에 따라 조정된다. 

2. Projection matrix (특히 4번째 행):
orth : 0 0 0 1
perspective: 0 0 -1/d 0 

3. View frustum shape + use case:
   - Orthographic: 직사각형, 설계도처럼 비율이나 크기가 보존되어야
   하는 경우 사용 
   - Perspective: 사다리꼴, 원근감을 살리기 위해 사용 



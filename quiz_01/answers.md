# Quiz 01 — My Answers

답안 작성 후 "퀴즈 1 채점해줘" 라고 요청하세요.

---

## 객관식

### 문제 1 (1점)
2번 

### 문제 2 (1점)
3번 

### 문제 3 (1점)
3

### 문제 4 (1점)
2

---

## 단답형

### 문제 5 (1점)
- point: w = 1
- vector: w = 0

### 문제 6 (1점)
- input: vertexs 
- output: fragments 

### 문제 7 (1점)
- f_r = p / pi(파이)
알베도 / 파이 
---

## 서술형

### 문제 8 (2점) — Tessellation과 LOD
tessellation means divide fragment triangles more smaller. 
By using this method, when some object places far away simple big trianlge. 
but more closer, use more small and detail triangle
(프레그먼트 삼각형을 더욱 세분화하는게 테셀레이션이다.
이 방법을 사용해서 먼 곳에서 볼땐 큰 삼각형으로 단순하게 표현하고 가까이 올수록 디테일하게 표현하기 위해 사용한다. 
)


---

### 문제 9 (3점) — Orthographic vs Perspective
1. Geometric difference (parallel lines):
orthographic didn't consider distance of object. just make some value to zero.

On the other hand, perspective consider distance. 



2. Matrix form (4th row):

orthographic : 0 0 0 1
perspective : 0 0 -x/z (some value) 0 



3. Use case:
orthographic: just project 3D objects to  2D some plane.
perspective: it is like cammera. so this way is more realistic.




---

### 문제 10 (3점) — Texture mapping pipeline 4단계
1. Projector function:
matching (u,v) vector to 3D models pixels value

2. Corresponder function:
mapping pixels. 

3. Obtain value:
get value 

4. Value transformation:
change texture map's pixels to 3D models's pixels. 


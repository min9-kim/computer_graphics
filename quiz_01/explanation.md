# Quiz 01 — 개념 해설 (자세히)

> 각 문제에서 다룬 개념을 **심화 설명**. 단순 정답이 아니라 "왜 그런지"와 "시험에 어떻게 변형되어 나올 수 있는지"까지 다룸.

---

## 📘 문제 1 관련 — Rendering Pipeline 4단계

### 전체 흐름
```
[3D Scene]
    ↓
① Application   ← CPU에서 실행. 충돌 감지, 입력 처리, 애니메이션 로직, draw call 생성
    ↓
② Geometry Processing   ← GPU. 정점(vertex) 단위 작업
    ↓                   │
                        │ substages:
                        │  a) Vertex Shading   (Model→World→View 변환, 조명 계산)
                        │  b) Projection       (Orthographic or Perspective)
                        │  c) Clipping         (View frustum 밖 잘라내기)
                        │  d) Screen Mapping   (NDC → 화면 좌표)
                        │
③ Rasterization  ← 2D 삼각형 → fragment(픽셀 후보)로 변환
    ↓
④ Pixel Processing ← fragment마다 최종 색 결정 (텍스처 샘플링, z-test, blending)
    ↓
[2D Image on screen]
```

### 왜 이 순서인가?
- **Application이 먼저**: CPU에서 "무엇을 그릴지" 결정해 GPU에 보내야 함.
- **Geometry → Rasterization**: 3D 정점을 2D로 먼저 바꿔야 픽셀로 변환 가능.
- **Pixel Processing이 마지막**: 픽셀 단위로 텍스처와 조명을 결합해야 실제 색이 나옴.

### 시험 변형 포인트
- Geometry Processing **substages 순서** 물어볼 수 있음: `Vertex Shading → Projection → Clipping → Screen Mapping`
- "Z-buffering은 어느 stage에서?" → **Pixel Processing**
- "정점 위치 변환은 어디서?" → **Geometry Processing (Vertex Shading)**

---

## 📘 문제 2 관련 — 회전행렬 & 변환 순서

### 회전행렬(Rotation Matrix) R의 성질
| 성질 | 수식 | 의미 |
|------|------|------|
| Orthogonal | RRᵀ = RᵀR = I | 행과 열이 직교 |
| Determinant | det(R) = +1 | 방향 보존 (반사가 아님) |
| 역행렬 | R⁻¹ = Rᵀ | 전치가 곧 역변환 |
| 길이 보존 | ‖Rv‖ = ‖v‖ | 스케일 변화 없음 |
| 각도 보존 | Rv · Rw = v · w | 내적 보존 |

### ⚠️ 변환 합성은 **교환법칙 성립 X** (TR ≠ RT)

**직관적 이해**:
- `T(3,0) → R(90°)`: (1,0) → (4,0) → (0,4)
- `R(90°) → T(3,0)`: (1,0) → (0,1) → (3,1)
- 같은 점인데 결과 다름!

**실전에서의 순서**:
세계 공간에서 물체를 배치할 때 보통 **SRT 순서** (Scale → Rotate → Translate)를 씀.
수식으로는 `M = T·R·S`로 합성하고, 행렬이 **오른쪽부터** 점에 적용된다는 점 기억.
→ 즉 `p' = T·R·S·p` = 먼저 스케일, 그다음 회전, 마지막 이동.

### 시험 변형 포인트
- "역회전을 구하라" → **Rᵀ**
- "M = T·R이고 R은 z축 90° 회전일 때, RTv와 TRv를 비교" (구체 계산 문제)
- "왜 동차좌표 없이는 T와 R을 한 행렬로 합성 못 하는가?" → **평행이동은 선형변환이 아니라서 3×3 행렬로 표현 불가, 동차좌표 4×4로 올려야 T도 행렬 곱으로 표현 가능**

---

## 📘 문제 3 관련 — Shading Models 3가지

### Flat / Gouraud / Phong 한눈에 비교

| 모델 | 조명 계산 위치 | 계산 단위 | 특징 | 단점 |
|------|----------------|-----------|------|------|
| **Flat** | Vertex Shader (폴리곤당 1번) | per-face | 빠름, 각진 모양 | 곡면이 faceted로 보임 |
| **Gouraud** | Vertex Shader | per-vertex | 부드러움 | 삼각형 중앙의 **specular highlight 사라짐** |
| **Phong** | Fragment Shader | per-pixel | 품질 최고 | 연산 비쌈 |

### 핵심 차이: "언제 조명을 계산하는가?"
- **Flat / Gouraud**: Vertex Shader에서 계산 → Rasterizer가 **색상을 보간**해서 각 픽셀에 전달.
- **Phong**: Vertex Shader에서는 **법선(normal)만** 보간되고, Fragment Shader에서 **각 픽셀마다** 조명 계산.

### 왜 Gouraud에서 specular가 사라지나?
Specular highlight는 좁은 영역(삼각형 중앙)에만 뾰족하게 나타나는데, Gouraud는 **정점에만** 조명 계산. 정점에 specular가 없으면 보간해도 중앙에 반영 안 됨.
Phong은 픽셀마다 계산하므로 중앙에서도 반짝임이 살아남.

### 시험 변형 포인트
- "Gouraud shading이 Phong shading보다 빠른 이유" → vertex 수 << pixel 수
- "어떤 경우 Gouraud로 충분한가?" → 큰 삼각형 + 부드러운 diffuse만 있는 표면

---

## 📘 문제 4 관련 — Mipmapping & Aliasing

### Minification 문제
멀리 있는 물체 → 화면에서 작음 → **하나의 픽셀에 여러 texel**이 겹침.
아무 texel이나 샘플링하면 → **aliasing** (지지직, 반짝임, Moiré 패턴).

### Nyquist 샘플링 정리
> 신호의 최고 주파수를 f_max라 할 때, 샘플링 주파수는 **2·f_max 이상**이어야 왜곡 없이 복원 가능.

텍스처를 축소해 렌더링하면 "실제 샘플링 빈도 < Nyquist rate" → aliasing.

### Mipmap
**해결책**: 원본 텍스처에서 **미리 절반·1/4·1/8… 해상도로 다운샘플링한 버전**들을 쌓아둠 (mipmap chain).
```
Level 0:  1024×1024 (원본)
Level 1:   512×512
Level 2:   256×256
Level 3:   128×128
...
```
렌더링 시 **픽셀 커버리지에 맞는 해상도의 mipmap 레벨을 선택** → 한 픽셀당 texel 수가 적정 → aliasing 감소.

### 관련 기법
- **Bilinear filtering**: 같은 mipmap 레벨에서 인접 4 texel 보간
- **Trilinear filtering**: 인접한 두 mipmap 레벨 사이에서도 보간 → 레벨 경계 부드러움
- **Anisotropic filtering**: 시야 각도가 얕을 때 더 정교한 샘플링 (바닥 텍스처 등)

### 시험 변형 포인트
- "Mipmap이 메모리를 얼마나 더 쓰나?" → **약 1.33배** (1 + 1/4 + 1/16 + ... = 4/3)
- "Magnification 시에도 mipmap이 쓰이나?" → 아니, Level 0(원본)만 사용. Mipmap은 minification 전용.

---

## 📘 문제 5 관련 — Homogeneous Coordinates (동차좌표)

### 왜 w를 추가하나?
3D에서 점을 `(x, y, z)`로 쓰면 **평행이동이 행렬 곱으로 표현 안 됨** (선형변환이 아니니까).
`(x, y, z, 1)`로 확장하면:
```
[1  0  0  tx]   [x]   [x + tx]
[0  1  0  ty] · [y] = [y + ty]
[0  0  1  tz]   [z]   [z + tz]
[0  0  0  1 ]   [1]   [  1   ]
```
이제 **T도 4×4 행렬 곱**으로 표현 가능 → Rotation, Scale, Translation을 한 행렬로 합성 가능.

### Point vs Vector
| 종류 | w 값 | 의미 |
|------|------|------|
| **Point** (위치) | **w = 1** | 평행이동 영향 받음 |
| **Vector** (방향) | **w = 0** | 평행이동 영향 **안 받음** (방향은 이동해도 그대로) |

**확인**: 위 T 행렬에 `(vx, vy, vz, 0)`을 곱하면 `(vx, vy, vz, 0)` — translation 성분이 w와 곱해져 0이 되므로 방향은 이동하지 않음.

### Perspective Division (원근 나눗셈)
투영 후 `(x', y', z', w')`가 나오면 최종 NDC 좌표는 **각 성분을 w'로 나눔** `(x'/w', y'/w', z'/w')`.
Orthographic은 w' = 1이라 나눠도 그대로. Perspective는 w' = −z/d가 되므로 **멀수록 작아지는** 효과.

### 시험 변형 포인트
- "Point + Vector의 결과는 무엇?" → **Point** (w = 1 + 0 = 1)
- "Point − Point?" → **Vector** (w = 1 − 1 = 0)
- "Vector + Vector?" → **Vector** (w = 0)

---

## 📘 문제 6 관련 — Rasterization

### 입력 vs 출력
- **입력**: Screen space에서 변환된 **정점(vertex)** + connectivity (어떤 정점들이 삼각형을 이루는지)
- **출력**: **fragment** — 각 픽셀 위치에서 "덮인" 후보 데이터 (screen 좌표, 보간된 속성들: 색상, 법선, UV, depth...)

### Fragment ≠ Pixel
- **Pixel**: 화면의 실제 점. 최종 색이 쓰여짐.
- **Fragment**: 한 픽셀을 덮을 가능성이 있는 **후보**. Z-test/blending을 거쳐야 픽셀이 됨. 하나의 픽셀에 여러 fragment가 생성될 수 있음 (겹친 삼각형들).

### Rasterization 단계 내부
1. **Triangle Setup**: 각 삼각형의 엣지 방정식 계산
2. **Triangle Traversal**: bounding box 스캔하며 각 픽셀 중심이 삼각형 안에 있는지 확인
3. **Attribute Interpolation**: 안에 있으면 정점 속성을 barycentric 좌표로 보간해 fragment 생성

### 시험 변형 포인트
- "Fragment는 반드시 pixel이 되는가?" → **아니다**. Z-test, stencil test, alpha test 통과해야 함.
- "Rasterization 전/후 단계는?" → 전: Geometry Processing (Screen Mapping), 후: Pixel Processing.

---

## 📘 문제 7 관련 — BRDF & Lambertian

### BRDF란?
**B**idirectional **R**eflectance **D**istribution **F**unction
`f_r(ω_i, ω_o)` = "방향 ω_i에서 들어온 빛이 방향 ω_o로 얼마나 반사되는가"의 비율.

### Lambertian (완전 확산)
모든 방향으로 **균등하게** 반사 → f_r은 방향에 무관한 상수.
```
f_r = ρ / π
```
- **ρ (rho)**: **albedo** (반사율). 0~1 사이. 물체 고유의 색/반사도.
- **π**: 반구 전체로 적분했을 때 에너지 보존되도록 만드는 정규화 상수.
  - 반구 적분: `∫ cos θ dω = π` 이므로 ρ/π로 나눠줘야 반사 에너지 ≤ 입사 에너지.

### Rendering Equation과의 연결
한 점에서 반사되는 광량:
```
L_o(ω_o) = ∫ f_r(ω_i, ω_o) · L_i(ω_i) · cos θ_i · dω_i
```
Lambertian이면 f_r = ρ/π 상수라 적분에서 빠져나옴.

### cos θ (N·L) 법칙
표면의 밝기는 **법선과 광 방향 사이 각도의 cos**에 비례 → `I = ρ · L · (N·L)` (정규화 생략한 형태).
이게 **Lambert's cosine law**.

### 시험 변형 포인트
- "왜 π로 나누나?" → 에너지 보존 (반구 적분 정규화)
- "Lambertian은 시점에 의존하는가?" → **아니요**. 그래서 f_r에 ω_o가 안 들어감.
- "Diffuse는 시점 의존 X, Specular는 시점 의존 O" — 이유 설명

---

## 📘 문제 8 관련 — Tessellation & LOD (심화)

### Tessellation이란?
**기하학적 primitive (주로 patch)를 GPU에서 더 작은 삼각형들로 세분화**하는 단계.
- **언제**: Vertex Shader 이후, Geometry Shader 이전. GPU 내부에서 수행.
- **단위**: 정점/삼각형 patch (fragment 아님 — fragment는 한참 뒤 rasterization에서 생김)

### Tessellation 3단계 (DX/OpenGL 기준)
1. **Hull Shader (Tessellation Control Shader)**: 각 patch의 tessellation level(얼마나 잘게 쪼갤지)을 결정.
2. **Tessellator (고정 함수)**: 지정된 level대로 삼각형을 자동 생성.
3. **Domain Shader (Tessellation Evaluation Shader)**: 생성된 각 정점의 실제 위치·법선·UV 계산 (displacement map 적용 등).

### LOD (Level of Detail)
**멀수록 단순, 가까울수록 상세**하게 렌더링 → 성능 최적화.
- **Discrete LOD (전통적)**: 메시 3~4종을 미리 준비 (high/mid/low poly). 거리에 따라 스왑. 메모리 낭비 + "팝핑" 현상.
- **Continuous LOD (tessellation 기반)**: 저해상도 메시 하나만 있고, **GPU가 거리·각도·중요도에 따라 동적으로 tessellation level 조정**. 메모리 적음, 부드러운 전환.

### 왜 중요한가?
- 게임처럼 수천만 정점 렌더링 시 모든 물체를 고해상도로 처리하면 **GPU 병목**.
- 시야에 가까운 것만 상세히, 먼 것은 간략히 → 프레임 레이트 유지.
- Displacement mapping과 결합하면 **지형, 물결, 근접 캐릭터** 디테일에 매우 유용.

### 시험 변형 포인트
- "Tessellation은 rendering pipeline의 어느 단계?" → Geometry Processing 초반 (Vertex Shader 후)
- "LOD와 mipmap의 차이?" → LOD는 **기하(메시) 세분화**, mipmap은 **텍스처 해상도**. 비슷한 철학, 다른 대상.

---

## 📘 문제 9 관련 — Projection 완전 비교

### Orthographic Projection (직교 투영)
```
       | 1  0  0  0 |
P_O =  | 0  1  0  0 |
       | 0  0  0  0 |   ← z를 0으로 (depth 버림, 실제로는 범위 매핑)
       | 0  0  0  1 |
```
- **평행선 → 평행선 유지** (거리에 따라 변하지 않음)
- **크기 보존** (멀든 가깝든 같은 크기로 보임)
- **3D 좌표 → 평면 좌표** (수직 투영)

### Perspective Projection (원근 투영)
```
       | 1  0    0    0 |
P_P =  | 0  1    0    0 |
       | 0  0    1    0 |
       | 0  0  -1/d   0 |   ← w'를 -z/d로 설정
```
(정확한 형태는 near/far plane 포함 시 더 복잡, 수업에서 다룬 간단한 형태 기준)

동차좌표 나눗셈 후:
```
x' = x / (-z/d) = -xd/z
y' = -yd/z
```
→ z가 클수록(멀수록) x', y' 작아짐 → **원근감**.

### 평행선 거동
| 투영 | 평행선 | 소실점 |
|------|--------|--------|
| Orthographic | **평행 유지** | 없음 (infinity) |
| Perspective | **한 점으로 수렴** | **vanishing point** 존재 |

### View Frustum 모양
| 투영 | Frustum 모양 |
|------|--------------|
| Orthographic | **직사각형 박스** |
| Perspective | **잘린 피라미드(frustum)** — 카메라에서 퍼지는 형태 |

### 사용 분야
| 용도 | 선택 |
|------|------|
| CAD, 건축/기계 도면 | **Orthographic** (실제 치수 보존) |
| 2D/아이소메트릭 게임 | **Orthographic** |
| 의료 영상, 기술 일러스트 | **Orthographic** |
| 3D 게임, VR, 영화 | **Perspective** (인간 시각) |
| 일인칭 카메라 | **Perspective** |

### 시험 변형 포인트
- "왜 perspective에서 perspective division이 필요한가?" → 4행이 [0 0 -1/d 0]이라 w'≠1이 되므로 NDC로 가려면 나눠야 함.
- "Orthographic에서 perspective division이 필요한가?" → w'=1이라 나눠도 그대로지만 **형식적으로는 수행**.

---

## 📘 문제 10 관련 — Texture Mapping Pipeline (완전 해설)

> 🎯 여기가 가장 취약했던 부분. 방향성과 각 단계 역할을 정확히 숙지!

### 전체 흐름
```
3D surface point (x, y, z)
        ↓ ① Projector function
(u, v) parameter space (normalized [0, 1])
        ↓ ② Corresponder function
Texture space coordinate (texel 위치)
        ↓ ③ Obtain value
Raw texel value (color, normal, 등)
        ↓ ④ Value transformation
Final used value (조명 결합, 변환 후)
```

### ① Projector Function: 3D → UV
**목적**: 3D 표면 위의 점을 2D UV 파라미터 공간으로 대응.
**주요 방식**:
- **Spherical (구형)**: 점을 가상 구에 투영. 위도·경도 → (u, v). 구체 물체에 적합.
- **Cylindrical (원통형)**: u는 각도(경도), v는 축 방향 높이. 기둥·나무줄기에 적합.
- **Planar (평면형)**: 한 축 방향으로 평행 투영. 벽·바닥에 적합.
- **Cube mapping**: 6면체 각 면에 평면 투영. 하늘상자(skybox)에 씀.

**왜 여러 방식?** 물체 형태에 따라 왜곡이 다름. 평면 투영을 구에 쓰면 극점에서 심하게 늘어짐.

### ② Corresponder Function: UV → Texture space
**목적**: (u, v) 값을 실제 **텍스처 이미지의 픽셀 위치**로 변환. 핵심은 **[0, 1] 범위 밖 처리**.

**Wrap mode 종류**:
| Mode | 동작 | 용도 |
|------|------|------|
| **Repeat** (wrap) | u=1.2 → 0.2로 감쌈 | 타일 반복 (벽돌, 잔디) |
| **Clamp** | u=1.2 → 1.0으로 고정 | 끝 색으로 연장 |
| **Mirror** | u=1.2 → 0.8로 반사 | 대칭 패턴 |
| **Border** | 범위 밖은 지정 색 | 프레임 효과 |

**왜 허용?** 큰 표면에 작은 텍스처를 타일링해 쓰면 메모리 절약 + 반복 패턴 효율.

### ③ Obtain Value: 샘플링
**목적**: 계산된 좌표에서 **texel 값 획득**. 단, 좌표가 정수가 아니므로 **필터링** 필요.

**Filtering 종류**:
- **Nearest**: 가장 가까운 texel 하나 (픽셀화, 빠름)
- **Bilinear**: 인접 4 texel 가중 평균 (부드러움)
- **Trilinear**: Bilinear × 2개 mipmap 레벨 간 보간
- **Anisotropic**: 얕은 시야각에서 타원형 샘플링 (고품질)

여기서 **mipmap 레벨 결정**도 함께 일어남 (minification 시).

### ④ Value Transformation: 후처리
**목적**: 샘플된 raw 값을 **최종 쓰임새에 맞게 변환**.
- **Gamma correction**: sRGB → linear RGB (조명 계산은 선형 공간에서)
- **Normal map**: [0,1]³ → [−1,1]³ 범위 재매핑해 법선 벡터로 사용
- **Displacement map**: 높이값 추출해 기하 변형에 사용
- **조명 결합**: `I_final = T(u,v) · L(lighting)` — 텍스처 색과 조명을 곱함
- **알파 블렌딩**: 알파 채널로 투명도 처리

### 한 문장 요약 (암기용)
> **"3D 점을 UV로 사영(①)하고, [0,1] 밖을 처리해 텍스처 좌표로 바꾸고(②), 그 좌표에서 필터링하며 샘플링(③), 얻은 값을 조명·gamma 등으로 변환(④)."**

### 시험 변형 포인트
- "Projector가 왜 4단계 중 먼저 와야 하나?" → 애초에 UV 좌표가 있어야 뒤 단계 수행 가능.
- "Wrap mode가 왜 필요?" → 타일링 + UV 범위 외부 처리.
- "Bump mapping은 4단계 중 어디에 해당?" → ④ Value transformation (샘플된 height/normal 값을 법선 교란에 사용).
- "Mipmap 선택은 어느 단계?" → ③ Obtain value 내부.

---

## 🎯 마지막 암기 체크리스트

- [ ] Rendering pipeline 4단계 순서 & 각 단계 주요 작업
- [ ] Geometry processing 4 substages 순서
- [ ] 회전행렬 4가지 성질 + TR ≠ RT 이유
- [ ] Flat / Gouraud / Phong 차이와 계산 위치 (V.S. vs F.S.)
- [ ] Mipmap이 해결하는 문제 (aliasing, minification) & 메모리 비용 1.33×
- [ ] Point w=1, Vector w=0, Perspective division 이유
- [ ] Rasterization 입출력 (vertex → fragment)
- [ ] Lambertian BRDF = ρ/π, 왜 π인지
- [ ] Tessellation 3단계 + LOD 연결
- [ ] Ortho vs Persp: 평행선, 4행 matrix, frustum 모양, 용도
- [ ] **Texture pipeline 4단계 — 방향과 역할** 🚨

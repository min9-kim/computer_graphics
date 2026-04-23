# Quiz 02 — 개념 해설 (자세히)

> Quiz 2에서 다룬 개념들의 심화 해설. 특히 **비워둔 문제(5, 10-2, 10-3)** 와 **부분 감점된 개념**을 중심으로 집중 정리.

---

## 📘 문제 1 관련 — Homogeneous Coordinates 산술

### 왜 Point와 Vector를 w로 구분하나?

**문제**: 3D에서 점(위치)과 벡터(방향)는 수학적으로 다른 성질을 가짐.
- **평행이동에 대한 반응**:
  - 점을 (3, 0, 0)만큼 이동 → 점이 움직임
  - 벡터(방향)를 (3, 0, 0)만큼 이동 → **방향은 그대로** (방향에는 위치 개념이 없음)

**해결**: 4번째 좌표 `w`로 구분.

| 종류 | w 값 | Translation 적용 시 |
|------|------|---------------------|
| Point (점) | w = 1 | T·P → 이동됨 |
| Vector (방향) | w = 0 | T·V → 그대로 |

**확인 계산** (T는 tx만큼 x축 이동):
```
Point:  (x, y, z, 1) → T·P = (x+tx, y, z, 1)     ✓ 이동
Vector: (x, y, z, 0) → T·V = (x,    y, z, 0)     ✓ 방향만 유지
```

### 산술 규칙 (w 성분으로 예측 가능)

| 연산 | w 결과 | 의미적 해석 |
|------|--------|-------------|
| **Point − Point** | 1 − 1 = **0** → Vector | 두 점 사이의 **변위 벡터** |
| **Point + Vector** | 1 + 0 = **1** → Point | 점을 방향으로 이동한 **새로운 점** |
| **Vector + Vector** | 0 + 0 = **0** → Vector | 두 방향의 **합성 방향** |
| **Vector − Vector** | 0 − 0 = **0** → Vector | 방향 차 |
| **k · Vector** (스칼라) | 0 | **크기 조절된 방향** |
| **Point + Point** | 1 + 1 = 2 → ??? | **정의되지 않음** (의미 없음) |
| **2 · Point** | 2 | **의미 없음** (점의 "2배"는 뭐?) |

### 실전 예제
**"A에서 B를 향하는 단위 벡터"**:
```
AB = B - A           // Point - Point = Vector (w=0)
AB_hat = AB / |AB|   // 정규화
```

### 시험 변형
- "P + V의 기하학적 의미?" → "점 P를 V 방향으로 이동한 새 점"
- "두 점의 중점(midpoint)은 어떻게?" → `M = A + 0.5·(B − A)` (Point + 0.5·Vector = Point)
- "Affine combination"이란? → Point들의 선형 조합에서 **계수 합이 1일 때만** 의미 있음 (예: 중점은 0.5·A + 0.5·B, 계수 합 = 1).

---

## 📘 문제 2 관련 — Gouraud vs Phong 속도 비교

### Per-vertex vs Per-pixel 연산량

한 프레임에 삼각형 1000개 × 평균 500픽셀 = 500,000 픽셀이라 가정.
삼각형당 정점 3개 (공유되므로 유효 정점 수 ≈ 500~800개).

| 모델 | 조명 계산 횟수 / 프레임 |
|------|-------------------------|
| **Flat** | 1000 (per-face) |
| **Gouraud** | ~800 (per-vertex) |
| **Phong** | 500,000 (per-pixel) |

→ **Phong은 Gouraud보다 수백 ~ 수천 배 더 많은 조명 계산**을 수행. GPU 발전 덕에 지금은 Phong이 기본이지만, 모바일·저사양에서는 여전히 Gouraud 쓸 수 있음.

### 품질 차이 시각화

```
원래 곡면 (고해상도 모델)   ←가장 부드러움

Phong shading
  - 조명: per pixel
  - normal: vertex에서 보간
  - 결과: 거의 완벽한 곡면 표현, specular highlight 선명

Gouraud shading
  - 조명: per vertex
  - 색: vertex에서 fragment로 보간
  - 결과: 부드럽지만 삼각형 중앙 specular highlight 손실

Flat shading
  - 조명: per face (한 번만)
  - 결과: 각 면이 단일 색 → faceted/다각형 티남
```

### 왜 Gouraud에서 Specular가 사라지나? (중요!)
Specular highlight는 좁은 영역에 뾰족하게 집중.
- 삼각형 **정점에** specular가 없으면 (R·V가 0에 가까우면) 정점 색이 어두움.
- 중간(삼각형 중앙)에 하이라이트가 있어야 하는데, Gouraud는 정점 색만 보간하므로 **중앙이 계산되지 않고 어두운 색으로 보간됨**.

### 시험 변형
- "Gouraud는 vertex shader에서, Phong은 어디서 조명 계산?" → **Fragment (Pixel) Shader**
- "큰 삼각형이면 어느 모델이 품질 차이 커짐?" → Phong vs Gouraud 차이 극대화. 큰 삼각형 중앙의 highlight가 Gouraud에서 실종.

---

## 📘 문제 3 관련 — Texture Wrap Modes

### UV가 [0, 1] 밖으로 나갈 때 처리하는 4가지 방식

| Mode | 공식 (u > 1일 때 예시) | 시각적 효과 | 용도 |
|------|--------------------|------------|------|
| **Repeat (Wrap)** | u = frac(u) (소수부만) | 타일 반복 | 벽돌, 잔디 |
| **Clamp** | u = min(max(u, 0), 1) | 경계색 연장 | 로고, 스킨 |
| **Mirror** | u = 1 − frac(u) (홀수 주기) | 대칭 반복 | 대칭 패턴 |
| **Border** | 범위 밖 = 지정 색 | 프레임 효과 | 투명 경계 |

### 구체 예: u = 1.3일 때

| Mode | 결과 u' |
|------|---------|
| Repeat | 0.3 |
| Clamp | 1.0 |
| Mirror | 0.7 (= 1 − 0.3) |
| Border | 테두리 색으로 |

### 시험 변형
- "왜 Repeat mode가 유용?" → **작은 텍스처로 큰 표면 커버**, 메모리 절약.
- "Mirror mode의 이점?" → 경계에서 이음새(seam) 없이 자연스러운 반복.

---

## 📘 문제 4 관련 — Lambert's Cosine Law

### 정의
> 완전 확산(Lambertian) 표면의 밝기는 **표면 법선 N과 광 방향 L 사이 각 θ의 cosine에 비례**한다.
```
I ∝ cos θ = N · L
```
(N, L은 단위 벡터)

### 왜 cos θ인가?
빛이 표면에 **비스듬히** 들어오면 같은 양의 빛이 **더 넓은 면적에 퍼지기 때문**에 단위 면적당 에너지가 줄어듦.

```
수직 입사 (θ=0°):         비스듬 입사 (θ=60°):
│││││ 빛이 좁게 집중         │ │ │ 빛이 넓게 퍼짐
▓▓▓▓▓ 표면                   ▓▓▓▓▓▓▓▓▓▓ 같은 표면
cos(0°) = 1 (100%)          cos(60°) = 0.5 (50%)
```

### cos θ = N · L 인 이유
두 단위 벡터의 내적 정의: `A · B = |A| |B| cos θ = 1 · 1 · cos θ = cos θ`
→ 내적만 계산하면 cos 자동.

### 주의 사항
- **Clamp to 0**: `max(0, N·L)` — 광원이 표면 뒤에 있으면 (N·L < 0) 빛이 안 들어오므로 0으로 고정.
- **Diffuse는 시점 무관**: cos θ에 **V(view vector)가 안 들어감**. 어떤 각도에서 봐도 같은 밝기.

### 전체 Diffuse 공식
```
I_d = k_d · L_color · max(0, N · L)
```
- k_d: 물체의 diffuse 반사율 (color/albedo)
- L_color: 광원 색상/강도

### 시험 변형
- "N·L이 0이면?" → 빛이 표면과 평행 → 밝기 0 (그림자 경계)
- "Specular도 cos θ 법칙?" → **아니다**. Specular는 R·V 또는 N·H 의 **n제곱**.

---

## 📘 문제 5 관련 — Phong Reflection Model (반드시 암기!)

### 공식
```
I_total = I_ambient + I_diffuse + I_specular
```
각 항을 자세히:
```
I_a = k_a · L_a
I_d = k_d · L · max(0, N · L)
I_s = k_s · L · max(0, R · V)^n
```

| 기호 | 의미 |
|------|------|
| `k_a, k_d, k_s` | 재료의 ambient/diffuse/specular 반사율 (색상) |
| `L_a, L` | 환경광 강도 / 광원 강도 |
| `N` | 표면 법선 (단위 벡터) |
| `L` | 광원 방향 (표면 → 광원, 단위 벡터) |
| `R` | 반사 벡터: `R = 2(N·L)N − L` |
| `V` | 시점 방향 (표면 → 카메라, 단위 벡터) |
| `n` | shininess 지수 (값이 클수록 하이라이트 뾰족, 예: 10~200) |

### 각 항의 역할

#### Ambient (환경광)
- **목적**: 간접광(indirect illumination) **근사** — 벽에 반사된 빛, 하늘광 등.
- **특징**: **모든 점에서 동일**. 방향 없음.
- **왜 필요**: Ambient 없으면 빛 안 닿는 그림자 영역이 완전히 검게 됨 → 비현실적.

#### Diffuse (확산반사)
- **목적**: 빛이 표면에서 **모든 방향으로 균등 반사**되는 성분 (Lambertian).
- **특징**: **시점 무관**, N·L에만 의존.
- **직관**: 종이, 무광 페인트처럼.

#### Specular (정반사)
- **목적**: 거울 같은 반사. 광원이 **특정 방향(R)으로 집중 반사**되는 성분.
- **특징**: **시점 의존** (R·V). 시점이 반사 방향과 가까울수록 밝음.
- **shininess n**: 크면 좁고 날카로운 하이라이트 (금속, 유리), 작으면 넓고 부드러운 하이라이트 (플라스틱).

### Blinn-Phong 변형
`R·V` 대신 **half vector H = normalize(L + V)** 사용해 `N·H` 계산:
```
I_s = k_s · L · max(0, N · H)^n
```
- 이유: R 계산보다 H 계산이 약간 빠름. OpenGL/Direct3D 기본값이 Blinn-Phong.

### 시험 변형
- "Ambient만 있으면?" → 모든 점 균일 밝기, 입체감 없음.
- "Diffuse만 있으면?" → 입체감 있지만 반짝임 없음 (무광).
- "Specular exponent n이 크면?" → 반짝임이 좁고 강함 (metal 느낌).
- "Phong과 Blinn-Phong 차이?" → `R·V` vs `N·H`.

---

## 📘 문제 6 관련 — 4가지 광원

### 비교표

| 광원 | 위치 필요? | 방향 필요? | 거리 감쇠? | 특징 | 예시 |
|------|-----------|------------|-----------|------|------|
| **Directional** | ❌ | ✓ | ❌ | 모든 광선이 **평행**. 무한히 먼 광원 근사. | 태양 |
| **Point** | ✓ | ❌ (사방) | ✓ | 한 점에서 **모든 방향**으로 방사. | 전구 |
| **Spot** | ✓ | ✓ | ✓ | **원뿔 형태**로 제한된 방사. | 손전등, 무대 조명 |
| **Ambient** | ❌ | ❌ | ❌ | **방향 없음**, 모든 점 동일 밝기. | 환경광 근사 |

### 수식

#### Directional
- 모든 점에서 `L`이 동일. 예: `L = (0, -1, 0)` (위에서 아래로).

#### Point
- 각 표면점에서 광원까지의 방향: `L = (P_light − P_surface) / |...|`
- 거리 감쇠: `1 / (a + b·d + c·d²)` (상수/선형/이차 감쇠)

#### Spot
- Point와 유사하되, 광원 방향 D와 L의 각도가 원뿔 각도 θ_cutoff 이상이면 강도 0.
- 원뿔 안에서도 부드러운 fall-off 가능 (spot exponent).

#### Ambient
- 단순 상수: `I = k_a · L_a`.

### 시험 변형
- "왜 Directional에 거리 감쇠가 없나?" → **무한히 먼 광원 근사**이므로 물체-광원 거리가 무의미.
- "태양은 정확히 directional인가?" → 이론상 point light지만 너무 멀어 directional로 **근사**.

---

## 📘 문제 7 관련 — Perspective Division

### 무엇을 나누나?
Perspective projection matrix를 적용하면 결과의 w 성분이 **1이 아니게 됨**:
```
P_persp · (x, y, z, 1) = (x', y', z', w')   where w' = -z/d (예시)
```
이 상태는 **clip space**라 부름.

### 나누기 연산
```
(x', y', z', w') → (x'/w', y'/w', z'/w', 1)
```
이걸 **Perspective division** 또는 **homogeneous division**이라고 함.

### 결과 = NDC (Normalized Device Coordinates)
나누고 나면 좌표가 보통 **[−1, +1]³ 범위** (OpenGL 기준)로 정규화됨.
이후 **Screen Mapping**이 NDC를 픽셀 좌표로 변환.

### 왜 이 나눗셈이 원근감을 만드나?
- 먼 점: z 큼 → w' 큼 → x/w'가 **작아짐** → 화면에서 **작게** 보임.
- 가까운 점: z 작음 → w' 작음 → x/w'가 **큼** → 화면에서 **크게** 보임.

### Orthographic에는 왜 불필요?
Orthographic 4행이 `[0 0 0 1]` → w' = 1 → 나눠도 그대로.
(형식적으로는 여전히 수행하지만 값이 안 변함)

### 시험 변형
- "Clip space → NDC 변환은 무엇?" → **Perspective division**
- "w'로 나누는 게 왜 필요해?" → 원근감 생성 (x/w'가 멀수록 작아짐)
- "Hidden surface removal(Z-buffer)은 division 전 vs 후?" → **후** (NDC의 z 값 사용)

---

## 📘 문제 8 관련 — Bump Mapping 완전 해설

### 직관: "인간 뇌는 명암으로 입체감을 판단"
평평한 표면이라도 **명암이 울퉁불퉁하게 변하면** 뇌는 입체적이라고 해석. 이 착시를 활용.

### 조명이 법선에 의존
Phong model의 모든 항이 **법선 N에 직접 의존**:
- Diffuse: `N · L`
- Specular: `(R·V)^n` → R = `2(N·L)N − L` → N 의존
- 즉 **N이 바뀌면 명암도 바뀜**

→ **N만 교란하면 실제 geometry는 평평해도 울퉁불퉁한 명암이 나옴**.

### Bump map vs Normal map
| 종류 | 저장 내용 | 법선 계산 |
|------|-----------|-----------|
| **Bump map (height map)** | 높이값 (grayscale) | 인접 픽셀 높이 차이로 **런타임에 법선 계산** |
| **Normal map** | 법선 벡터 (RGB = XYZ) | **그대로 읽어서 사용** (더 빠름) |

### 절차
1. Bump/Normal map 텍스처 샘플링 → 교란 정보 획득
2. 원래 표면 법선 N을 교란하여 N' 생성
3. 조명 계산 `I = f(N', L, V, ...)` → 울퉁불퉁 명암

### 한계
- **실루엣(윤곽)은 여전히 평평** (진짜 기하가 아니므로)
- 극단적 각도에서는 평평함이 들킴
- 스케일이 커지면 부자연스러움

### 대안: Displacement Mapping
실제로 정점을 height map만큼 이동 → 진짜 기하가 울퉁불퉁해짐. 정점 수가 많아야 함 → **tessellation**과 자주 결합.

### 시험 변형
- "Bump mapping이 실루엣도 바꾸는가?" → **아니요**. Displacement mapping은 바꿈.
- "Bump와 Normal map 차이?" → 저장 형식(높이 vs 벡터).
- "Bump mapping은 texture pipeline 4단계 중 어디?" → **Value transformation** (샘플된 height/normal 값을 법선 교란에 사용).

---

## 📘 문제 9 관련 — Texture Pipeline 재정리 (Input/Output 명시)

```
┌──────────────────────────────────────────────────────────┐
│ Stage              Input              → Output            │
├──────────────────────────────────────────────────────────┤
│ ① Projector        3D point (x,y,z)   → (u, v) ∈ ℝ²      │
│ ② Corresponder     (u, v) ∈ ℝ²        → (u', v') ∈ [0,1] │
│                                         (wrap/clamp 적용) │
│ ③ Obtain value     (u', v')            → texel 값 (RGBA)  │
│                                         (bilinear/mipmap) │
│ ④ Value transform  raw texel           → 최종 사용값      │
│                                         (gamma, 조명결합) │
└──────────────────────────────────────────────────────────┘
```

### 각 단계 상세

#### ① Projector Function
- **Input**: 3D 객체 표면의 점 (x, y, z)
- **Output**: (u, v) 파라미터 좌표 (**범위에 제한 없음**)
- **방식**: Spherical, Cylindrical, Planar, Cube map 등

#### ② Corresponder Function
- **Input**: (u, v) — **[0, 1] 밖일 수 있음**
- **Output**: 실제 텍스처 접근용 좌표 (u', v') ∈ [0, 1]
- **처리**: Repeat(wrap), Clamp, Mirror, Border
- **왜 필요**: 타일링, 적은 텍스처로 넓은 면적 커버

#### ③ Obtain Value (Sampling)
- **Input**: (u', v')
- **Output**: Texel 값 (색상 RGBA, 또는 법선, height 등)
- **필터링**: Nearest / Bilinear / Trilinear / Anisotropic
- **Mipmap 레벨 선택**: minification 시 LOD 계산 → 적절한 mipmap 선택

#### ④ Value Transformation
- **Input**: raw texel 값
- **Output**: 쓸 수 있는 최종 값
- **예시**:
  - sRGB → Linear (gamma correction)
  - Normal map 값 [0,1] → [−1,1] 변환
  - 조명과 결합: `I_final = T(u,v) · L`
  - Height map → bump mapping으로 법선 교란
  - Alpha 처리

### 한 줄 요약
> **"3D 점 → UV로 사영(①), 범위 처리(②), 샘플링(③), 최종 변환(④)"**

---

## 📘 문제 10 관련 — Projection 완전 정리 (재강화)

### 4번째 행 비교 (암기 필수)

```
Orthographic (P_O):          Perspective (P_P):
┌ 1  0  0   0 ┐              ┌ 1  0   0     0 ┐
│ 0  1  0   0 │              │ 0  1   0     0 │
│ 0  0  0   0 │              │ 0  0   1     0 │
└ 0  0  0   1 ┘              └ 0  0  -1/d   0 ┘
  ↑                             ↑
  4행: [0 0 0 1]               4행: [0 0 -1/d 0]
  → w' = 1                     → w' = -z/d
```

### Perspective 4행이 원근을 만드는 원리
```
(x, y, z, 1) · P_P → (x', y', z', -z/d)

Perspective division:
x_ndc = x' / (-z/d) = -x·d/z
y_ndc = y' / (-z/d) = -y·d/z
```
→ z가 크면(멀면) x_ndc가 작아짐 → **원근감**!

### View Frustum

```
Orthographic:                        Perspective:
                                          ⬥ camera
┌───────────────┐ ← far                    / \
│               │                         /   \
│               │                        /     \
│   box volume  │                       /       \
│               │                      /         \
│               │                     / frustum   \
└───────────────┘ ← near              ┌───────────┐ ← far plane
                                      └───────────┘ ← (잘린 피라미드)
모든 단면이 동일 크기 직사각형        단면이 멀수록 커지는 사다리꼴
```

### Use case 정리

| 용도 | Orthographic | Perspective |
|------|-------------|-------------|
| CAD, 건축 도면 | ✅ (크기 보존) | |
| 기계 부품 도면 | ✅ | |
| 의료 영상 | ✅ | |
| 아이소메트릭 게임 | ✅ | |
| 지도 | ✅ | |
| 3D 게임 | | ✅ |
| VR | | ✅ |
| 영화 렌더링 | | ✅ |
| 일인칭 카메라 | | ✅ |

### 시험 변형
- "왜 CAD는 orthographic?" → **실제 치수 보존 필요** (도면에서 부품 크기를 정확히 파악해야 함).
- "왜 게임은 perspective?" → **인간 시각과 같은 깊이감**.
- "직교투영에서도 z값은 저장?" → **예, z-buffer용**으로 저장. 단 최종 2D 좌표는 x, y만 사용.

---

## 🎯 최종 암기 체크리스트 (Quiz 2 기준)

- [ ] 동차좌표 산술: **Point − Point = Vector, Point + Vector = Point**
- [ ] Gouraud는 per-vertex, Phong은 per-pixel → **Gouraud가 훨씬 빠름**
- [ ] Wrap mode 4종: **Repeat / Clamp / Mirror / Border**
- [ ] Lambert's cosine law: **I ∝ N · L** (표면 법선과 광 방향 사이 cos)
- [ ] **Phong model: I = I_a + I_d + I_s** (반드시 암기!)
- [ ] 4가지 광원: **Directional / Point / Spot / Ambient**
- [ ] **Perspective division**: 정확한 용어 기억
- [ ] Bump mapping: **법선 교란 + 조명이 법선 의존 → 명암으로 입체감**
- [ ] Texture pipeline 각 단계의 Input → Output
- [ ] Ortho 4행 `[0 0 0 1]`, Persp 4행 `[0 0 -1/d 0]`
- [ ] Ortho frustum = 박스, Persp frustum = 잘린 피라미드
- [ ] **시험장에서 절대 공란 X** — 부분점수 노리기

---

## 💪 다음 퀴즈 전 공부 권장

1. **5_1_Shading.pdf** 다시 훑기 — Phong model 3항, 4가지 광원
2. **4_1_Transforms.pdf** 다시 훑기 — 동차좌표 산술, projection matrix 4행
3. **6_1_Texturing.pdf** 다시 훑기 — Value transformation 단계의 구체 예시
4. 위 체크리스트의 각 항목에 대해 **입으로 설명**해보기 (output이 시험 답안과 비슷해짐)

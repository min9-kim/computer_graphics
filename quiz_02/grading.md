# Quiz 02 — 채점 결과

## 총점: **7.95 / 15**

> 📉 Quiz 1(10.1) 대비 하락. 하지만 **문제 9(Texture pipeline)는 0.85 → 1.85로 2배 넘게 개선** (핵심 취약점 개선 중). 하락 원인은 **답을 비워둔 문제(5, 10-2, 10-3)** 때문. 모르면 부분적으로라도 쓰자.

| 구분 | 점수 |
|------|------|
| 객관식 (문제 1~4) | 3 / 4 |
| 단답형 (문제 5~7) | 1.5 / 3 |
| 서술형 (문제 8~10) | 3.45 / 8 |
| **합계** | **7.95 / 15** |

---

## 객관식

### 문제 1 (0/1) ❌
- **네 답**: ① Point (w = 1)
- **정답**: **③ Vector (w = 0)**
- **해설**: 동차좌표에서 산술 결과는 **w 값 합산**으로 결정.
  - Point(w=1) − Point(w=1) = w = **0 → Vector** (두 점 사이의 **변위 벡터**)
  - Point + Vector = Point (w=1+0=1)
  - Vector + Vector = Vector (w=0)
  - Point + Point = **정의되지 않음/이상함** (w=2, 보통 안 씀)

### 문제 2 (1/1) ✅
- **네 답**: 2
- **정답**: ② Gouraud computes lighting per vertex, while Phong computes lighting per pixel
- 정점 수 << 픽셀 수 → Gouraud가 훨씬 빠름.

### 문제 3 (1/1) ✅
- **네 답**: 3
- **정답**: ③ Clamp (범위 초과 시 경계값으로 고정)

### 문제 4 (1/1) ✅
- **네 답**: 3
- **정답**: ③ Surface normal (N) and light vector (L)
- **Lambert's cosine law**: `I ∝ cos θ = N · L`

---

## 단답형

### 문제 5 (0/1) ❌
- **네 답**: (비워둠)
- **정답**: **I = I_ambient + I_diffuse + I_specular** (또는 I_a + I_d + I_s)
- Phong reflection model의 가장 기본 공식. 반드시 암기!
- 각 항:
  - **I_a (Ambient)**: 간접광 근사. `I_a = k_a · L_a`
  - **I_d (Diffuse)**: Lambertian. `I_d = k_d · L · max(0, N·L)`
  - **I_s (Specular)**: 반짝이. `I_s = k_s · L · max(0, R·V)^n`

### 문제 6 (1/1) ✅
- **네 답**: directional, point, sport(→spot), ambient
- **정답**: Directional / Point / Spot / Ambient
- "sport" 오타지만 의미 전달됨. ✓

### 문제 7 (0.5/1) ⚠️
- **네 답**: "divide"
- **정답**: **Perspective division** (또는 **homogeneous division**, **"divide by w"**)
- **해설**: 연산 자체는 `(x', y', z', w') → (x'/w', y'/w', z'/w', 1)`. 그냥 "divide"라고 하면 **무엇으로 나누는지(w)**와 **왜 필요한지(원근감)**가 빠짐. 정확한 용어를 써야 시험에서 감점 안 됨.

---

## 서술형

### 문제 8 (0.75 / 2) — Bump Mapping

**네 답 요약**: 노멀벡터를 더 세분화해서 사용. 돌의 울퉁불퉁함 표현.

**감점 사유**:
1. "법선벡터를 세분화한다" → **부정확**. Bump mapping은 법선을 **세분화**하는 게 아니라 **교란(perturb)**한다. 픽셀마다 법선을 **다른 방향으로 약간 틀어주는 것**.
2. **"왜 geometry를 안 바꿔도 울퉁불퉁해 보이나?"** — 이 질문의 핵심 대답이 빠짐.

**모범답안**:
> Bump mapping은 **bump map(또는 normal map/height map)**이라는 보조 텍스처를 사용해, 표면의 **각 픽셀에서 법선 벡터를 교란**하는 기법이다. 실제 mesh의 정점 위치는 그대로지만, 조명 계산 시 사용되는 법선 방향을 다르게 읽어온다.
>
> **왜 geometry를 바꾸지 않아도 울퉁불퉁해 보이는가?**: **조명 계산(특히 diffuse: N·L, specular: R·V)이 법선 벡터에 직접 의존**하기 때문. 법선만 바꿔도 픽셀마다 밝기/그림자가 달라지고, 인간 뇌는 이 명암 패턴을 **입체감**으로 해석한다. 즉 "표면은 평평해도 조명이 울퉁불퉁한 것처럼 반응"하는 것.
>
> 단점: **실루엣(윤곽선)은 여전히 평평**하게 보임 (진짜 기하가 아니니까). 이를 보완한 것이 **displacement mapping** (실제로 정점 위치를 이동).

---

### 문제 9 (1.85 / 3) — Texture Pipeline 🎯 **크게 향상!**

> Quiz 1: 0.85 → Quiz 2: **1.85**. 방향(3D → UV → texture → 최종값)을 제대로 잡음! 👍

#### 9-1. Projector function (0.6 / 0.75)
- **네 답**: "3D 좌표의 값을 UV로 변경. 3D models pixel → uv vector mapping"
- ✅ 방향 정확! (지난 번엔 반대로 썼었음)
- ❗ "3D model pixel"은 애매 — 정확히는 **3D 점(surface point)**. Pixel은 화면 개념.
- 💡 **보강**: "Spherical / Cylindrical / Planar 등 여러 투영 방식이 있다"까지 언급하면 완벽.

#### 9-2. Corresponder function (0.55 / 0.75)
- **네 답**: "UV가 [0,1] 안에 들어가는지 보고, 넘어가면 다시 사이에 들어가게 특정 알고리즘 적용"
- ✅ 핵심 포인트(범위 외부 처리) 잡음.
- ❗ "특정 알고리즘"이 뭔지 구체화 안 됨 → **Wrap / Clamp / Mirror / Border** 4종 명시해야 만점.
- ❗ 출력(Input → Output) 비워둠 → **Input: (u, v) ∈ ℝ, Output: 유효한 텍스처 좌표 (u', v') ∈ [0, 1]**

#### 9-3. Obtain value (0.5 / 0.75)
- **네 답**: "u, v가 표시하는 값을 가져온다"
- ✅ 기본 개념 OK.
- ❗ **필터링**(Nearest/Bilinear/Trilinear/Anisotropic) 및 **mipmap 레벨 선택**이 일어나는 단계라는 점 누락.
- ❗ Input/Output 빈칸 → **Input: 텍스처 좌표, Output: texel 값 (RGBA 등)**

#### 9-4. Value transformation (0.2 / 0.75)
- **네 답**: "texture value를 3D에 적용한다"
- ❌ 너무 모호. "3D에 적용"이 무슨 뜻인지 알 수 없음.
- **모범답안**: 샘플된 값을 **최종 용도에 맞게 수정**.
  - 예: gamma 보정 (sRGB → linear)
  - 예: normal map이면 [0, 1]³ → [−1, 1]³으로 재매핑해 법선 벡터로 사용
  - 예: **조명값과 결합** `I_final = T(u, v) · L`
  - 예: alpha 블렌딩

---

### 문제 10 (0.85 / 3) — Ortho vs Perspective

#### 10-1. Parallel lines (0.85 / 1)
- **네 답**: "orth: 계속 평행하다. perspective: vanish point에 따라 조정된다."
- ✅ Orthographic 정확.
- ⚠️ Perspective는 **"vanishing point로 수렴(converge)한다"** 가 더 정확한 표현. "조정된다"는 모호.

#### 10-2. Projection matrix (0 / 1) ❌
- **네 답**: (비워둠)
- **정답**:
  - **Orthographic 4행**: `[0  0  0  1]` → w' = 1 (분모가 1이라 투영 후 크기 변화 없음)
  - **Perspective 4행**: `[0  0  −1/d  0]` → w' = −z/d (z가 클수록 w'도 커져 나중에 나누면 작아짐 → 원근)
  - **왜 원근감이 생기나?**: perspective division 후 `x/w', y/w'` 계산 → z가 큰(먼) 점은 w'가 커서 x/w' 작아짐 = 멀리 있는 게 작게 보임.

#### 10-3. View frustum + use case (0 / 1) ❌
- **네 답**: (비워둠)
- **정답**:
  - **Orthographic**: 직사각형 박스 형태의 view volume
    - 활용: **CAD, 건축/기계 도면, 아이소메트릭 2D/2.5D 게임, 지도, 의료 영상** (크기 비례 보존 필요)
  - **Perspective**: 잘린 피라미드(frustum) — 카메라에서 퍼지는 형태
    - 활용: **3D 게임, VR, 영화, 일인칭 카메라** (인간 시각 재현)

---

## 📊 Quiz 1 → Quiz 2 비교

| 영역 | Quiz 1 | Quiz 2 | 변화 |
|------|--------|--------|------|
| 객관식 | 3/4 | 3/4 | 같음 (다른 문제에서 틀림: 이번엔 동차좌표 산술) |
| 단답형 | 3/3 | 1.5/3 | ↓ (문제 5 비우고, 문제 7 용어 부정확) |
| Texture pipeline | 0.85 | 1.85 | **✅ +1.0 크게 개선!** |
| Projection 비교 | 1.75 | 0.85 | ↓ (10-2, 10-3 비워둠) |

---

## 🚨 하락 원인 분석

**Quiz 2 점수가 Quiz 1보다 낮은 이유는 "개념을 모르는 것"보다 "답을 비워둔 것"이 더 큼:**

- 문제 5 (Phong 3항): 1점 잃음
- 문제 10-2 (Perspective 4행): 1점 잃음
- 문제 10-3 (Frustum + use case): 1점 잃음

→ **합계 3점**을 그냥 날림. 이 3문제만 부분적으로라도 답했어도 10/15는 나왔을 것.

**시험장에서는 절대 공란 X**. 알고 있는 단어라도 쓰자. (예: "orthographic은 박스, perspective는 피라미드" 정도라도 0.5점은 받을 수 있음)

---

## 🎯 다음 Quiz 3에서 중점 재출제할 것

1. **동차좌표 산술** (Point − Point, Point + Vector 등)
2. **Phong reflection model 공식** (I_a + I_d + I_s + 각 항 공식)
3. **Perspective division 정확한 용어**
4. **Bump mapping이 왜 geometry 안 바꿔도 울퉁불퉁해 보이는지** (조명이 법선에 의존한다는 핵심 이유)
5. **Projection matrix 4번째 행** (구체적 값)
6. **Texture pipeline에서 Value transformation 단계의 구체 예시** (gamma, 조명 결합 등)

---

**총평**: 핵심 취약점(texture pipeline)은 꽤 개선됐음! 하지만 "모르는 건 일단 비워둔다"는 전략은 시험에서 치명적. 다음 퀴즈에서는 모든 칸에 뭐라도 써보자. 부분점수 노리자.

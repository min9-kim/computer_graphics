# Quiz 03 — 채점 결과

## 총점: **5.9 / 15** 😬

| 문제 | 배점 | 획득 | 비고 |
|---|---|---|---|
| 1. Z-buffer 판정 | 1 | **1.0** ✅ |  |
| 2. Backface culling | 1 | **0.0** ❌ | 무답 |
| 3. Fixed-function stage | 1 | **1.0** ✅ |  |
| 4. 4×4 행렬 사용 이유 | 1 | **1.0** ✅ |  |
| 5. Cross product | 1 | **0.0** ❌ | 외적 ≠ 행렬곱 |
| 6. TRS 합성 행렬 | 1 | **0.4** 🟡 | 구조 일부 맞음 |
| 7. Specular 수식 | 1 | **0.0** ❌ | 수식 아님 |
| 8. Normal mapping | 2 | **0.0** ❌ | 무답 |
| 9. Geometry processing 4 sub-stages | 3 | **2.5** 🟡 | 첫 단계 명칭 |
| 10. Texture filtering | 3 | **0.0** ⚠️ | 슬라이드 범위 밖 |

---

## 문제별 채점

### 문제 1 — Z-buffer (1/1) ✅
- **내 답**: 2
- **정답**: ② Color of A, depth = 0.42
- **해설**: "less" 비교에서 더 작은 z가 카메라에 가까움 → A(0.42)가 B(0.67)보다 가까우므로 A가 살아남음. 처리 순서는 무관.

---

### 문제 2 — Backface culling (0/1) ❌
- **내 답**: ?
- **정답**: ① Face normal과 view direction의 dot product 부호
- **해설**: `N · V > 0` (또는 0보다 작은지, convention에 따라) 으로 판단. CCW/CW winding으로 normal 방향이 결정되므로 winding order로도 표현 가능.

---

### 문제 3 — Fixed-function stage (1/1) ✅
- **내 답**: 3
- **정답**: ③ Rasterization (triangle setup, scan conversion, edge equations 생성)
- **해설**: Vertex / Geometry / Fragment / (Tessellation, Compute) shader는 프로그래머블. Rasterization은 GPU 하드웨어가 고정으로 처리.

---

### 문제 4 — 왜 4×4 homogeneous? (1/1) ✅
- **내 답**: 2
- **정답**: ② Translation은 3D에서 linear가 아니라서 3×3 행렬로 표현 불가. Homogeneous 4D로 올리면 단일 행렬곱으로 표현 가능 → 모든 변환을 하나의 행렬로 합성 가능.

---

### 문제 5 — Cross product (0/1) ❌
- **내 답**:
  - Direction: "b → a"
  - Magnitude: "(3×1) × (1×3) → 3×3"
- **정답**:
  - Direction: **a, b 둘 다에 수직** (오른손 법칙으로 a→b 방향). 평면의 normal을 구할 때 사용.
  - Magnitude: **|a||b| sin θ** = a, b가 만드는 평행사변형의 면적
- **해설**: 외적은 행렬곱(matrix multiplication)이 아님. 두 벡터로부터 새 벡터를 만드는 연산이고, 결과는 항상 3차원 벡터(스칼라/행렬 아님). CG에서는 surface normal 계산의 핵심.

---

### 문제 6 — TRS 합성 (0.4/1) 🟡
- **내 답**:
  ```
  2sin   cos   0   1
  cos   -2sin  0   2
  0     0      1   3
  0     0      0   1
  ```
- **정답**: M = T · R · S (column-vector convention, 오른쪽이 먼저 적용)
  - S = diag(2,2,2,1), R = R_z(90°), T = (1,2,3)
  - 일반형 (θ에 대해):
    ```
    2cosθ  -2sinθ   0   1
    2sinθ   2cosθ   0   2
    0       0       2   3
    0       0       0   1
    ```
  - θ=90°이면:
    ```
    0  -2  0  1
    2   0  0  2
    0   0  2  3
    0   0  0  1
    ```
- **부분점수 사유 (+0.4)**:
  - ✅ 4×4 형태, 마지막 열에 translation (1,2,3) 정확
  - ✅ 마지막 행 (0,0,0,1) 정확
  - ✅ 회전+스케일이 sin/cos과 2 결합되는 구조 인지
  - ❌ 행렬 항 위치 잘못 (sin/cos이 swap됨)
  - ❌ Z 스케일이 1 → 2여야 함 (uniform scale 2)
  - ❌ "Scale by 2 → Rotate → Translate" 순서를 식 형태(M=TRS)로 명시 안 함
- **꼭 외워야 할 것**: column vector 규약에서 **"마지막에 적용할 변환을 가장 왼쪽에 곱한다"** → "S 먼저, 그다음 R, 마지막 T" = `M = T · R · S`

---

### 문제 7 — Specular term (0/1) ❌
- **내 답**: "intensity of specular reflection light" (설명만)
- **정답**: 
  $$I_{spec} = k_s \cdot I_L \cdot \max(0, R \cdot V)^n$$
  
  또는 (Blinn-Phong이면) $(N \cdot H)^n$
- **해설**: 문제는 "**수식**(formula)"을 요구. R·V (반사벡터·시점벡터)의 거듭제곱이 핵심. n이 클수록 highlight가 좁고 날카로움.

---

### 문제 8 — Normal mapping (0/2) ❌
- **내 답**: 둘 다 ?
- **정답**:
  - **(1) 저장 내용 (1점)**: 텍스처의 RGB 채널이 **수직 방향(perturbed normal vector) (x, y, z)**을 인코딩. 보통 R→x, G→y, B→z, [-1,1]을 [0,255]로 매핑하므로 평평한 normal (0,0,1)이 RGB(128,128,255)의 푸르스름한 색으로 보임.
  - **(2) 사용 방법 (1점)**: Fragment shader에서 normal map을 샘플링 → 벡터로 디코딩 ([0,1] → [-1,1]) → 이 perturbed normal을 lighting 식 (`N · L`)에 대입 → 실제 mesh의 polygon normal 대신 사용 → 면이 울퉁불퉁한 것처럼 빛이 계산됨.
- **해설**: bump mapping(Quiz 02) → normal mapping은 그 변형. **geometry는 그대로, normal만 픽셀별로 바꾼다**가 핵심.

---

### 문제 9 — Geometry Processing 4 sub-stages (2.5/3) 🟡
- **내 답**:
  1. geometry shading
  2. projection
  3. clipping
  4. screen mapping
- **정답** (Real-Time Rendering 4판 기준):
  1. **Vertex Shading** — model/view 변환, 정점별 lighting/속성 계산
  2. **Projection** — perspective 또는 orthographic projection 적용 (clip space로)
  3. **Clipping** — view frustum 밖의 정점/삼각형 자르기
  4. **Screen Mapping** — NDC → window(screen) coordinates로 매핑
- **부분점수 사유 (+2.5)**:
  - ✅ 순서 완벽
  - ✅ 2,3,4 명칭 정확 → 각 0.75 = **2.25**
  - 🟡 1번 "geometry shading"은 정확히는 **Vertex Shading**. 큰 카테고리("geometry processing 단계 안의 셰이딩")는 맞지만 sub-stage 정식 명칭은 "vertex shading" → 0.25/0.75
- **시험 팁**: 4단계는 영어 이니셜로 외우기 → **V-P-C-S** (Vertex shading → Projection → Clipping → Screen mapping)

---

### 문제 10 — Texture filtering (0/3) ⚠️
- **내 답**: "이건 안 배운 내용 같음"
- **출제자 사과**: 슬라이드 6_1_Texturing.pdf 확인 결과 **mipmapping까지만 명시적으로 다룸**. bilinear/trilinear/anisotropic이라는 명칭은 슬라이드에 직접 나오지 않음. 출제 범위가 살짝 벗어남.
- **하지만** mipmapping(p.33-34)은 명백히 강의 범위이며, 시험에서 "minification 시 aliasing을 어떻게 줄이나?" 류 문제가 나올 가능성 높음.
- **explanation.md에서 정리해줄 테니** 보너스 학습으로 알아두면 도움됨.

---

## 취약 개념 정리 (다음 퀴즈에서 다시 출제)

1. **Backface culling** (Q2 무답) → "어떤 dot product의 부호로 판정?"
2. **Cross product** (Q5 오답) → 외적의 정의/용도/normal 계산
3. **수식 암기** (Q7 오답) → Phong specular, Lambertian diffuse, ambient 모두 형식적 수식 외우기
4. **Normal mapping** (Q8 무답) → bump mapping 변형. RGB가 무엇을 의미하는지
5. **TRS 합성 행렬 손계산** (Q6 부분점수) → 행렬 직접 손으로 곱해보는 연습 필수
6. **Vertex shading 이름** (Q9) → "geometry processing 4 sub-stage" → V-P-C-S 정확 명칭
7. **Mipmapping 원리** (Q10 관련) → minification, aliasing, Nyquist rate

---

## 다음 단계
- 📖 **`explanation.md` 꼭 읽기** — 위 취약 개념 모두 심화 해설 + 시험 변형 포인트
- 🎯 **Quiz 04** 요청하면 위 7개 항목을 다른 각도로 재출제할게

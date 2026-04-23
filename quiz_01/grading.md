# Quiz 01 — 채점 결과

## 총점: **10.1 / 15**

| 구분 | 점수 |
|------|------|
| 객관식 (문제 1~4) | 3 / 4 |
| 단답형 (문제 5~7) | 3 / 3 |
| 서술형 (문제 8~10) | 4.1 / 8 |
| **합계** | **10.1 / 15** |

---

## 객관식

### 문제 1 (1/1) ✅
- **네 답**: 2번
- **정답**: ② Application → Geometry Processing → Rasterization → Pixel Processing
- 정답!

### 문제 2 (0/1) ❌
- **네 답**: 3번
- **정답**: **④** R is always commutative with translation matrices (TR = RT)
- **해설**: 문제는 "회전행렬의 성질이 **아닌** 것"을 묻고 있음.
  - ① 직교성(RRᵀ = I) → 회전행렬의 성질 ✓
  - ② det(R) = 1 → 회전행렬의 성질 ✓
  - ③ R⁻¹ = Rᵀ → 직교행렬이므로 성질 ✓
  - ④ TR = RT → **거짓**. 일반적으로 회전과 평행이동은 교환법칙이 성립하지 **않음** (TR ≠ RT). 이건 변환 순서가 중요한 이유이기도 함.
- 문제를 꼼꼼히 읽자 — "NOT a property"를 놓침.

### 문제 3 (1/1) ✅
- **네 답**: 3번 (Phong shading)
- **정답**: ③ Phong shading
- Phong = per-pixel (fragment shader에서 법선 보간 후 조명 계산)
- Gouraud = per-vertex, Flat = per-face

### 문제 4 (1/1) ✅
- **네 답**: 2번
- **정답**: ② Mipmapping = 사전 필터링된 여러 해상도 텍스처를 저장해 minification 시 aliasing 감소

---

## 단답형

### 문제 5 (1/1) ✅
- **네 답**: point w=1, vector w=0
- **정답**: 완벽!
- 점은 위치(이동 영향 받음), 벡터는 방향(이동 영향 X) — 그래서 w로 구분.

### 문제 6 (1/1) ✅
- **네 답**: input = vertices, output = fragments
- **정답**: 완벽!

### 문제 7 (1/1) ✅
- **네 답**: f_r = ρ/π (albedo / pi)
- **정답**: f_r = ρ/π
- Lambertian BRDF는 입사각·출사각 무관하게 일정 (π는 에너지 보존 위한 정규화).

---

## 서술형

### 문제 8 (1.5 / 2) — Tessellation과 LOD

**네 답 요약**: 삼각형을 더 세분화. 멀면 큰 삼각형, 가까우면 작은 삼각형.

**모범답안**:
> Tessellation은 기하학적 primitive(주로 삼각형 patch)를 더 작은 삼각형으로 **세분화(subdivide)** 하는 GPU 파이프라인 단계이다. LOD(Level of Detail)는 카메라로부터 먼 물체는 거친(coarse) 메시로, 가까운 물체는 세밀한(fine) 메시로 렌더링하는 기법인데, tessellation은 하나의 low-poly mesh를 GPU에서 **거리·중요도에 따라 동적으로 세분화 수준을 조정**할 수 있게 해준다. 따라서 메모리·전송 비용은 낮게 유지하면서도 가까운 물체에서는 고해상도 표현이 가능하다.

**감점 사유 (-0.5)**:
- "fragment triangles" → 정확히는 **primitive/polygon triangles**. Fragment는 rasterization 이후 픽셀 단위로 생긴 것이고, tessellation은 geometry 단계(fragment 생기기 전)에서 일어남. 용어 주의!
- LOD가 왜 좋은지 ("리소스 절감" 자체는 언급했으나 "하나의 저해상도 메시로 GPU가 동적으로 세분화" 라는 포인트 언급하면 더 좋음).

---

### 문제 9 (1.75 / 3) — Orthographic vs Perspective

#### 9-1. Geometric difference (0.5 / 1)
- **네 답**: orthographic은 거리 무시(값을 0으로), perspective는 거리 고려.
- **모범답안**: 문제는 **"평행선이 어떻게 되는가?"**를 묻고 있음.
  - **Orthographic**: 3D에서 평행한 직선은 투영 후에도 **평행**하게 유지됨 (distance와 무관).
  - **Perspective**: 3D에서 평행한 직선은 투영 후 하나의 **소실점(vanishing point)으로 수렴**. 멀수록 작아짐.
- 원근 여부는 맞췄지만 "parallel lines"라는 키 포인트에 직접 답하지 않음. **-0.5**

#### 9-2. Matrix form (0.75 / 1)
- **네 답**: orthographic [0 0 0 1], perspective [0 0 -x/z 0]
- **모범답안**:
  - Orthographic 4행: **[0  0  0  1]** → w' = 1 그대로, perspective division 없음.
  - Perspective 4행: **[0  0  −1/d  0]** (또는 [0 0 −1 0] 형태). → w' = −z/d. 이후 homogeneous 나눗셈으로 (x/w', y/w') 계산하면 **멀수록 작아지는** 원근 효과 발생.
- Orthographic은 완벽. Perspective 표기 "-x/z"는 의미상 비슷하나 정확히는 z 좌표에 작용하는 계수 **−1/d**. **-0.25**

#### 9-3. Use case (0.5 / 1)
- **네 답**: orthographic=단순 2D 투영, perspective=카메라/현실적.
- **모범답안**:
  - **Orthographic**: CAD, 건축/기계 도면, 지도, 의료 영상, 2D 게임(아이소메트릭) — **실제 크기 비례를 보존해야 하는 용도**.
  - **Perspective**: 3D 게임, VR, 가상카메라 렌더링 — **인간 시각처럼 자연스럽게** 보여야 하는 용도.
- Perspective는 OK, Orthographic의 구체적 활용(도면/크기 보존) 언급 부족. **-0.5**

---

### 문제 10 (0.85 / 3) — Texture mapping pipeline 4단계

> ⚠️ 이 문제는 전반적으로 개념을 흐리게 알고 있어 보임. 중점 복습 필요.

#### 10-1. Projector function (0.25 / 0.75)
- **네 답**: "matching (u,v) vector to 3D models pixels value"
- **모범답안**: **3D 객체 공간의 점(x, y, z)을 2D 파라미터 공간(u, v)으로 사영**하는 함수. 종류로 spherical / cylindrical / planar projection이 있음. 방향: **3D → UV** (네 답은 반대 방향으로 썼음).

#### 10-2. Corresponder function (0.1 / 0.75)
- **네 답**: "mapping pixels"
- **모범답안**: (u, v) 파라미터 값을 실제 **texture space의 위치**로 대응시키는 함수. 핵심은 **UV 좌표가 [0, 1] 범위를 벗어났을 때 처리 방식** (wrap/repeat, clamp, mirror 등). 같은 텍스처를 반복 타일링할 수 있게 해줌.

#### 10-3. Obtain value (0.25 / 0.75)
- **네 답**: "get value"
- **모범답안**: 계산된 텍스처 좌표에서 **텍스처 이미지 샘플링** → texel(텍스처 픽셀) 값 획득. 이때 minification/magnification 필터링(bilinear, mipmap trilinear 등) 적용.

#### 10-4. Value transformation (0.25 / 0.75)
- **네 답**: "change texture map's pixels to 3D models's pixels"
- **모범답안**: 샘플된 texel 값을 **최종 색상 계산에 쓰기 좋게 변환**. 예: gamma correction, 조명값과 곱셈(I = T(u,v) · L), normal map이면 [0,1] → [-1,1] 재매핑, 알파 처리 등.

---

## 취약 개념 & 다음 퀴즈 중점 (네가 놓친 부분)

1. **변환 순서 비교환성** (문제 2) — TR ≠ RT. 회전행렬의 성질들 한번 더 정리.
2. **Projection의 평행선 거동** (문제 9-1) — "평행선 유지 vs 소실점 수렴"이 오르쏘/퍼스펙티브의 정의적 차이.
3. **Perspective matrix의 정확한 4행 형태** (문제 9-2) — `[0 0 -1/d 0]`.
4. **Orthographic의 실제 쓰임새** (문제 9-3) — CAD/도면 등 "크기 보존" 관점.
5. **Texture pipeline 4단계 방향과 역할** (문제 10 전체) — 🚨 **가장 취약**. 다음 퀴즈에서 반드시 재출제 예정.
   - Projector: 3D → UV (방향!)
   - Corresponder: UV → texture space + out-of-range 처리
   - Obtain value: 샘플링 + filtering
   - Value transform: 조명결합/gamma 등 후처리

---

**총평**: 객관식/단답형은 거의 완벽 (6/7)! 서술형이 절반 수준인데, 특히 **텍스처 매핑 파이프라인**과 **projection 세부 비교**는 중간고사 단골 주제이니 Ch4(Transforms), Ch6(Texturing) 슬라이드 다시 훑자. "다음 퀴즈" 요청하면 이 취약점 중심으로 다시 출제하겠음.

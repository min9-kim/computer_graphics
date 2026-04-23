# Quiz 03 — 심화 해설

각 문제의 **"왜"** 와 시험에서 변형 출제될 수 있는 형태를 정리.

---

## ① Z-buffer Depth Test (문제 1) ✅

### 동작 원리
Z-buffer는 화면의 모든 픽셀에 대해 "현재 가장 가까운 fragment의 depth"를 저장하는 2D 배열. 새 fragment가 들어올 때마다:

```
if (new_z < zbuffer[x][y])  {     // "less" 비교
    zbuffer[x][y] = new_z;
    framebuffer[x][y] = new_color;
}
```

### 핵심 포인트
- **처리 순서 무관**: 어떤 fragment가 먼저 와도 결과는 같음 (가장 가까운 것만 남으니까)
- **NDC 후의 z**는 보통 [0, 1] 또는 [-1, 1] 범위
- **OpenGL 기본**: `GL_LESS`. 작을수록 가까움. 변경 가능 (`glDepthFunc`)

### ASCII 도식
```
fragment A (z=0.42)  ──┐
                       ├──> Z-buffer 비교 ──> A 살아남음 (더 작은 z)
fragment B (z=0.67)  ──┘
```

### 시험 변형 포인트
- "투명 객체는 왜 Z-buffer로 정렬이 안 되나?" → 뒤 객체가 먼저 그려져야 알파 블렌딩이 정확함
- "early-Z test" / "Hi-Z" 같은 최적화 용어 등장
- depth fighting (z-fighting): 두 면이 거의 같은 depth → 깜빡임

---

## ② Backface Culling (문제 2) ❌

### 정의
삼각형의 normal이 카메라를 등지면 "뒷면"으로 간주하고 그리지 않음 → 렌더링할 삼각형 수 절반 감소.

### 판정식
$$\text{visible} \iff (N \cdot V) < 0$$

(N: face normal, V: view direction = camera → triangle 방향)

또는 winding order 기준:
- **CCW (counter-clockwise)** 정점 순서: 보통 front-face
- **CW (clockwise)**: back-face → cull

### 도식
```
       N (앞면)              N (뒷면)
        ↑                      ↓
    ┌───────┐              ┌───────┐
    │  △  │              │  △  │
    └───────┘              └───────┘
        ↑                      ↑
      camera                 camera
   N·V < 0 → 그림      N·V > 0 → 버림
```

### 왜 가능한가?
대부분의 mesh는 **닫혀 있어서 (closed)** 뒷면은 어차피 앞면에 가려짐 → 안 그려도 결과 동일.

### 시험 변형 포인트
- "투명 객체에 backface culling을 적용하면 왜 문제인가?" → 뒷면이 보여야 함 → 끄거나 양면 렌더링
- "winding order가 CCW/CW 어느 쪽이 front인가?" → API/설정에 따라 다름 (OpenGL 기본 CCW)

---

## ③ Fixed-function vs Programmable (문제 3) ✅

### GPU 파이프라인 구분

| 단계 | 종류 | 비고 |
|---|---|---|
| Vertex Shader | **Programmable** | GLSL/HLSL로 작성 |
| Tessellation | Programmable | DX11+ |
| Geometry Shader | Programmable | 옵션 |
| **Rasterization** | **Fixed-function** | 하드웨어 회로 |
| Fragment Shader | **Programmable** | 픽셀별 로직 |
| Output Merger (depth/blend) | Configurable | 일부 설정만 |

### Rasterization이 fixed인 이유
- Triangle setup (edge equations), scan conversion, attribute interpolation은 매우 정형화된 계산
- 하드웨어로 구현하는 게 압도적으로 빠름
- 프로그래머가 제어해서 좋을 게 거의 없음

### 시험 변형 포인트
- "Compute Shader는 어디 단계인가?" → 파이프라인 밖, GPGPU 용도
- "Tessellation Shader의 역할은?" → patch → 더 많은 정점으로 분할 (LOD)

---

## ④ 왜 4×4 Homogeneous Matrix? (문제 4) ✅

### 핵심 질문
3D 변환에 왜 4D 행렬이 필요한가?

### 답: Translation은 linear가 아님
3×3 행렬로는 회전, 스케일, shear는 표현 가능. 하지만 **translation은 표현 불가**:

$$\text{linear: } f(a + b) = f(a) + f(b), \quad f(c \cdot a) = c \cdot f(a)$$

Translation은 위 조건을 만족하지 않음 → linear map 아님 → 행렬로 표현 불가.

### 해결: Homogeneous coordinates
4D로 한 차원 올리고 마지막 좌표 w=1을 추가:
$$\begin{pmatrix} 1 & 0 & 0 & t_x \\ 0 & 1 & 0 & t_y \\ 0 & 0 & 1 & t_z \\ 0 & 0 & 0 & 1 \end{pmatrix} \begin{pmatrix} x \\ y \\ z \\ 1 \end{pmatrix} = \begin{pmatrix} x + t_x \\ y + t_y \\ z + t_z \\ 1 \end{pmatrix}$$

### 추가 보너스
- **Perspective projection**도 4×4로 표현 가능 (마지막 행이 (0,0,-1,0) 같은 형태)
- **합성**: T·R·S 같이 모든 변환을 하나의 행렬로 미리 곱해놓을 수 있음 → GPU에서 정점 하나당 한 번만 곱

### 시험 변형 포인트
- "Point (w=1)와 Vector (w=0)를 4D로 구분하는 이유" → Vector는 translation에 영향 안 받아야 함. T·v를 계산해보면 w=0이라 t_x, t_y, t_z 항이 사라짐.

---

## ⑤ Cross Product (문제 5) ❌

### 정의
$$\mathbf{a} \times \mathbf{b} = \begin{pmatrix} a_y b_z - a_z b_y \\ a_z b_x - a_x b_z \\ a_x b_y - a_y b_x \end{pmatrix}$$

### 두 가지 핵심 성질
1. **방향**: a, b 둘 다에 **수직**. 오른손 법칙으로 결정.
   - 손바닥을 a에서 b로 휘감으면 엄지가 a×b 방향
   - **a×b = −(b×a)** (반교환적)
2. **크기**: $|\mathbf{a}||\mathbf{b}|\sin\theta$ = a, b가 만드는 평행사변형의 넓이

### CG에서의 용도
1. **Triangle normal 계산**:
   ```
   삼각형 정점 P0, P1, P2
   edge1 = P1 − P0
   edge2 = P2 − P0
   normal = normalize(edge1 × edge2)
   ```
2. **카메라 좌표계 구축** (lookAt 함수):
   - forward = normalize(target − eye)
   - right = forward × up
   - true_up = right × forward
3. **회전 축 찾기**: 두 방향 사이를 회전시키는 축

### 외적 vs 내적 비교
| | Dot (·) | Cross (×) |
|---|---|---|
| 결과 타입 | 스칼라 | 벡터 |
| 수식 | \|a\|\|b\|cosθ | \|a\|\|b\|sinθ × n̂ |
| 교환성 | a·b = b·a | a×b = -b×a |
| 용도 | 각도, projection, lighting (N·L) | normal, area, axis |

### ⚠ 흔한 오해
- 외적은 **행렬곱과 무관**. 행렬 차원 (3×1) × (1×3) 같은 계산은 외적이 아니라 outer product (텐서곱)임.

### 시험 변형 포인트
- "삼각형 (0,0,0), (1,0,0), (0,1,0)의 normal을 구하시오" → 직접 계산
- "왜 lighting에 N·L을 쓰나?" → cosθ로 빛이 표면에 얼마나 비스듬히 들어오는지 → Lambert law

---

## ⑥ Transformation 합성 순서 (문제 6) 🟡

### 가장 중요한 규칙
**Column-vector convention** (`v' = M·v`)에서:
> **"가장 마지막에 적용할 변환을 가장 왼쪽에 곱한다"**

요청: Scale(2) → Rotate(90° Z) → Translate(1,2,3) **이 순서로 적용**
$$\boxed{M = T \cdot R \cdot S}$$

읽는 순서: 오른쪽에서 왼쪽으로. v에 먼저 S, 그다음 R, 마지막 T.

### 손으로 곱해보기
$$S = \begin{pmatrix} 2 & 0 & 0 & 0 \\ 0 & 2 & 0 & 0 \\ 0 & 0 & 2 & 0 \\ 0 & 0 & 0 & 1 \end{pmatrix}, \quad R_z(90°) = \begin{pmatrix} 0 & -1 & 0 & 0 \\ 1 & 0 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{pmatrix}, \quad T = \begin{pmatrix} 1 & 0 & 0 & 1 \\ 0 & 1 & 0 & 2 \\ 0 & 0 & 1 & 3 \\ 0 & 0 & 0 & 1 \end{pmatrix}$$

**Step 1: R · S**
$$R \cdot S = \begin{pmatrix} 0 & -2 & 0 & 0 \\ 2 & 0 & 0 & 0 \\ 0 & 0 & 2 & 0 \\ 0 & 0 & 0 & 1 \end{pmatrix}$$

**Step 2: T · (R · S)**
$$M = \begin{pmatrix} 0 & -2 & 0 & 1 \\ 2 & 0 & 0 & 2 \\ 0 & 0 & 2 & 3 \\ 0 & 0 & 0 & 1 \end{pmatrix}$$

### 검증: 원점 (0,0,0)에 적용
- S: (0,0,0)
- R: (0,0,0)
- T: (1,2,3) ✓ (원점이 translation 위치로 이동해야 함)

### 검증: (1,0,0)에 적용
- S: (2,0,0)
- R(90° Z): (0,2,0) ← x축의 점이 y축으로
- T: (1,4,3) ✓

### ⚠ 비교: Row-vector convention
DirectX 등은 `v' = v · M` 사용 → 순서가 **반대** (`M = S · R · T`). 어느 convention인지 항상 확인.

### 비가환성 (non-commutativity)
**T · R ≠ R · T** (회전 후 평행이동 ≠ 평행이동 후 회전)
- T(1,0,0) 후 R(90°): 점이 (1,0)에 있다가 회전 → (0,1)
- R(90°) 후 T(1,0,0): 점이 회전 → (0,0) → 평행이동 → (1,0)

### 시험 변형 포인트
- "이 순서를 바꾸면 결과 어떻게 다른가?"
- "회전 중심을 (a,b,c)로 옮기려면?" → T(a,b,c) · R · T(-a,-b,-c)

---

## ⑦ Phong Specular (문제 7) ❌

### 전체 Phong 수식
$$I = \underbrace{k_a I_a}_{\text{ambient}} + \underbrace{k_d I_L \max(0, N \cdot L)}_{\text{diffuse}} + \underbrace{k_s I_L \max(0, R \cdot V)^n}_{\text{specular}}$$

### Specular term 핵심
$$I_{spec} = k_s \cdot I_L \cdot (R \cdot V)^n$$

- **R**: 빛의 반사 벡터, $R = 2(N \cdot L)N - L$
- **V**: 시점(viewer) 벡터
- **n (shininess)**: 클수록 highlight가 좁고 날카로움 (n=1 둔함, n=128 거울 같음)

### Blinn-Phong 변형 (자주 같이 출제됨)
$$I_{spec} = k_s \cdot I_L \cdot (N \cdot H)^n, \quad H = \frac{L + V}{|L + V|}$$
- H = halfway vector
- R 계산보다 빠름, OpenGL 기본 모델

### 도식
```
        L     N      R
         \    |    /
          \   |   /
           \  |  /
        ____\_|_/____ surface
              ↑
         반사각 = 입사각
              
   V가 R에 가까울수록 highlight 강함
```

### 시험 변형 포인트
- "n=1과 n=100 차이?" → highlight 크기/날카로움
- "왜 max(0, ...)?" → 음수 cosine 방지 (반대 방향이면 빛 0)
- "Blinn-Phong이 Phong보다 왜 빠른가?" → R 대신 H로 대체, view 방향이 무한대라 가정하면 H를 미리 계산 가능

---

## ⑧ Normal Mapping (문제 8) ❌

### 개념
**Bump mapping의 한 변형**. 각 픽셀마다 "그 픽셀에서 보아야 할 가짜 법선(normal)"을 텍스처에서 직접 읽음.

### Normal map의 RGB
```
RGB = (R, G, B)  →  normal = (R*2−1, G*2−1, B*2−1)
                              [0,1] → [−1,1]
```
- **R 채널**: x 성분
- **G 채널**: y 성분  
- **B 채널**: z 성분 (보통 +z 방향이 표면 바깥)

평평한 (0,0,1) normal은 RGB(128, 128, 255) → 푸른빛 → normal map이 푸르스름하게 보이는 이유.

### Fragment shader 사용 흐름
```
1. Texture coord (u,v)로 normal map 샘플 → RGB
2. RGB를 [-1,1] 벡터로 디코딩 → N_perturbed
3. (옵션) Tangent space → World space 변환 (TBN matrix)
4. Lighting 식에 진짜 mesh normal 대신 N_perturbed 사용
   I_diffuse = k_d * I_L * max(0, N_perturbed · L)
```

### 왜 geometry가 안 변하는데 울퉁불퉁해 보이나?
빛 계산은 normal에 의해 결정됨. normal이 픽셀마다 다르게 바뀌면 같은 평면이라도 빛이 다르게 반사 → 시각적으로 울퉁불퉁.

### Bump map vs Normal map
| | Bump map | Normal map |
|---|---|---|
| 저장값 | 높이(scalar) | normal vector(RGB) |
| 셰이더 계산 | 미분으로 normal 유도 | 직접 사용 |
| 비용 | 약간 비쌈 | 빠름 |
| 정밀도 | 낮음 | 높음 |

### 한계
- 실루엣은 여전히 평면 (외곽선 보면 들통남)
- 그림자 안 만듦 (geometry가 아니니까)
- → 더 발전: **Parallax mapping**, **Displacement mapping** (실제로 정점 이동)

### 시험 변형 포인트
- "Normal map과 displacement map의 차이?" → normal만 / 실제 geometry까지
- "왜 normal map이 푸르게 보이나?" → 평평한 면의 normal=(0,0,1) → RGB(128,128,255)

---

## ⑨ Geometry Processing 4 Sub-stages (문제 9) 🟡

### V-P-C-S 외우기
```
Vertex Shading → Projection → Clipping → Screen Mapping
```

### 각 단계 상세

#### 1. Vertex Shading
- **Input**: 정점 (위치 + 속성: normal, color, UV 등)
- **What**: Model → World → View 변환, 정점별 lighting/속성 계산
- **Output**: View space 정점
- 흔한 변형: 단순 변환만이 아니라 lighting, animation (skinning) 등도 가능

#### 2. Projection
- **Input**: View space 정점
- **What**: Orthographic 또는 Perspective 투영 행렬 적용
- **Output**: Clip space 정점 (4D, w ≠ 1)
- **이후** perspective division (÷w)으로 NDC 진입

#### 3. Clipping
- **Input**: Clip space 정점/삼각형
- **What**: View frustum (절두체) 밖의 부분 제거. 일부만 밖이면 새 정점 생성하여 자름.
- **Output**: 잘린 삼각형
- 최적화: 완전 밖이면 그냥 버림 (frustum culling)

#### 4. Screen Mapping
- **Input**: NDC (Normalized Device Coordinates, [-1,1]³)
- **What**: 화면(window) 좌표로 mapping. 예: NDC (-1,-1) → (0, 0), (1,1) → (width, height)
- **Output**: 픽셀 단위 좌표 (rasterization 입력)

### 흐름 도식
```
[3D model]
   ↓ Vertex Shading (Model→World→View 변환)
[View space]
   ↓ Projection (perspective/ortho)
[Clip space (4D)]
   ↓ Clipping (frustum 잘라내기)
[Clipped triangles]
   ↓ Perspective division (÷w)
[NDC [-1,1]³]
   ↓ Screen Mapping
[Window space (pixel)]
   ↓ → Rasterization
```

### ⚠ 명칭 주의
- "Geometry Shading" ≠ "Vertex Shading"
- Geometry Shader는 Vertex Shader 다음에 오는 별도의 **선택적 programmable stage** (DX10+)
- Sub-stage 1번은 **Vertex Shading**

### 시험 변형 포인트
- 각 단계의 input/output 묻기
- "Clipping이 왜 perspective division 전에 일어나나?" → ÷w 전이 cliping에 더 효율적 (homogeneous space에서 더 안전)
- 전체 4단계 stage 하나도 빠뜨리지 말고 **순서대로** 적기

---

## ⑩ Texture Filtering (문제 10) ⚠️ 보너스

### 슬라이드 범위 정리
교재(6_1_Texturing.pdf)는 **Minification + Mipmapping**까지만 다룸. 아래는 보너스.

### 핵심 구분
| | 상황 | 의미 |
|---|---|---|
| **Magnification** | 1 텍셀이 여러 픽셀로 | 텍스처가 너무 가까움 → blocky |
| **Minification** | 여러 텍셀이 1 픽셀로 | 텍스처가 너무 멈 → aliasing |

### 1. Nearest-neighbor / Bilinear (Magnification 시 주로)
- **Nearest**: 가장 가까운 텍셀 1개 그대로 → blocky/픽셀화
- **Bilinear**: 주변 4개 텍셀의 가중평균 → 부드러움
  ```
  T00 ── T10
   │       │      pixel center에서의 가중치로 4개 보간
   │   x   │
  T01 ── T11
  ```

### 2. Trilinear (Minification + Mipmap)
- **Mipmap**: 텍스처를 미리 ½, ¼, ⅛, ... 해상도로 다운샘플하여 저장 (총 ⅓ 추가 메모리)
- **Bilinear**를 두 mipmap 레벨에서 각각 수행 → 두 결과를 다시 선형 보간
- → 각 픽셀당 8 텍셀 샘플
- mipmap 레벨 사이의 띠(banding)를 부드럽게

### 3. Anisotropic Filtering (왜 필요한가?)
**문제**: trilinear는 픽셀 footprint가 정사각형이라 가정. 하지만 비스듬한 표면(바닥 같은)에서는 footprint가 **길쭉**(anisotropic)함.
```
정사각 가정 (trilinear)         실제 anisotropic
       ┌───┐                      ┌─────────┐
       │ □ │                      │ ▭       │  ← 길쭉
       └───┘                      └─────────┘
```
→ 단순 mipmap은 작은 mipmap을 골라 흐려짐 (도로 멀리가 뿌옇게).

**해결**: anisotropic filtering은 길쭉한 footprint 방향으로 여러 샘플 추출 → 선명도 유지.
- "16x anisotropic" = 최대 16개 샘플
- 게임 그래픽 옵션에서 가장 효과 좋은 옵션 중 하나

### 시험 변형 포인트
- "Mipmap이 왜 ⅓ 추가 메모리만 쓰는가?" → 1 + ¼ + 1/16 + ... = 4/3 → 추가 ⅓
- "Aliasing이란?" → Nyquist rate 미만 sampling → 가짜 패턴 생성 (moiré, jaggies)

---

## 📋 암기 체크리스트 (Quiz 04 출제 예고)

- [ ] Z-buffer "less" 비교의 의미와 처리 순서 무관성
- [ ] Backface culling: **N · V 부호** 또는 **winding order**
- [ ] Rasterization은 **fixed-function** (셰이더 아님)
- [ ] 4D 행렬 쓰는 이유: **translation은 linear가 아님**
- [ ] Cross product: **a×b는 a,b에 수직, 크기 |a||b|sinθ**
- [ ] TRS 합성: **column vector → 마지막 적용을 가장 왼쪽에**, M = T·R·S
- [ ] Phong specular: **k_s · I_L · (R·V)^n**
- [ ] Lambertian diffuse: **k_d · I_L · (N·L)**
- [ ] Normal map RGB → **(x, y, z) normal vector**, fragment shader에서 N 대체
- [ ] Geometry Processing 4 sub-stages: **V-P-C-S**
- [ ] Mipmap: minification 시 aliasing 방지 (보너스로 trilinear, anisotropic)
- [ ] Bump vs Normal vs Displacement mapping의 차이

다음 퀴즈 요청하면 위 체크리스트 중심으로 출제할게! 💪

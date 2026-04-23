# Practice Quiz 02 — Computer Graphics

**총 10문제 / 15점**
- 문제 1~4: 객관식 (각 1점, 총 4점)
- 문제 5~7: 단답형 (각 1점, 총 3점)
- 문제 8~10: 서술형 (2점 / 3점 / 3점, 총 8점)

> Quiz 1에서 취약했던 개념(Texture pipeline, Projection 비교, 변환 순서)을 **다른 각도로** 재출제한 문제 포함.

답은 `answers.md`에 작성하세요.

---

## 객관식 (4문제 × 1점)

### 문제 1 (1점)
In homogeneous coordinates, what is the result of **(Point) − (Point)**?

① Point (w = 1)
② Point (w = 2)
③ Vector (w = 0)
④ Undefined

---

### 문제 2 (1점)
Why is **Gouraud shading** typically faster than **Phong shading**?

① Gouraud uses fewer light sources
② Gouraud computes lighting per vertex, while Phong computes lighting per pixel (fragment)
③ Gouraud skips the specular term entirely
④ Gouraud uses mipmapping to speed up rendering

---

### 문제 3 (1점)
Which texture corresponder (wrap) mode **clamps** UV values outside [0, 1] to the nearest boundary (e.g., u = 1.3 → u = 1.0)?

① Repeat (Wrap)
② Mirror
③ Clamp
④ Border

---

### 문제 4 (1점)
According to **Lambert's cosine law**, the brightness of a diffuse surface is proportional to the cosine of the angle between which two vectors?

① View vector (V) and light vector (L)
② Surface normal (N) and view vector (V)
③ **Surface normal (N) and light vector (L)**
④ Reflection vector (R) and view vector (V)

(위 ③은 힌트가 아니라 보기 항목 중 하나입니다. 스스로 판단해서 고르세요.)

---

## 단답형 (3문제 × 1점)

### 문제 5 (1점)
The Phong reflection model expresses the total reflected intensity as the sum of three components. Name all three.
- I = I_? + I_? + I_?

### 문제 6 (1점)
List the **4 types of light sources** covered in the Shading chapter.
- ?, ?, ?, ?

### 문제 7 (1점)
After a perspective projection matrix is applied, the homogeneous coordinate w is no longer 1. What operation do we perform on (x', y', z', w') to obtain the final Normalized Device Coordinates?
- Name of the operation:

---

## 서술형 (3문제: 2점 / 3점 / 3점)

### 문제 8 (2점) — Bump Mapping
Explain what **bump mapping** is, and explain **why** it can make a surface appear bumpy **without changing the actual geometry** of the mesh.
(1 pt: what bump mapping does / 1 pt: why geometry is not changed — mention what *is* changed instead)

---

### 문제 9 (3점) — Texture Mapping Pipeline (재출제)
Explain the **four stages** of the texture mapping pipeline. For each stage, state:
- **What it does** (role)
- **Input → Output** (what goes in, what comes out)

1. (0.75 pt) Projector function
2. (0.75 pt) Corresponder function
3. (0.75 pt) Obtain value (texture sampling)
4. (0.75 pt) Value transformation

> ⚠️ Quiz 1에서 가장 많이 감점된 주제. 방향(3D → UV → texture space → 최종 값)에 주의.

---

### 문제 10 (3점) — Orthographic vs Perspective (세 관점)
Compare **orthographic projection** and **perspective projection** in the following **three** aspects.

1. (1 pt) **Parallel lines**: What happens to lines that are parallel in 3D after projection (do they stay parallel or converge)?

2. (1 pt) **Projection matrix**: What is the key difference, especially in the **4th row**? Explain why this difference causes the perspective effect.

3. (1 pt) **View frustum shape + use case**: Describe the shape of the view volume for each projection, and give **one concrete application example** for each (e.g., what kind of software/scene uses which).

---

**End of Quiz 02**

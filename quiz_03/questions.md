# Practice Quiz 03 — Computer Graphics

**총 10문제 / 15점**
- 문제 1~4: 객관식 (각 1점, 총 4점)
- 문제 5~7: 단답형 (각 1점, 총 3점)
- 문제 8~10: 서술형 (2점 / 3점 / 3점, 총 8점)

> Quiz 1 & 2에서 아직 깊이 다루지 않은 영역 위주로 출제.
> (Geometry processing 세부 단계, Z-buffer 판정, Backface culling, Transform 합성 순서, Normal mapping, Texture filtering)

답은 `answers.md`에 작성하세요.

---

## 객관식 (4문제 × 1점)

### 문제 1 (1점)
In **Z-buffer depth testing** with the default "less" comparison, suppose two fragments land on the same pixel with depth values `z_A = 0.42` and `z_B = 0.67` (after perspective division, smaller = closer to camera). If fragment A is processed **first**, what does the Z-buffer hold after both fragments are processed?

① Color of B, depth = 0.67
② Color of A, depth = 0.42
③ Color of A blended with B, depth = 0.545
④ Color of B, depth = 0.42

---

### 문제 2 (1점)
**Backface culling** decides whether a triangle is front-facing or back-facing based on:

① The sign of the dot product between the triangle's face normal and the view direction
② The absolute length of the triangle's normal vector
③ The triangle's texture coordinates
④ The number of light sources in the scene

---

### 문제 3 (1점)
Which of the following stages of the rendering pipeline is **NOT** programmable (i.e., it is fixed-function) in a modern GPU?

① Vertex Shader
② Fragment (Pixel) Shader
③ Rasterization (triangle setup / scan conversion)
④ Geometry Shader

---

### 문제 4 (1점)
Why do we represent 3D transformations as **4×4 matrices** using homogeneous coordinates instead of plain 3×3 matrices?

① To make matrix multiplication faster on the GPU
② So that **translation** can be expressed as a single matrix multiplication (translation is not linear in 3D)
③ Because GPUs physically cannot handle 3×3 matrices
④ To support more than 3 RGB color channels

---

## 단답형 (3문제 × 1점)

### 문제 5 (1점)
Given two vectors **a** and **b** on a triangle's surface, what does the **cross product** `a × b` give us (two properties)?
- Direction: ?
- Magnitude: ?

---

### 문제 6 (1점)
You want to apply these transformations to an object, in this order:
1. Scale by 2
2. Rotate 90° about the Z axis
3. Translate by (1, 2, 3)

Write the composite transformation matrix **M** in terms of T, R, S (order matters, column-vector convention `v' = M·v`):
- M = ?

---

### 문제 7 (1점)
Write the **specular term** of the Phong reflection model. Use:
- `R` = reflection vector of light
- `V` = view vector
- `k_s` = specular coefficient
- `n` = shininess exponent
- `I_L` = light intensity

- I_specular = ?

---

## 서술형 (3문제: 2점 / 3점 / 3점)

### 문제 8 (2점) — Normal Mapping
Explain what a **normal map** stores and how it is used during shading.
- (1 pt) What data is stored in a normal map texture? (hint: what do the RGB channels encode?)
- (1 pt) In the fragment shader, how is the sampled normal-map value used to make the surface look bumpy?

---

### 문제 9 (3점) — Geometry Processing Sub-stages
The **Geometry Processing** stage of the rendering pipeline is divided into **4 sub-stages**. List them **in order** and briefly (1 sentence each) describe what each does.

1. (0.75 pt) ?
2. (0.75 pt) ?
3. (0.75 pt) ?
4. (0.75 pt) ?

---

### 문제 10 (3점) — Texture Filtering
Compare the following three texture filtering methods. For each, state **when it is used** (magnification vs. minification) and **how it works** in one sentence.

1. (1 pt) **Nearest-neighbor / Bilinear filtering**
2. (1 pt) **Trilinear filtering** (with mipmaps)
3. (1 pt) **Anisotropic filtering** — why is it needed when trilinear is not enough?

---

**End of Quiz 03**

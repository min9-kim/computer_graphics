# Practice Quiz 01 — Computer Graphics

**총 10문제 / 15점**
- 문제 1~4: 객관식 (각 1점, 총 4점)
- 문제 5~7: 단답형 (각 1점, 총 3점)
- 문제 8~10: 서술형 (2점 / 3점 / 3점, 총 8점)

답은 `answers.md`에 작성하세요.

---

## 객관식 (4문제 × 1점)

### 문제 1 (1점)
Which of the following shows the correct order of the four stages of the rendering pipeline?

① Geometry Processing → Application → Pixel Processing → Rasterization
② Application → Geometry Processing → Rasterization → Pixel Processing
③ Application → Rasterization → Geometry Processing → Pixel Processing
④ Geometry Processing → Rasterization → Application → Pixel Processing

---

### 문제 2 (1점)
Which of the following is **NOT** a property of a 3D rotation matrix R?

① R is orthogonal (RRᵀ = I)
② det(R) = 1
③ R⁻¹ = Rᵀ
④ R is always commutative with translation matrices (TR = RT)

---

### 문제 3 (1점)
In which shading model is the lighting calculation performed **per pixel** using interpolated normals in the fragment shader?

① Flat shading
② Gouraud shading
③ Phong shading
④ Ambient shading

---

### 문제 4 (1점)
What is the main purpose of **mipmapping** in texture mapping?

① To apply bump mapping to a surface
② To store multiple pre-filtered resolutions of a texture to reduce aliasing when minified
③ To wrap UV coordinates outside the [0, 1] range
④ To convert a 3D polygonal mesh into 2D texture coordinates

---

## 단답형 (3문제 × 1점)

### 문제 5 (1점)
In homogeneous coordinates (x, y, z, w), what is the value of **w** for a **point** versus a **vector**?
- point: w = ?
- vector: w = ?

---

### 문제 6 (1점)
State the **input** and **output** of the rasterization stage.
- input: ?
- output: ?

---

### 문제 7 (1점)
Write the formula (BRDF) for a **Lambertian (perfectly diffuse)** surface, where ρ is the albedo.
- f_r = ?

---

## 서술형 (3문제: 2점 / 3점 / 3점)

### 문제 8 (2점)
Explain what **tessellation** is, and why it is useful for **Level of Detail (LOD)** rendering.

---

### 문제 9 (3점)
Compare **orthographic projection** and **perspective projection** in the following three aspects.
Each aspect is worth 1 point.
1. (1 pt) Geometric difference — what happens to parallel lines in 3D after projection?
2. (1 pt) Matrix form — what is the key difference in the projection matrix (especially the 4th row)?
3. (1 pt) Use case — typical applications of each projection.

---

### 문제 10 (3점)
Explain the **four stages** of the texture mapping pipeline in order. Briefly describe what each stage does.
(Each of the 4 stages contributes to the total 3 points — roughly 0.75 points each; partial credit possible.)

1. Projector function
2. Corresponder function
3. Obtain value (texture sampling)
4. Value transformation

---

**End of Quiz 01**

# -*- coding: utf-8 -*-
"""从原始 .blend 导出网页用 GLB。原始工程只读：先复制到工作副本再操作。"""
import bpy, os, sys, json, shutil
from mathutils import Vector, Matrix

ROOT = r"G:\清邑公司"
WORK = os.path.join(ROOT, "site", "public", "models")
TMP  = os.path.join(ROOT, "_recon", "work")
os.makedirs(WORK, exist_ok=True); os.makedirs(TMP, exist_ok=True)
sys.stdout.reconfigure(encoding="utf-8")

def tris_of(o):
    if o.type != 'MESH': return 0
    o.data.calc_loop_triangles(); return len(o.data.loop_triangles)

def descend(o):
    yield o
    for c in o.children:
        yield from descend(c)

def delete_studio():
    kill = [o for o in bpy.data.objects
            if o.name.startswith(("棚_", "灯_")) or o.type in ('CAMERA', 'LIGHT')]
    names = [o.name for o in kill]
    for o in kill: bpy.data.objects.remove(o, do_unlink=True)
    return names

def unhide(objs):
    for o in objs:
        o.hide_viewport = False; o.hide_render = False
        try: o.hide_set(False)
        except Exception: pass

def decimate(o, ratio):
    before = tris_of(o)
    m = o.modifiers.new("web_decimate", 'DECIMATE')
    m.decimate_type = 'COLLAPSE'; m.ratio = ratio
    with bpy.context.temp_override(object=o, active_object=o, selected_editable_objects=[o]):
        bpy.ops.object.modifier_apply(modifier=m.name)
    return before, tris_of(o)

def origin_to_own_center(o):
    if o.type != 'MESH' or not o.data.vertices: return False
    lo = Vector((1e18,)*3); hi = Vector((-1e18,)*3)
    for c in o.bound_box:
        w = o.matrix_world @ Vector(c)
        for i in range(3):
            lo[i] = min(lo[i], w[i]); hi[i] = max(hi[i], w[i])
    C = (lo + hi) / 2
    M = o.matrix_world; R = M.to_3x3(); t = M.translation
    o.data.transform(Matrix.Translation(R.inverted() @ (t - C)))
    if o.parent:
        o.matrix_basis.translation = o.parent.matrix_world.inverted() @ C
    else:
        o.location = C
    return True

def add_root(roots, name, scale):
    root = bpy.data.objects.new(name, None)
    root.empty_display_type = 'PLAIN_AXES'
    bpy.context.scene.collection.objects.link(root)
    root.location = (0, 0, 0)
    for o in roots:
        o.parent = root
        o.matrix_parent_inverse = root.matrix_world.inverted()
    root.scale = (scale, scale, scale)
    bpy.context.view_layer.update()
    return root

def fix_names():
    n = 0
    for o in bpy.data.objects:
        if "." in o.name:
            new = o.name.replace(".", "_")
            if new not in bpy.data.objects:
                o.name = new; n += 1
    return n

def shrink_images(maxpx):
    info = []
    for im in bpy.data.images:
        if im.source != 'FILE' and not im.packed_file: continue
        w, h = im.size
        if w == 0: continue
        if max(w, h) > maxpx:
            im.scale(maxpx, max(1, int(round(h * maxpx / w))))
        info.append((im.name, [w, h], list(im.size)))
    return info

def world_bbox(objs):
    lo = Vector((1e18,)*3); hi = Vector((-1e18,)*3)
    for o in objs:
        if o.type != 'MESH' or not o.data.vertices: continue
        for c in o.bound_box:
            w = o.matrix_world @ Vector(c)
            for i in range(3):
                lo[i] = min(lo[i], w[i]); hi[i] = max(hi[i], w[i])
    return lo, hi

def manifest(path):
    parts = []
    for o in bpy.data.objects:
        if o.type != 'MESH': continue
        lo = Vector((1e18,)*3); hi = Vector((-1e18,)*3)
        for c in o.bound_box:
            w = o.matrix_world @ Vector(c)
            for i in range(3):
                lo[i] = min(lo[i], w[i]); hi[i] = max(hi[i], w[i])
        # 工程里写好的爆炸向量（Blender 坐标、建模单位）→ three 坐标、米
        # Blender (x, y, z) → three (x, z, -y)；相机建模单位 1 = 100mm，故乘 0.1
        ex = list(o.get("ex_v", (0.0, 0.0, 0.0)))
        ex_three = [round(ex[0] * 0.1, 6), round(ex[2] * 0.1, 6), round(-ex[1] * 0.1, 6)]
        parts.append({
            "name": o.name,
            "group": o.parent.name if o.parent else None,
            "tris": tris_of(o),
            "materials": [s.material.name if s.material else None for s in o.material_slots],
            "center": [round(v, 5) for v in ((lo + hi) / 2)],
            "size": [round(v, 5) for v in (hi - lo)],
            "origin": [round(v, 5) for v in o.matrix_world.translation],
            "ex": ex_three,
            "delay": round(float(o.get("ex_delay", 0.0)), 4),
        })
    parts.sort(key=lambda p: -p["tris"])
    data = {"parts": parts, "count": len(parts), "tris": sum(p["tris"] for p in parts)}
    json.dump(data, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    return len(parts), data["tris"]

def export(glb):
    with bpy.context.temp_override(scene=bpy.context.scene):
        bpy.ops.export_scene.gltf(
            filepath=glb, export_format='GLB', use_selection=False,
            export_apply=False, export_yup=True,
            export_texcoords=True, export_normals=True,
            export_materials='EXPORT', export_image_format='JPEG', export_jpeg_quality=88,
            export_animations=False, export_cameras=False, export_lights=False,
            export_extras=True, export_hierarchy_full_collections=False,
            export_draco_mesh_compression_enable=True,
            export_draco_mesh_compression_level=6,
            export_draco_position_quantization=14,
            export_draco_normal_quantization=10,
            export_draco_texcoord_quantization=12,
        )
    return os.path.getsize(glb)

def build_camera():
    """相机：使用 相机模型_v3.blend —— 即「演示片_镜头按键爆炸与360展示」所用的那套模型。
    v3 是精细零件版：300 件全部可见、每件都带作者写好的 ex_v 爆炸向量与 base_loc 基准位置，
    且面数仅 4.9 万（远低于双轨 AI 高模的 43 万），因此无需减面，也就不会破坏 UV 与烘焙贴图。"""
    src = r"G:\数字孪生\BlenderMCP_相机建模\相机模型_v3.blend"
    work = os.path.join(TMP, "camera_work.blend")
    shutil.copy2(src, work)
    bpy.ops.wm.open_mainfile(filepath=work)
    print("### 相机 · 源:", os.path.basename(src))
    print("  删除影棚/灯光/渲染相机:", delete_studio())
    print("  重命名:", fix_names(), "个对象")
    n_ex = sum(1 for o in bpy.data.objects if o.type == "MESH" and "ex_v" in o.keys())
    print("  带 ex_v 爆炸向量的对象:", n_ex)
    for (n, o, nw) in shrink_images(1024): print(f"  贴图 {n}: {o} -> {nw}")
    roots = [o for o in bpy.data.objects if o.parent is None]
    lo, hi = world_bbox(bpy.data.objects)
    print("  缩放前包围盒:", [round(v,4) for v in (hi-lo)])
    root = add_root(roots, "相机", 0.1)
    lo2, hi2 = world_bbox(bpy.data.objects)
    print("  缩放后包围盒(m):", [round(v,4) for v in (hi2-lo2)])
    print("  总面数:", sum(tris_of(o) for o in bpy.data.objects))
    n, t = manifest(os.path.join(WORK, "camera.parts.json"))
    size = export(os.path.join(WORK, "camera.glb"))
    print(f"  导出 camera.glb {size/1024/1024:.2f} MB | 部件 {n} | 面 {t}")
    verify(os.path.join(WORK, "camera.glb"))

def build_watch():
    src = r"G:\数字孪生\BlenderMCP_手表建模\手表模型_皇家橡树.blend"
    work = os.path.join(TMP, "watch_work.blend")
    shutil.copy2(src, work)
    bpy.ops.wm.open_mainfile(filepath=work)
    print("### 手表 · 源:", os.path.basename(src))
    print("  删除影棚/灯光/渲染相机:", delete_studio())
    print("  重命名:", fix_names(), "个对象")
    for (n, o, nw) in shrink_images(1024): print(f"  贴图 {n}: {o} -> {nw}")
    fixed = []
    for o in bpy.data.objects:
        if o.type == 'MESH' and o.name.startswith(("链带_", "表扣_")):
            if origin_to_own_center(o): fixed.append(o.name)
    print("  原点归位:", len(fixed), "个 ->", fixed[:6])
    roots = [o for o in bpy.data.objects if o.parent is None]
    lo, hi = world_bbox(bpy.data.objects)
    print("  包围盒(m):", [round(v,4) for v in (hi-lo)])
    root = add_root(roots, "手表", 1.0)
    print("  总面数:", sum(tris_of(o) for o in bpy.data.objects))
    n, t = manifest(os.path.join(WORK, "watch.parts.json"))
    size = export(os.path.join(WORK, "watch.glb"))
    print(f"  导出 watch.glb {size/1024/1024:.2f} MB | 部件 {n} | 面 {t}")
    verify(os.path.join(WORK, "watch.glb"))

def verify(glb):
    import struct
    raw = open(glb, "rb").read()
    if len(raw) < 20 or raw[:4] != b"glTF":
        print("  [校验失败] 不是有效 GLB"); return
    ver, total = struct.unpack("<II", raw[4:12])
    off = 12; js = None
    while off < len(raw):
        clen, ctype = struct.unpack("<II", raw[off:off+8])
        if ctype == 0x4E4F534A: js = raw[off+8:off+8+clen].decode("utf-8")
        off += 8 + clen + ((4 - clen % 4) % 4 if clen % 4 else 0)
    g = json.loads(js)
    tri = 0
    for m in g.get("meshes", []):
        for pr in m.get("primitives", []):
            idx = pr.get("indices")
            if idx is not None: tri += g["accessors"][idx]["count"] // 3
            else: tri += g["accessors"][pr["attributes"]["POSITION"]]["count"] // 3
    print(f"  [校验] glTF v{ver} | 节点 {len(g.get('nodes',[]))} | 网格 {len(g.get('meshes',[]))} "
          f"| 材质 {len(g.get('materials',[]))} | 贴图 {len(g.get('images',[]))} "
          f"| 三角面 {tri} | 扩展 {g.get('extensionsUsed',[])}")

sel = sys.argv[-1]
if sel in ("camera", "all"): build_camera()
if sel in ("watch", "all"):  build_watch()
print("DONE")
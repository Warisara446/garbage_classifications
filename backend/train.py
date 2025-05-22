from ultralytics import YOLO

# Load a pretrained YOLO11n model
model = YOLO("yolo11n.pt")

# ----------------Train  datasets_gray yolo11n-------------------------

# Load a pretrained YOLO11n model
#model = YOLO("yolo11n.pt")

# train_results = model.train(
#     data="datasets_gray/data.yaml",
#     epochs=50,
#     imgsz=240,
#     device=0, 
#     workers=0  
# )

# ----------------Train  datasets_rgb yolo11n------------------------- 

# Load a pretrained YOLO11n model
#model = YOLO("yolo11n.pt")

# train_results = model.train(
#     data="datasets_rgb/data.yaml",  
#     epochs=50,  
#     imgsz=240,
#     project="yolov11n_rgb_runs",
#     name="yolov11n_rgb",  
#     device=0, 
#     workers=0  
# )

# ----------------Train  datasets_rgb yolo9c------------------------- 

# Load a pretrained YOLO9c model
model = YOLO("yolov9c.pt")

train_results = model.train(
    data="datasets_rgb/data.yaml",  
    epochs=100,  
    imgsz=240,
    project="yolov9c_rgb_runs",
    name="yolov9c_rgb",  
    device=0, 
    workers=0,
    save_conf=True            # บันทึก confidence score
)

# Evaluate the model's performance on the validation set
metrics = model.val()
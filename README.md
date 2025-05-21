# Install Enviroment
```
cd <your folder>

python -m venv venv

venv\Scripts\activate.bat

pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

pip install ultralytics

code .
```

## Model
```
# ปัจจุบันมี 3 models ที่train
- yolo9c_rgb --> train ด้วย yolo9c datasets เป็น rgb 50 epocs / ผลลัพธ์อยู่ที่ yolov9c_rgb_runs **best
- yolo11n_rgb --> train ด้วย yolo11n datasets เป็น rgb 50 epocs / ผลลัพธ์อยู่ที่ yolov11n_rgb_runs
- yolo11n_gray --> train ด้วย yolo11n datasets เป็น gray 50 epocs / ผลลัพธ์อยู่ที่ runs **worst

```

## How to test
```


python detect.py

# สามารถแก้ ส่วนของ modelได้เลือกที่ต้องการ
# สามารถแก้ ส่วนของ datasets ที่ใช้ทดสอบได้ rgb or gray ได้เลือกที่ต้องการ
```

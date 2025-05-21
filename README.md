# Install Enviroment
```
cd <your folder>

python -m venv venv

venv\Scripts\activate.bat

pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

pip install ultralytics

code .
```

## Test mayva model 55 epoch
```
# เปลี่ยน image ที่ใช้ test ได้ โดย copy image ใน folder dataset\test

python detect.py
```

## How to train
```
# ระวังกระทบ model ที่ train ไว้ก่อนหน้า

python train.py

# สามารถแก้ dataset\data.yaml
# สามารถแก้ runs\detect\train\args.yaml 
```

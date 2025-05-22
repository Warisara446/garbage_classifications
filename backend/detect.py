from ultralytics import YOLO
import os
import random
import matplotlib.pyplot as plt


# ----------------สุ่มทดสอบ10รูป-------------------------
image_folder = "datasets_rgb/test/images"
all_images = [os.path.join(image_folder, img) for img in os.listdir(image_folder) if img.endswith(('.jpg'))]

sample_images = random.sample(all_images, 10)


# ---------------model------------------------
model = YOLO("yolo9c_rgb.pt")
results = model(sample_images)

# ---------------แสดง------------------------
cols = 5
rows = (len(sample_images) + cols - 1) // cols
fig, axs = plt.subplots(rows, cols, figsize=(20, 8))
axs = axs.ravel()  

for i, (r, img_path) in enumerate(zip(results, sample_images)):
    r_img = r.plot()  
    axs[i].imshow(r_img)
    axs[i].axis('off')

# ลบช่องว่างที่ไม่ได้ใช้ ถ้ามี
# for j in range(len(sample_images), len(axs)):
#     axs[j].axis('off')

plt.tight_layout()
plt.show()
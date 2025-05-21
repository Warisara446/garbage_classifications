
waste_datasets - v2 datasets_rgb
==============================

This dataset was exported via roboflow.com on May 21, 2025 at 10:30 AM GMT

Roboflow is an end-to-end computer vision platform that helps you
* collaborate with your team on computer vision projects
* collect & organize images
* understand and search unstructured image data
* annotate, and create datasets
* export, train, and deploy computer vision models
* use active learning to improve your dataset over time

For state of the art Computer Vision training notebooks you can use with this dataset,
visit https://github.com/roboflow/notebooks

To find over 100k other datasets and pre-trained models, visit https://universe.roboflow.com

The dataset includes 6892 images.
Waste are annotated in YOLOv11 format.

The following pre-processing was applied to each image:
* Auto-orientation of pixel data (with EXIF-orientation stripping)
* Resize to 240x240 (Fit within)

The following augmentation was applied to create 3 versions of each source image:
* Random rotation of between -14 and +14 degrees
* Random Gaussian blur of between 0 and 1.8 pixels
* Salt and pepper noise was applied to 1.33 percent of pixels



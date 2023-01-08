# Visualizing CNN Loss Landscapes
Date: 01/03/2023

![QR Codes](../posts/visualizing-loss-landscapes/images/ResNet-PCA-3d-contours.png)
:: The path to convergence on a loss landscape. ::
<br>

This project is the final project for the Scientific Visualization class in fall 2022. The project was open ended, with the only requirements
that you work with a partner and implement a scientific visualization paper using OpenGL. The paper Chase Ison and I chose is titled ["Visualizing the Loss Landscape of Neural Nets"](https://proceedings.neurips.cc/paper/2018/hash/a41b3bb3e6b050b6c9067c67f663b915-Abstract.html) by Hao Li et al. and implemented two different techniques to visualize the loss landscapes of neural nets.

I recommend that you [read our final report linked here for more details](https://github.com/charles-ison/sv_term_project/blob/main/Term_Project_Paper.pdf), as this post will just be a quick overview of the project and some our results.

<br>

#### Solution Overview

We chose to visualize two convolutional neural networks: ResNet-50 and VGG, each trained to classify images of the CIFAR-10 dataset. For each model, we generated two different loss landscapes from the two techniques Hao Li et al. described: random direction iteration and principle component analysis (PCA).

![CIFAR-10 dataset examples](../posts/visualizing-loss-landscapes/images/cifar-10-dataset-example.png)
:: CIFAR-10 dataset examples. ::

Our process for generating the visualization went as follows:
1. Train a model
2. After each epoch, perform a dimensionality reduction to two vectors.
3. Iterate over a grid of the loss across those two vectors, saving the points as our results.
4. Export the points to a PLY file which could be easily loaded into our OpenGL project.
5. Visualize the PLY file in OpenGL, using different techiques to produce different visualizations, such as marching squares to visualize contour lines.


<br>

#### Results

![QR Codes](../posts/visualizing-loss-landscapes/images/paper-teaser.png)
:: Loss landscapes of the ResNet-50 model from PCA dimensionality reduction, with the gradient decent path. ::
<br>


TODO: talk about exactly what the results mean!!!


![QR Codes](../posts/visualizing-loss-landscapes/images/ResNet-Random-3d-contours-critical-points.png)
:: The 3D loss landscape with critical points labelled for the ResNet-50 model using random direction iteration for dimensionality reduction. ::
<br>



#### Key Takeaways

This was a fun project that pushed me to understand dimensionality reduction and what we can learn from loss landscapes. The project stressed a lot of different skills- being able to write PyTorch code, being able to write dimensionality reduction code, training the models on a high performance cluster, formatting the data, and visualizing it with custom OpenGL code. I'm thankful to have had Chase as my project partner for knocking this project out within a week!


You can find the entire codebase as well as our final report in our [github repo linked here](https://github.com/charles-ison/sv_term_project).


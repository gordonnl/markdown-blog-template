# Visualizing Neural Network Loss Landscapes
Date: 01/03/2023
<PreviewImg>../posts/visualizing-loss-landscapes/images/ResNet-PCA-3d-contours.png</PreviewImg>

![QR Codes](../posts/visualizing-loss-landscapes/images/ResNet-PCA-3d-contours.png)
:: The path to convergence on a loss landscape. ::
<br>

Training artificial neural networks is a sensitive process due to architecture choices and hyperparameter tuning. By visualizing both the model’s loss landscape and path during gradient descent towards some local minimum, we can gain intuitions about how tuning and architectural decisions impact the model’s ability to converge. In this project, Chase Ison and I visualize loss landscapes of a convolutional neural network by implementing two separate methods proposed by Li et. al. in "[Visualizing the Loss Landscape of Neural Nets](https://proceedings.neurips.cc/paper/2018/hash/a41b3bb3e6b050b6c9067c67f663b915-Abstract.html)." For each method, we perform dimensionality reduction on a model’s weights during backpropagation, then iteratively manipulate the weights using these techniques to generate scalar fields termed 'loss landscapes'. Finally, we evaluate our results on two popular neural network models: ResNet-50 and VGG-11.

The project was the open-ended final for CS 453 - Scientific Visualization at OSU in fall 2022. This post will just be a quick overview of the project and some of our results.

<br>

#### Solution Overview

We chose to visualize two convolutional neural networks: ResNet-50 and VGG, each trained to classify images of the CIFAR-10 dataset. For each model, we generated two different loss landscapes from the two techniques detailed by Hao Li et al: *random direction iteration* and *principle component analysis (PCA)*.

![CIFAR-10 dataset examples](../posts/visualizing-loss-landscapes/images/cifar-10-dataset-wide.png)
:: CIFAR-10 dataset examples. ::

Our process for generating the visualization went as follows:
1. Train a model.
2. Perform dimensionality reduction to two vectors using either the random direction approach or PCA approach.
3. Iterate over a 25x25 square of points across the plane of those two vectors, calculate the loss at each point, saving each (x, y, loss) tuple to our results matrix.
4. Export the results to a PLY file.
5. Visualize the PLY file in OpenGL, using different techniques to produce different visualizations, such as marching squares to visualize contour lines.

You might be wondering why we use two different versions of dimensionality reduction.
Random direction iteration is essentially the simple way to generate a loss landscape, which was nice to do first just to make sure we were getting a good result.
On the other hand, PCA gave us meaningful insights and allowed us to trace the path of the model converging as it minimized the loss.



<br>

#### Results

![QR Codes](../posts/visualizing-loss-landscapes/images/paper-teaser.png)
:: Loss landscapes of the ResNet-50 model from PCA dimensionality reduction, with the gradient decent path. ::
<br>


The variations of loss landscapes above show that a single picture might not illustrate the 3D topography understandably.
Our OpenGL code allowed the user to scroll the point-of-view camera around the loss landscape, and change the texture with the click of a button.
The visualization below highlights local minima that the model may get stuck in while training with too small of a learning rate.


![QR Codes](../posts/visualizing-loss-landscapes/images/ResNet-Random-3d-contours-critical-points.png)
:: The 3D loss landscape with critical points labelled for the ResNet-50 model using random direction iteration for dimensionality reduction. ::
<br>



#### Key Takeaways

This project pushed me to understand dimensionality reduction as well as what we can learn from loss landscapes. It stressed a lot of different skills- being able to write PyTorch code, being able to write dimensionality reduction code, train the models on a high-performance cluster, format the data, and visualize it with custom OpenGL code. I'm thankful to have had Chase as my project partner to collaborate with!



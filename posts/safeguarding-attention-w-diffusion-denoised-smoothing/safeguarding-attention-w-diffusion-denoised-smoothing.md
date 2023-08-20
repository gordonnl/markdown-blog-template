# Safeguarding Attention With Diffusion Denoised Smoothing
Date: 06/15/2023
<PreviewImg>./assets/images/post_images/loss_landscapes/ResNet-PCA-3d-contours.png</PreviewImg>

![Expirment design flowchart](./assets/images/post_images/safeguarding-attention-w-diffusion-denoised-smoothing/experiment-design.png)
:: Experiment design. ::
<br>

Training artificial neural networks is a sensitive process due to architecture choices and hyperparameter tuning. By visualizing both the model’s loss landscape and path during gradient descent towards some local minimum, we can gain intuitions about how tuning and architectural decisions impact the model’s ability to converge. In this project, Chase Ison and I visualize loss landscapes of a convolutional neural network by implementing two separate methods proposed by Li et. al. in "[Visualizing the Loss Landscape of Neural Nets](https://proceedings.neurips.cc/paper/2018/hash/a41b3bb3e6b050b6c9067c67f663b915-Abstract.html)." For each method, we evaluate our results on two popular neural network models: ResNet-50 and VGG-11.

The project was the open-ended final for CS 453 - Scientific Visualization at OSU in fall 2022. This post will just be a quick overview of the project and some of our results.

<br>

#### Solution Overview

We chose to visualize two convolutional neural networks: ResNet-50 and VGG, each trained to classify images of the CIFAR-10 dataset. For each model, we generated two different loss landscapes from the techniques detailed by Hao Li et al: *random direction iteration* and *principle component analysis (PCA)*.

![Attention maps](./assets/images/post_images/safeguarding-attention-w-diffusion-denoised-smoothing/attention-map.png)
:: Spacial attention maps. ::

Our process for generating the visualization went as follows:
1. Train a model.
2. Perform dimensionality reduction to two vectors using either the random direction approach or PCA approach.
3. Iterate over a 25x25 square of points across the plane of those two vectors, calculate the loss at each point, saving each (x, y, loss) tuple to our results matrix.
4. Export the results to a PLY file.
5. Visualize the PLY file in OpenGL, using different techniques to produce different visualizations, such as marching squares to visualize contour lines.


![Example images of defense against PGD attack](./assets/images/post_images/safeguarding-attention-w-diffusion-denoised-smoothing/image-results.png)
:: A successful prevention of a PGD attack by using denoised diffusion. Parameters of σ = 0.25, ε = 0.01. ::
<br>

You might be wondering why we use two different versions of dimensionality reduction.
Random direction iteration is essentially the simple way to generate a loss landscape, which was nice to do first just to make sure we were getting a good result.
On the other hand, PCA gave us meaningful insights and allowed us to trace the path of the model converging as it minimized the loss.


<br>

#### Results

![Result graphs](./assets/images/post_images/safeguarding-attention-w-diffusion-denoised-smoothing/result-graphs.png)
:: ::
<br>


The variations of loss landscapes above show that a single picture might not illustrate the 3D topography understandably.
Our OpenGL code allowed the user to scroll the point-of-view camera around the loss landscape, and change the texture with the click of a button.
The visualization below highlights local minima that the model may get stuck in while training with too small of a learning rate.





#### Key Takeaways

This project pushed me to understand dimensionality reduction as well as what we can learn from loss landscapes. It stressed a lot of different skills- being able to write PyTorch code, being able to write dimensionality reduction code, train the models on a high-performance cluster, format the data, and visualize it with custom OpenGL code. I'm thankful to have had Chase as my project partner to collaborate with!



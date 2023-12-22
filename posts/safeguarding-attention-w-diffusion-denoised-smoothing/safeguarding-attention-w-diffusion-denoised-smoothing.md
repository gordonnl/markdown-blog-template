# Safeguarding Attention With Diffusion Denoised Smoothing
Date: 06/15/2023
<PreviewImg>./assets/images/post_images/safeguarding-attention-w-diffusion-denoised-smoothing/attention-map-thumbnail.png</PreviewImg>

![Expirment design flowchart](./assets/images/post_images/safeguarding-attention-w-diffusion-denoised-smoothing/experiment-design.png)
:: Experiment design. ::
<br>

Adversarial images caused by perturbations are a classic case of exploiting a computer vision model to predict the wrong thing, even while the image looks fairly normal to the naked eye. A common algorithm for such an attack is called PGD (Projected Gradient Descent). Adversaries may use PGD to add noise to the image in small but specific ways that cause misclassification. As a defense, Carlini et al. present in their 2022 paper "[Certified\! Adversarial Robustness for Free\!](https://arxiv.org/abs/2206.10550)" that by using diffusion denoised smoothing we can denoise the image in a single shot before predictions and obtain a much higher accuracy on adversarial images. For this project, we study the effect of denoised smoothing as a defense against PGD on attention-based models. 

<br>

Attention mechanisms, largely used within the context of natural language processing, help models identify and focus on the most relevant parts of input data while making predictions. In recent years, these mechanisms are seeing increased usage outside of natural language processing, including in image classification. Gaining an understanding of the usefulness of diffusion denoised smoothing for defending against attacks on attention-based models will help data scientists and ML engineers determine an optimal defense to use when protecting their cutting-edge model.

<br>

#### Project Implementation

In this post, I will give a high-level overview of the project and our results, but I recommend you read our [final paper here](https://github.com/mattmorgan6/Safeguarding-Attention-With-Diffusion-Denoised-Smoothing/blob/main/Safeguarding-Attention-With-Diffusion-Denoised-Smoothing.pdf) for all the details.


We opted to study two different models and corresponding datasets: CBAM+ResNet-50 with CIFAR-10 dataset, along with a pre-trained HuggingFace coatnet *rmlp_2_rw_384.sw_in12k_ft_in1k* model for the ImageNet-1k dataset.

Our procedure for the experiment was to first attack a portion of our dataset with various intensities of PGD. The more intense the epsilon value, the lower the classification score of the model, but also the more noisy the image becomes, ruining the ability for the attack to fly under the radar of a human verifier. Then we would feed the data into two channels. Channel 1 would run the data through the attention network and calculate our accuracy. Channel 2 would apply denoise smoothing as a defense against the attack, then run the denoised images through the attention network and calculate accuracy so we may compare Channel 1 and Channel 2.

Our CBAM+ResNet-50 model is unique in that we can also obtain a model of simply ResNet-50. This allows us to compare a traditional CNN against a CNN with attention mechanisms. The images below demonstrate the effect of PGD on images that are passed through ResNet-50 without CBAM. As the epsilon value of the attack increases, the feature map changes shape. Perhaps we can use denoised smoothing and attention models to prevent this shift.

![Attention maps](./assets/images/post_images/safeguarding-attention-w-diffusion-denoised-smoothing/attention-map.png)
:: Feature map at different epsilon values. ::

While the CIFAR-10 dataset contains 10 classes of small images, the ImageNet-1k dataset has 1,000 classes. Some classes are quite similar, for example, *bernese_mountain_dog* and *greater-swiss_mountain_dog*. In the image below, you can see that after PGD is applied to the input image, it becomes much darker and a bit noisier, which causes our prediction to change to *greater-swiss_mountain_dog*. Incorrect\! But after applying denoised smoothing, our prediction is corrected to *bernese_mountain_dog*\!

<br>

#### Results

Instead of just looking at cherry-picked examples, let's focus on our overall data. We are able to modify the sigma parameter of our diffusion denoised smoothing model to set how much to "smooth" the images. Thus, we plotted the increasing strength of the PGD attack on the x-axis against two different strengths of smoothing 0.25 and 0.5. We found that values higher than 0.5 only degraded the performance of the model, and omitted them from the chart. On the y-axis, is the model accuracy, which we want as high as possible!

![Result graphs](./assets/images/post_images/safeguarding-attention-w-diffusion-denoised-smoothing/result-graphs.png)
:: ::
<br>

On the first row of graphs, we have two graphs, of our accuracy on the ImageNet dataset. The gap between the yellow curve and red curve shows that our denoised smoothing defense worked successfully, increasing accuracy from around 0.25 to 0.70. However, our baseline on clean images was around 0.85, so we were unable to achieve a perfect defense. Accuracy also slightly decreases with a sigma value of 0.5 vs. 0.25.

In the second row of graphs, we compare our defenses on ResNet-50 with and without CBAM. While not quite as successful as with ImageNet-1k, our defense increases accuracy from 0 (where epsilon > 0.01) to around 0.25 for both CBAM and without. It turns out that CBAM+ResNet-50 actually scored marginally better after denoising than without it, indicating that diffusion denoised smoothing may be a wise defense for attention-based models.


#### Key Takeaways

While we worked with small subsets of the data, the project allowed us to explore a new area of research, with diffusion denoised smoothing just released within the last year (2022)\! Our experiments show a small increase in recovered accuracy (at most 5%) when comparing our attention model to a vanilla model under attack. In the class, I learned a variety of attacks and defenses, from data poisoning to membership inference attacks. The project taught me how to write a PGD attack from scratch with PyTorch, both train a model and use a pre-trained model, run an experiment lasting multiple days, and manage the data cleanly and effectively for our purpose\! I look forward to seeing where the machine learning expertise will take me. If there is one thing I've learned, it's that we cannot assume things are safe from attackers, even just the smallest vulnerability may be exploited.

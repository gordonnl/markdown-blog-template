# Serial QR Code Generator Project
Date: 12/15/2022
<PreviewImg>./assets/images/post_images/qr_code_generator/small-preview.png</PreviewImg>


![QR Codes](./assets/images/post_images/qr_code_generator/cropped-multi-page-pdf-qr-codes.png)
:: Example output PDF from generating 50 QR codes. ::
<br>

For my research in detecting cafeteria foods, my lab planned to take pictures and collect weights of food trays from the dining hall at my university. We aimed to collect this data both before and after the consumer ate the food, so we could see how much food was eaten versus how much was thrown away. The problem we faced was: how do we keep track of which image before consumption corresponds to which image after consumption?

<br>

#### Solution Overview

The solution I devised was to stick a unique QR code on the edge of each tray. Our computer vision software can then autonomously match the before and after pictures. However, two questions arose while discussing our plan:
  1. How can we generate unique QR codes?
  2. How will we print the QR codes onto stickers?

As for the first problem, I quickly wrote a python script to generate unique QR codes and formatted them onto pages of a PDF document for easy printing. To ensure the QR Codes were unique, we used a serial numbering system to label the QR codes 1000001, 1000002, ... up to a limit the user specifies. We could have used UUIDs, but our serial numbering allows us to have different "batches" of numbers for different experiments.

To solve the second problem, I found [8.5x11" sticker sheets online](https://www.walmart.com/ip/Avery-Printable-Sticker-Paper-8-5-x-11-Inkjet-Printer-White-15-Repositionable-Sticker-Sheets-3383/10353060?wmlspartner=wlpa&selectedSellerId=0&http://clickserve.dartsearch.net/link/click?lid=92700060762254883&ds_s_kwgid=58700006715445296&ds_s_inventory_feed_id=97700000003583668&ds_a_cid=654818135&ds_a_caid=13956209185&ds_a_agid=126452889113&ds_a_lid=pla-1392082700544&ds_a_cid=116919406&ds_a_caid=361575031&ds_a_agid=1200667322826314&ds_a_fiid=&ds_a_lid=pla-4578641339573147&&ds_e_adid=&ds_e_matchtype=search&ds_e_device=c&ds_e_network=s&ds_e_product_group_id=4578641339573147&ds_e_product_id=10353060_0&ds_e_product_merchant_id=27449&ds_e_product_country=US&ds_e_product_language=EN&ds_e_product_channel=Online&ds_e_product_store_id=&ds_url_v=2&ds_dest_url=?adid=2222222242031946843&wmlspartner=wmtlabs&wl0=e&wl1=s&wl2=c&wl3=&wl4=pla-4578641339573147&wl5=&wl6=&wl7=&wl8=%7baceid%7d&wl9=&wl10=27449&wl11=Online&wl12=10353060_0&wl13=&veh=sem_LIA&msclkid=6a1fdfb6e32d105ad801bcf992992922&gclid=6a1fdfb6e32d105ad801bcf992992922&gclsrc=3p.ds) that we could print the QR codes onto using a standard inkjet printer.

![QR Codes](./assets/images/post_images/qr_code_generator/cropped-multi-page-pdf-qr-codes.png)
:: Example output PDF from generating 50 QR codes. ::
<br>

#### Walking through the code

The design of the algorithm is fairly straightforward:
1. First, create a list of serially labeled QR codes as PIL image objects.
2. Second, take the list of QR code images and format as many of them onto a PDF page as possible. 
When the page is full, we write it to a PDF file. Repeat this step with the remaining QR codes onto a new blank page, until all remaining QR codes are written onto a page.
3. Now that we have a bunch of one-page files, the program merges them into a multi-page PDF.

There is one problem I identified with this approach: this script uses a substantial amount of memory.
If the user wanted to generate millions of QR codes, the program would have to create an image object for each
and store them in a list. While most computers would be able to handle a few Gigabytes of memory consumption from the program, we can use the `generator` feature instead and only consume a few Megabytes.

You can see the first step of my algorithm below, where I `yield` the newly-created QR code image:
```python
def create_qr_code_image_objects():
    """Returns a generator of qr code PIL ImageDraw objects."""

    for i in range(total_qr_codes):
        curr_num = starting_num + i

        # Generate qr code.
        data = str(curr_num)
        qr_code_img = qrcode.make(data)
        qr_code_img = qr_code_img.resize(QR_SIZE, resample=Resampling.BOX)

        # Add text to the qr code (attempt to center at top)
        draw_canvas = ImageDraw.Draw(qr_code_img)
        draw_canvas.text(((QR_SIZE[0] // 2) - 20, 0), data, font=FONT)

        yield qr_code_img
```

Then, in the second step of the algorithm, I simply call `next()` on the generator to retrieve the next QR code image object.
```python
while row + QR_SIZE[0] + VERT_SPACING_BETWEEN_QR_CODES <= pdf_height:
  while col + QR_SIZE[0] + HORZ_SPACING_BETWEEN_QR_CODES <= pdf_width:
      try:
          qr_code_img = next(qr_code_image_generator)
      except StopIteration:
          break

      resized_qr_code_img_obj = ImageOps.fit(qr_code_img, QR_SIZE, Resampling.LANCZOS)  
      pdf_canvas.paste(resized_qr_code_img_obj, (col, row))

      # code for the rest of the function omitted
```
<br>

#### Conclusion

Overall, even with a project of small scope, I learned how to use the generator feature and wrote a script that will save time for my lab and the open-source community. 

You can find the entire python script as well as instructions for running the program in my [github repo linked here](https://github.com/mattmorgan6/serial-qr-code-generator).


# Serial QR Code Generator Project
Date: 12/15/2022

For my research in detecting cafeteria foods, my lab planned to take pictures and collect weights of food trays from the dining hall at my university. Our aim was to collect this data both before and after the consumer ate the food, so we could see how much food was actually eaten versus how much was thrown away. The problem we faced was: how do we keep track of which image before consumption corresponds to which image after consumption?

#### Solution Overview

The solution I devised was to stick a unique QR code on the edge of the tray and the software can autonomously match the before and after pictures. Two questions arose from this plan:
  1. How can we generate unique QR codes?
  2. How will we print the QR codes onto stickers?

To solve the second problem, I found [8.5x11" sticker sheets online](https://www.walmart.com/ip/Avery-Printable-Sticker-Paper-8-5-x-11-Inkjet-Printer-White-15-Repositionable-Sticker-Sheets-3383/10353060?wmlspartner=wlpa&selectedSellerId=0&http://clickserve.dartsearch.net/link/click?lid=92700060762254883&ds_s_kwgid=58700006715445296&ds_s_inventory_feed_id=97700000003583668&ds_a_cid=654818135&ds_a_caid=13956209185&ds_a_agid=126452889113&ds_a_lid=pla-1392082700544&ds_a_cid=116919406&ds_a_caid=361575031&ds_a_agid=1200667322826314&ds_a_fiid=&ds_a_lid=pla-4578641339573147&&ds_e_adid=&ds_e_matchtype=search&ds_e_device=c&ds_e_network=s&ds_e_product_group_id=4578641339573147&ds_e_product_id=10353060_0&ds_e_product_merchant_id=27449&ds_e_product_country=US&ds_e_product_language=EN&ds_e_product_channel=Online&ds_e_product_store_id=&ds_url_v=2&ds_dest_url=?adid=2222222242031946843&wmlspartner=wmtlabs&wl0=e&wl1=s&wl2=c&wl3=&wl4=pla-4578641339573147&wl5=&wl6=&wl7=&wl8=%7baceid%7d&wl9=&wl10=27449&wl11=Online&wl12=10353060_0&wl13=&veh=sem_LIA&msclkid=6a1fdfb6e32d105ad801bcf992992922&gclid=6a1fdfb6e32d105ad801bcf992992922&gclsrc=3p.ds) that we could print the QR codes onto using a standard inkjet printer.

Now, how would we generate pages of unique QR codes? I simply wrote a python script to generate the unique QR codes and format them onto pages of a PDF document. This allowed the QR codes to be easily printed. To ensure the QR Codes were unique, we used a serial numbering system to label the QR codes 1000001, 1000002, ... up to the limit the user specifies. We could have used UUIDs, but our serial numbering allows us to have different "batches" of numbers for different experiments.

![QR Codes](docs/assets/images/images-for-posts/cropped-multi-page-pdf-qr-codes.png)
: Example output PDF from generating 50 QR codes. :

Here is an example of the command a user would run to generate the QR codes:

```text
usage: gen_qr_codes.py [-h] s n

Generate n QR Codes starting with the number s.

positional arguments:
  s           The identifying number for the first qr code, e.g. 100
              results in the series 100, 101, 102...
  n           How many total QR codes to generate, e.g. 10 will create
              ten QR codes.

options:
  -h, --help  show this help message and exit
```

<br>

#### Walking through the code

To be continued...


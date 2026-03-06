import fitz
import os
import uuid

IMAGE_DIR = "data/images"
os.makedirs(IMAGE_DIR, exist_ok=True)


def extract_text_and_images(file_path):

    doc = fitz.open(file_path)

    text = ""
    images = []

    for page in doc:

        text += page.get_text()

        image_list = page.get_images(full=True)

        for img in image_list:

            xref = img[0]
            base = doc.extract_image(xref)

            image_bytes = base["image"]
            ext = base["ext"]

            name = f"{uuid.uuid4()}.{ext}"
            path = os.path.join(IMAGE_DIR, name)

            with open(path, "wb") as f:
                f.write(image_bytes)

            images.append(path)

    return text, images
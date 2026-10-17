
from pathlib import Path

import streamlit as st
from PIL import Image

from predict_pytorch import (
    load_model,
    build_transform,
    predict_image,
)


st.set_page_config(
    page_title="Plant Disease Classifier",
    page_icon="🌿",
    layout="centered",
)

st.title("🌿 Plant Disease Classifier")
st.write(
    "Upload a plant leaf image to receive a predicted disease "
    "class and the model's confidence scores."
)

st.info(
    "This tool provides an AI prediction for educational and "
    "research purposes. It is not a substitute for expert "
    "plant pathology advice."
)


@st.cache_resource
def get_predictor():
    model, class_names, image_size = load_model()
    transform = build_transform(image_size)
    return model, class_names, transform


try:
    model, class_names, transform = get_predictor()
except Exception as exc:
    st.error(f"Could not load the trained model: {exc}")
    st.stop()


uploaded_file = st.file_uploader(
    "Choose a leaf image",
    type=["jpg", "jpeg", "png", "webp"],
)

if uploaded_file is not None:
    try:
        image = Image.open(uploaded_file).convert("RGB")

        st.image(
            image,
            caption="Uploaded leaf image",
            use_container_width=True,
        )

        if st.button("Analyze leaf", type="primary"):
            with st.spinner("Analyzing image..."):
                results = predict_image(
                    image,
                    model,
                    class_names,
                    transform,
                )

            
        
            best = results[0]

            st.subheader("Analysis result")

            if best["class_name"] == "Background_without_leaves":
                st.warning(
                    "Unable to provide a reliable disease prediction "
                    "for this image. The model's strongest result was "
                    "'Background without leaves', which may indicate "
                    "that this photo differs from the images used "
                    "during training."
                )

                st.write(
                    "Try uploading a clear, close-up photograph of "
                    "one leaf with visible symptoms and minimal "
                    "background. This may improve results, but "
                    "correct classification is not guaranteed."
                )

            else:
                label = (
                    best["class_name"]
                    .replace("___", " — ")
                    .replace("_", " ")
                )

                st.write(f"**Predicted class:** {label}")
                st.metric(
                    "Model confidence",
                    f"{best['confidence']:.2%}",
                )

            with st.expander("View model scores"):
                st.caption(
                    "These are model scores, not calibrated "
                    "probabilities of diagnostic correctness."
                )

                for result in results:
                    label = (
                        result["class_name"]
                        .replace("___", " — ")
                        .replace("_", " ")
                    )

                    st.write(
                        f"**{label}** — "
                        f"{result['confidence']:.2%}"
                    )
                    st.progress(result["confidence"])



            st.subheader("Top predictions")

            for result in results:
                label = (
                    result["class_name"]
                    .replace("___", " — ")
                    .replace("_", " ")
                )
                st.write(f"**{label}** — {result['confidence']:.2%}")
                st.progress(result["confidence"])

            st.caption(
                "Softmax confidence is not a calibrated probability "
                "of diagnostic correctness. Results may be unreliable "
                "for unfamiliar images or symptoms."
            )

    except Exception as exc:
        st.error(f"Could not process this image: {exc}")

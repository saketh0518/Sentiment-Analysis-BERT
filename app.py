
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import torch
import torch.nn.functional as F

from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification
)

import re


# ==================================
# LOAD MODEL
# ==================================

MODEL_NAME = "cardiffnlp/twitter-roberta-base-sentiment"

tokenizer = AutoTokenizer.from_pretrained(
    MODEL_NAME
)

model = AutoModelForSequenceClassification.from_pretrained(
    MODEL_NAME
)

label_map = {

    0: "Negative 😡",

    1: "Neutral 😐",

    2: "Positive 😊"

}


# ==================================
# FASTAPI SETUP
# ==================================

app = FastAPI(

    title="3-Class Sentiment Analysis API"

)

app.add_middleware(

    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],

)


class TextInput(BaseModel):

    text: str


# ==================================
# INPUT VALIDATION
# ==================================

def is_invalid_text(text: str):

    cleaned = text.strip()

    if not cleaned:
        return True

    # Only numbers

    if re.fullmatch(
        r"[0-9+\-*/=().\s]+",
        cleaned
    ):
        return True

    # Only symbols

    if re.fullmatch(
        r"[!@#$%^&*()_=+\-{}\[\]:;\"'<>,.?/\\|`~\s]+",
        cleaned
    ):
        return True

    # Too short

    if len(
        cleaned.split()
    ) < 2:
        return True

    return False


# ==================================
# AI EXPLANATION
# ==================================

def generate_explanation(
    text,
    sentiment
):

    text_lower = text.lower()

    positive_words = [

        "amazing",
        "awesome",
        "excellent",
        "fantastic",
        "great",
        "good",
        "love",
        "wonderful",
        "best",
        "happy",
        "perfect",
        "beautiful",
        "inspiring",
        "brilliant",
        "outstanding",
        "nice",
        "super"

    ]

    negative_words = [

        "bad",
        "terrible",
        "awful",
        "worst",
        "poor",
        "hate",
        "boring",
        "disappointed",
        "useless",
        "sad",
        "angry",
        "horrible",
        "disgusting",
        "pathetic",
        "waste",
        "annoying"

    ]

    found_words = []

    if "Positive" in sentiment:

        for word in positive_words:

            if word in text_lower:

                found_words.append(word)

        if len(found_words) >= 2:

            return (

                f'The text contains strongly '
                f'positive expressions such as '
                f'"{found_words[0]}" and '
                f'"{found_words[1]}", '
                f'which reflect satisfaction '
                f'and appreciation. Therefore, '
                f'the model classifies this '
                f'text as Positive.'

            )

        elif len(found_words) == 1:

            return (

                f'The text contains the positive '
                f'expression "{found_words[0]}", '
                f'which indicates a favourable '
                f'emotion. Hence, the model '
                f'predicts a Positive sentiment.'

            )

        else:

            return (

                "The overall context of the text "
                "expresses positive emotions and "
                "appreciation, leading the model "
                "to classify it as Positive."

            )

    elif "Negative" in sentiment:

        for word in negative_words:

            if word in text_lower:

                found_words.append(word)

        if len(found_words) >= 2:

            return (

                f'The text contains negative '
                f'expressions such as '
                f'"{found_words[0]}" and '
                f'"{found_words[1]}", '
                f'which indicate dissatisfaction '
                f'and frustration. Therefore, '
                f'the model classifies this '
                f'text as Negative.'

            )

        elif len(found_words) == 1:

            return (

                f'The text contains the negative '
                f'expression "{found_words[0]}", '
                f'which indicates dissatisfaction. '
                f'Hence, the model predicts a '
                f'Negative sentiment.'

            )

        else:

            return (

                "The overall context of the text "
                "contains negative emotions and "
                "unfavourable expressions, leading "
                "the model to classify it as "
                "Negative."

            )

    else:

        return (

            "The sentence mainly contains factual "
            "or objective information without "
            "strong positive or negative emotional "
            "indicators. Therefore, the model "
            "classifies it as Neutral."

        )


# ==================================
# ROOT
# ==================================

@app.get("/")
def home():

    return {

        "message":
        "3-Class Sentiment API Running 🚀"

    }


# ==================================
# PREDICT
# ==================================

@app.post("/predict")
def predict(data: TextInput):

    if is_invalid_text(
        data.text
    ):

        return {

            "error":
            "Invalid input. Please enter a meaningful review."

        }

    model.eval()

    with torch.no_grad():

        tokens = tokenizer(

            data.text,

            return_tensors="pt",

            truncation=True,

            padding=True,

            max_length=128

        )

        outputs = model(
            **tokens
        )

        probabilities = F.softmax(
            outputs.logits,
            dim=1
        ).squeeze()

        prediction = torch.argmax(
            probabilities
        ).item()

    negative = probabilities[0].item()
    neutral = probabilities[1].item()
    positive = probabilities[2].item()

    confidence = probabilities[
        prediction
    ].item()

    sentiment = label_map[
        prediction
    ]

    explanation = generate_explanation(

        data.text,

        sentiment

    )

    return {

        "sentiment":

        sentiment,

        "confidence":

        round(
            confidence * 100,
            2
        ),

        "positive":

        round(
            positive * 100,
            2
        ),

        "negative":

        round(
            negative * 100,
            2
        ),

        "neutral":

        round(
            neutral * 100,
            2
        ),

        "explanation":

        explanation

    }


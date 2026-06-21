import torch
import torch.nn.functional as F
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import pandas as pd

# -------------------------------
# DATASET (NO LABELS)
# -------------------------------
data = {
    "review": [
        "Stranger Things season 4 was absolutely amazing",
        "Money Heist became boring in the last season",
        "Dark is confusing but very interesting",
        "The Witcher has excellent action scenes",
        "The story of this series is very confusing",
        "Breaking Bad is confusing shows ever",
        "This Netflix series was a waste of time",
        "The series has both good and bad moments",
        "The acting in Wednesday was impressive",
        "Too many unnecessary episodes",
        "good storytelling and direction"
    ]
}

df = pd.DataFrame(data)

# -------------------------------
# LOAD PRETRAINED SENTIMENT MODEL
# -------------------------------
MODEL_NAME = "cardiffnlp/twitter-roberta-base-sentiment"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)

label_map = {
    0: "Negative 😡",
    1: "Neutral 😐",
    2: "Positive 😊"
}

# -------------------------------
# PREDICTION FUNCTION (NEUTRAL FIXED)
# -------------------------------
def predict(text, neutral_threshold=0.55):
    model.eval()
    with torch.no_grad():
        tokens = tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            padding=True,
            max_length=128
        )

        outputs = model(**tokens)
        probs = F.softmax(outputs.logits, dim=1).squeeze()

        max_prob = torch.max(probs).item()
        pred = torch.argmax(probs).item()

    # FORCE NEUTRAL WHEN CONFIDENCE IS LOW
    if max_prob < neutral_threshold:
        return "Neutral 😐"

    return label_map[pred]

# -------------------------------
# RUN PREDICTIONS
# -------------------------------
print("\n🔍 Sentiment Results:\n")

results = []

for text in df["review"]:
    sentiment = predict(text)
    results.append(sentiment)
    print(f"{text} -> {sentiment}")

# -------------------------------
# FINAL OVERALL SENTIMENT
# -------------------------------
final_result = max(set(results), key=results.count)
print("\n✅ FINAL OVERALL SENTIMENT:", final_result)
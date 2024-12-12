import os
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.probability import FreqDist
from nltk.sentiment import SentimentIntensityAnalyzer
import matplotlib.pyplot as plt
from sklearn.manifold import TSNE
from sklearn.feature_extraction.text import TfidfVectorizer


nltk.download('punkt', quiet=False)
nltk.download('stopwords', quiet=True)
nltk.download('vader_lexicon', quiet=True)
nltk.download('wordnet')
nltk.download('omw-1.4')
nltk.download('punkt_tab')

def preprocess_text(text):
    """    
    Args:
    - text: Input text string
    
    Returns:
    - Preprocessed text
    """
    # Tokenize and remove stopwords
    stop_words = set(stopwords.words('english'))
    tokens = word_tokenize(text.lower())
    cleaned_tokens = [token for token in tokens if token.isalnum() and token not in stop_words]
    
    return cleaned_tokens



def extract_keywords(tokens, top_n=10):
    """
    Extract top keywords based on frequency
    
    Args:
    - tokens: List of preprocessed tokens
    - top_n: Number of top keywords to return
    
    Returns:
    - List of top keywords
    """
    freq_dist = FreqDist(tokens)
    return [word for word, _ in freq_dist.most_common(top_n)]


def summarize_text(text, max_sentences=3):
    """
    Simple extractive text summarization
    
    Args:
    - text: Input text string
    - max_sentences: Maximum number of sentences in summary
    
    Returns:
    - Text summary
    """
    sentences = sent_tokenize(text)
    
    # Score sentences by word frequency
    tokens = preprocess_text(text)
    freq_dist = FreqDist(tokens)
    
    # Score sentences
    sentence_scores = {}
    for sentence in sentences:
        for word in word_tokenize(sentence.lower()):
            if word in freq_dist:
                if sentence not in sentence_scores:
                    sentence_scores[sentence] = freq_dist[word]
                else:
                    sentence_scores[sentence] += freq_dist[word]
    
    # Get top sentences
    summary_sentences = sorted(sentence_scores, key=sentence_scores.get, reverse=True)[:max_sentences]
    
    return ' '.join(summary_sentences)



def perform_sentiment_analysis(text):
    """
    Lightweight sentiment analysis using VADER
    
    Args:
    - text: Input text string
    
    Returns:
    - Sentiment scores and classification
    """
    sia = SentimentIntensityAnalyzer()
    sentiment_scores = sia.polarity_scores(text)
    
    # Classify sentiment
    if sentiment_scores['compound'] >= 0.05:
        sentiment = 'Positive'
    elif sentiment_scores['compound'] <= -0.05:
        sentiment = 'Negative'
    else:
        sentiment = 'Neutral'
    
    return {
        'scores': sentiment_scores,
        'classification': sentiment
    }


def analyze_text_content(text_content, REQUIRED_SERVICES):
    """
    Helper function to perform text analysis.
    
    Parameters:
    - text_content: The content of the text file
    
    Returns:
    - A dictionary with analysis results
    """
    try:
        # Perform analyses
        preprocessed_tokens = preprocess_text(text_content)
        result = {
            'text_stats': {
                'total_words': len(preprocessed_tokens),
                'total_sentences': len(sent_tokenize(text_content))
            }
        }
        if 'keywords' in REQUIRED_SERVICES:
            result['keywords'] = extract_keywords(preprocessed_tokens)
        if 'summarization' in REQUIRED_SERVICES:
            result['summary'] = summarize_text(text_content)

        if 'classification' in REQUIRED_SERVICES:
            result['sentiment'] = perform_sentiment_analysis(text_content)

        
        return result
    except Exception as e:
        raise ValueError(f"Error during text analysis: {str(e)}")
    



def generate_tsne_visualization_from_file(file_name, output_filename):
    """
    Generate a T-SNE visualization for a text file.
    
    Parameters:
    - file_name (str): The name of the text file in '../uploads/text'.
    - output_filename (str): The name of the output image file (e.g., 'visualization.png').
    
    Saves the visualization as an image in the '../results' directory.
    """
    # Paths
    input_path = os.path.join(os.path.dirname(__file__), '../uploads/text', file_name)
    results_dir = os.path.join(os.path.dirname(__file__), '../results')
    os.makedirs(results_dir, exist_ok=True)
    
    # Read the text file
    if not os.path.exists(input_path):
        raise FileNotFoundError(f"Text file not found at {input_path}")
    
    with open(input_path, 'r', encoding='utf-8') as f:
        text_data = f.read()

    # Tokenize sentences or split by lines for document-level embedding
    documents = text_data.split()
    documents = [doc.strip() for doc in documents if doc.strip()]  # Remove empty or whitespace-only lines

    # Check number of samples
    n_samples = len(documents)
    if n_samples < 3:
        raise ValueError("T-SNE requires at least 3 samples. Provide a text file with more lines.")

    # Convert text to embeddings using TF-IDF
    vectorizer = TfidfVectorizer(max_features=300)  # Lightweight model
    text_embeddings = vectorizer.fit_transform(documents).toarray()

    # Adjust perplexity dynamically
    perplexity = min(30, n_samples - 1)

    # Reduce dimensions using T-SNE
    tsne = TSNE(n_components=2, random_state=42, perplexity=perplexity, n_iter=1000)
    reduced_embeddings = tsne.fit_transform(text_embeddings)

    # Plot T-SNE visualization
    plt.switch_backend('agg')
    plt.figure(figsize=(8, 8))
    plt.scatter(reduced_embeddings[:, 0], reduced_embeddings[:, 1], s=10, alpha=0.7)
    plt.title("T-SNE Visualization")
    plt.xlabel("Dimension 1")
    plt.ylabel("Dimension 2")

    # Save the visualization
    output_path = os.path.join(results_dir, output_filename)
    plt.savefig(output_path)
    plt.close()

    print(f"T-SNE visualization saved to {output_path}")

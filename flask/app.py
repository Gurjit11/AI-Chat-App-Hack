import os
from flask import Flask, request, jsonify, json
from waitress import serve

from pytube import YouTube
import tempfile
import openai
from flask_cors import CORS, cross_origin
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Pinecone
from langchain.embeddings.openai import OpenAIEmbeddings
import pinecone
from langchain.llms import OpenAI
from langchain.chat_models import ChatOpenAI
from langchain.chains.question_answering import load_qa_chain
import numpy as np

# Set the OpenAI API key
openai.api_key = os.environ.get(
    "API_KEY", ""
)

app = Flask(__name__)
CORS(app)


# pinecone
# Check to see if there is an environment variable with you API keys, if not, use what you put below
OPENAI_API_KEY = os.environ.get(
    "API_KEY", ""
)

PINECONE_API_KEY = os.environ.get(
    "PINECONE_API_KEY", ""
)
PINECONE_API_ENV = os.environ.get("PINECONE_API_ENV", "gcp-starter")
# initialize pinecone
pinecone.init(
    api_key=PINECONE_API_KEY,  # find at app.pinecone.io
    environment=PINECONE_API_ENV,  # next to api key in console
)
index_name = "transcribe"  # put in the name of your pinecone index here
index = pinecone.Index(index_name)


docsearch = Pinecone


@app.route("/", methods=["GET"])
@cross_origin()
def indexs():
    return f"hello {os.environ.get('SECRET_KEY')}"


@app.route("/transcribe", methods=["POST"])
@cross_origin()
def transcribe():
    request_data = json.loads(request.data)
    video_url = request_data["video_url"]

    if not video_url:
        return jsonify({"error": "Video URL is required."}), 400

    try:
        # Download YouTube video
        yt = YouTube(video_url)
        stream = yt.streams.filter(only_audio=True).first()

        # Save the video in a temporary file
        with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as temp_file:
            temp_file_name = temp_file.name

        stream.download(
            output_path=os.path.dirname(temp_file_name),
            filename=os.path.basename(temp_file_name),
        )

        # Transcribe the video using OpenAI's Whisper API
        with open(temp_file_name, "rb") as audio_file:
            transcript = openai.Audio.transcribe("whisper-1", audio_file)

        # Remove the temporary file after transcription
        os.remove(temp_file_name)

        # splitting
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=0)
        texts = text_splitter.create_documents([transcript["text"]])
        print(len(texts))

        index_stats_response = index.describe_index_stats()
        print(index_stats_response)

        embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)

        global docsearch
        docsearch = Pinecone.from_texts(
            [t.page_content for t in texts], embeddings, index_name=index_name
        )

        return jsonify({"script": transcript["text"]}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/query", methods=["POST"])
@cross_origin()
def query():
    request_data = json.loads(request.data)
    query = request_data["query"]

    if not query:
        return jsonify({"error": "Question is required."}), 400

    try:
        # openai
        docs = docsearch.similarity_search(query=query)
        print(docs)

        chain = load_qa_chain(
            llm=ChatOpenAI(model_name="gpt-3.5-turbo",openai_api_key=""),chain_type="stuff"
        )
        output = chain.run(input_documents=docs, question=query)
        print(output)

        return jsonify({"ans": str(output)}), 200

    except Exception as e:
        print("Error", e)
        return jsonify({"error": str(e)}), 500


@app.route("/clear", methods=["POST"])
@cross_origin()
def clear():
    try:

        def get_ids_from_query(index, input_vector):
            print("searching pinecone...")
            results = index.query(
                vector=input_vector, top_k=10000, include_values=False
            )
            ids = set()
            print(type(results))
            for result in results["matches"]:
                ids.add(result["id"])
            return ids

        def get_all_ids_from_index(index, num_dimensions, namespace=""):
            num_vectors = index.describe_index_stats()["namespaces"][namespace][
                "vector_count"
            ]
            all_ids = set()
            while len(all_ids) < num_vectors:
                print(
                    "Length of ids list is shorter than the number of total vectors..."
                )
                input_vector = np.random.rand(num_dimensions).tolist()
                print("creating random vector...")
                ids = get_ids_from_query(index, input_vector)
                print("getting ids from a vector query...")
                all_ids.update(ids)
                print("updating ids set...")
                print(f"Collected {len(all_ids)} ids out of {num_vectors}.")

            return all_ids

        all_ids = get_all_ids_from_index(index, num_dimensions=1536, namespace="")
        print(list(all_ids))

        delete_response = index.delete(ids=list(all_ids), namespace="")
        print(delete_response)
        return jsonify({"ans": str("Cleared DB successfully!")}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    serve(app, host="0.0.0.0", port=5000, threads=2)

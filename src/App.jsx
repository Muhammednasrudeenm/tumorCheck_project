import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile)); // Show preview
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please upload an MRI image.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // Send single image

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/predict", formData);
      setResult(response.data.result);
    } catch (error) {
      alert("Error processing the image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">TumorCheck</h1>

      <div className="flex flex-col items-center">
        <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />
        {preview && (
          <img
            src={preview}
            alt="Uploaded MRI"
            className="w-48 h-48 object-cover border-2 border-gray-300 rounded-lg shadow-md"
          />
        )}
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-200"
      >
        {loading ? "Processing..." : "Upload and Detect"}
      </button>

      {result && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow-md border text-xl font-semibold">
          Result: {result}
        </div>
      )}
    </div>
  );
}

export default App;

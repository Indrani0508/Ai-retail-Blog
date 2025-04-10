import React, { useState } from 'react';
import axios from 'axios';

const BlogGenerator = () => {
  const [topic, setTopic] = useState('');
  const [generatedBlog, setGeneratedBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateBlog = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setGeneratedBlog(null);
    setError('');

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'https://ai-retail-blog-4.onrender.com';
      const response = await axios.post(`${API_URL}/api/blogs/generate`, { topic });
      setGeneratedBlog(response.data);
    } catch (err) {
      console.error(err);
      setError('Something went wrong while generating the blog.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📝 AI Blog Generator</h2>

      <input
        type="text"
        className="border p-2 w-full mb-4"
        placeholder="Enter blog topic..."
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />

      <button
        onClick={generateBlog}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Blog'}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {generatedBlog && (
        <div className="mt-6 p-6 bg-gray-100 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-2">{generatedBlog.title}</h3>
          <p className="italic text-sm text-gray-600">{generatedBlog.metaDescription}</p>
          <p className="mt-2 mb-4 text-sm"><strong>Keywords:</strong> {generatedBlog.keywords}</p>

          {/* 🖼️ Display Images */}
          {generatedBlog.images?.map((img, index) => (
            <img
              key={index}
              src={img.src}
              alt={img.alt}
              className="my-4 w-full rounded shadow-md"
            />
          ))}

          {/* 📝 Blog Content */}
          <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: generatedBlog.content }} />

          {/* 🔗 Internal Links */}
          {generatedBlog.internalLinks?.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold">Related Posts:</h4>
              <ul className="list-disc list-inside">
                {generatedBlog.internalLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link.url} className="text-blue-600 underline">{link.text}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 🌐 External Links */}
          {generatedBlog.outboundLinks?.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold">Learn More:</h4>
              <ul className="list-disc list-inside">
                {generatedBlog.outboundLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogGenerator;

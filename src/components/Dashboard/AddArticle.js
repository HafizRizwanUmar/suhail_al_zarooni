import React, { useState } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./AddArticle.css";
import { useAuth } from "../../context/AuthContext";

const CATEGORIES = [
  { value: "event",      label: "Event" },
  { value: "foundation", label: "Foundation" },
  { value: "collection", label: "Collection" },
  { value: "museum",     label: "Museum" },
  { value: "media",      label: "Media" },
  { value: "guest",      label: "Guest" },
  { value: "about",      label: "About Us" },
  { value: "bollywood",  label: "Bollywood" },
  { value: "hollywood",  label: "Hollywood" },
  { value: "pakistani",  label: "Pakistani" },
  { value: "update",     label: "Update" },
];

const AddArticle = () => {
  const { user, token } = useAuth();
  const [form, setForm] = useState({
    title:           "",
    metaTitle:       "",
    metaDescription: "",
    focusKeyword:    "",
    category:        "",
    content:         "",
  });
  const [image,   setImage]   = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    formData.append("userId", user.id);
    if (image) formData.append("image", image);

    try {
      const response = await axios.post("https://suhail-al-zarooni-backend.vercel.app/articles", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization:  `Bearer ${token}`,
        },
      });
      setMessage({ text: response.data.message || "Article submitted successfully.", type: "success" });
      setForm({ title: "", metaTitle: "", metaDescription: "", focusKeyword: "", category: "", content: "" });
      setImage(null);
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Error submitting article.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="article-container">
      <div className="page-header">
        <h2>Create New Article</h2>
        <p>Fill in all fields below and submit for review.</p>
      </div>

      <div className="article-card">
        <form onSubmit={handleSubmit}>

          {/* Row 1 */}
          <div className="flexContainer">
            <div className="article-form-group">
              <label className="article-label">Article Title</label>
              <input
                type="text"
                className="article-input"
                value={form.title}
                onChange={set("title")}
                placeholder="Enter a compelling title"
                required
              />
            </div>
            <div className="article-form-group">
              <label className="article-label">Meta Title</label>
              <input
                type="text"
                className="article-input"
                value={form.metaTitle}
                onChange={set("metaTitle")}
                placeholder="SEO meta title"
                required
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="flexContainer">
            <div className="article-form-group">
              <label className="article-label">Meta Description</label>
              <input
                type="text"
                className="article-input"
                value={form.metaDescription}
                onChange={set("metaDescription")}
                placeholder="Brief SEO description"
                required
              />
            </div>
            <div className="article-form-group">
              <label className="article-label">Focus Keyword</label>
              <input
                type="text"
                className="article-input"
                value={form.focusKeyword}
                onChange={set("focusKeyword")}
                placeholder="Primary keyword"
                required
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="flexContainer">
            <div className="article-form-group">
              <label className="article-label">Category</label>
              <select
                className="article-select"
                value={form.category}
                onChange={set("category")}
                required
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Content */}
          <div className="article-form-group">
            <label className="article-label">Article Content</label>
            <ReactQuill
              theme="snow"
              value={form.content}
              onChange={(val) => setForm((prev) => ({ ...prev, content: val }))}
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image"],
                  ["clean"],
                ],
              }}
              formats={["header","bold","italic","underline","strike","list","bullet","link","image"]}
              style={{ height: "220px", marginBottom: "24px" }}
            />
          </div>

          {/* File upload */}
          <div className="article-form-group margin">
            <label className="article-label">Featured Image</label>
            <input
              type="file"
              className="article-file-input"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              required
            />
          </div>

          {/* Submit */}
          <div className="article-submit-wrapper">
            <button type="submit" className="article-submit-button" disabled={loading}>
              {loading ? "Submitting…" : "Submit Article"}
            </button>
          </div>
        </form>

        {message.text && (
          <p
            className="article-message"
            style={
              message.type === "error"
                ? { background: "rgba(248,113,113,0.1)", borderColor: "rgba(248,113,113,0.3)", color: "#f87171" }
                : {}
            }
          >
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
};

export default AddArticle;

"use client";

import { useState, useEffect } from "react";
import { FileText, Upload, Plus, CheckCircle, RefreshCw, FolderOpen, Image as ImageIcon } from "lucide-react";

interface PatientDocument {
  id: string;
  name: string;
  fileUrl: string;
  type: string;
  uploadedAt: string;
}

export default function PatientDocuments() {
  const [documents, setDocuments] = useState<PatientDocument[]>([]);
  const [loading, setLoading] = useState(true);

  // Upload form state
  const [showUpload, setShowUpload] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("X_RAY");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchDocs = async () => {
    try {
      const res = await fetch("/api/documents");
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.documents || []);
      }
    } catch (err) {
      console.error("Failed to load documents", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type })
      });
      if (res.ok) {
        setSuccess(true);
        setName("");
        setTimeout(() => {
          setSuccess(false);
          setShowUpload(false);
          fetchDocs();
        }, 1500);
      }
    } catch (err) {
      console.error("Failed to upload document:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-slate-400 font-medium space-x-2">
        <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
        <span>Loading dental vault...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dental Records Vault</h1>
          <p className="text-sm text-slate-500 mt-1">Access secure X-rays, clinical reports, and prescriptions.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="inline-flex items-center space-x-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Upload Form Box */}
      {showUpload && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm max-w-xl mx-auto space-y-4 animate-fadeIn">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
            <Upload className="h-5 w-5 text-blue-600" />
            <span>Simulate Document Upload</span>
          </h3>
          
          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Document Title</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:outline-none transition"
                placeholder="E.g. Full Panoramic scan, Post-op prescription..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Document Category</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none transition bg-white"
              >
                <option value="X_RAY">Panoramic X-Ray / CT Scan</option>
                <option value="PRESCRIPTION">Medication Prescription</option>
                <option value="REPORT">Clinical Report / Diagnostic summary</option>
                <option value="OTHER">Other logs</option>
              </select>
            </div>

            {success ? (
              <div className="flex items-center justify-center space-x-1.5 rounded-lg bg-green-500 text-white font-bold py-2.5 text-xs">
                <CheckCircle className="h-4.5 w-4.5" />
                <span>Uploaded and Logged to Database!</span>
              </div>
            ) : (
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUpload(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-blue-600 text-white font-semibold px-4 py-2.5 text-xs hover:bg-blue-700 transition cursor-pointer"
                >
                  {submitting ? "Uploading..." : "Save Record"}
                </button>
              </div>
            )}
          </form>
        </div>
      )}

      {/* Documents Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-1.5">
          <FolderOpen className="h-5 w-5 text-blue-600" />
          <span>My Medical Files ({documents.length})</span>
        </h2>

        {documents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div key={doc.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 flex flex-col justify-between hover:border-blue-500 transition">
                <div className="space-y-3">
                  {/* File Mock Preview Card */}
                  <div className="h-32 rounded-lg bg-slate-100/80 border border-slate-200/50 flex flex-col items-center justify-center text-slate-400 space-y-2 relative overflow-hidden">
                    {doc.type === "X_RAY" ? (
                      <>
                        <ImageIcon className="h-8 w-8 text-blue-600" />
                        <span className="text-[10px] uppercase font-bold text-blue-800 tracking-wider">X-Ray Image preview</span>
                      </>
                    ) : (
                      <>
                        <FileText className="h-8 w-8 text-sky-600" />
                        <span className="text-[10px] uppercase font-bold text-sky-800 tracking-wider">Clinical PDF preview</span>
                      </>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm truncate">{doc.name}</h3>
                    <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-600 ring-1 ring-inset ring-slate-500/10 mt-1.5 uppercase">
                      {doc.type.replace("_", " ")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500 font-semibold">
                  <span>Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); alert(`Downloading file: ${doc.name}`); }}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm font-medium">
            No clinical records uploaded in your locker yet.
          </div>
        )}
      </div>

    </div>
  );
}

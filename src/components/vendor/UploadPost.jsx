import { useState } from 'react'

/**
 * UploadPost – Form for vendors to create new photo/video posts.
 * Props:
 *   onSuccess {func} – Called after successful publish (to navigate back to posts)
 *
 * TODO: Connect form submission to backend:
 *   - POST /api/vendor/posts (multipart/form-data)
 *   - Fields: file, title, description, price, availability
 */
export default function UploadPost({ onSuccess }) {
    const [uploadType, setUploadType] = useState('image')
    const [availability, setAvailability] = useState('available')
    const [loading, setLoading] = useState(false)

    const handlePublish = async (e) => {
        e.preventDefault()
        setLoading(true)
        // const formData = new FormData(e.target)
        // formData.append('availability', availability)
        // const res = await fetch('/api/vendor/posts', { method: 'POST', body: formData })
        // if (res.ok) { onSuccess?.() }
        setTimeout(() => { setLoading(false); onSuccess?.() }, 500) // remove after backend integration
    }

    return (
        <div className="content">
            <div className="card">
                <div className="section-heading">
                    <i className="fa-solid fa-cloud-arrow-up"></i> Post Your Work
                </div>

                <div className="upload-type-row">
                    <button
                        type="button"
                        className={`upload-type-btn ${uploadType === 'image' ? 'selected' : ''}`}
                        onClick={() => setUploadType('image')}
                    >
                        <i className="fa-solid fa-image"></i><span>Image Post</span>
                    </button>
                    <button
                        type="button"
                        className={`upload-type-btn ${uploadType === 'video' ? 'selected' : ''}`}
                        onClick={() => setUploadType('video')}
                    >
                        <i className="fa-solid fa-video"></i><span>Video Post</span>
                    </button>
                </div>

                <form onSubmit={handlePublish}>
                    <div className="upload-zone">
                        <i className={`fa-solid ${uploadType === 'image' ? 'fa-image' : 'fa-video'}`}></i>
                        <strong>Click or drag to upload {uploadType === 'image' ? 'an image' : 'a video'}</strong>
                        <small>{uploadType === 'image' ? 'JPG, PNG, WEBP up to 10MB' : 'MP4, MOV up to 100MB'}</small>
                        <input
                            type="file"
                            name="file"
                            accept={uploadType === 'image' ? 'image/*' : 'video/*'}
                            style={{ display: 'none' }}
                            id="upload-file"
                        />
                    </div>

                    <div className="form-group-d">
                        <label className="form-label">Title / Caption</label>
                        <input
                            className="form-input-d"
                            type="text"
                            name="title"
                            placeholder="e.g. Handcrafted silk blouse – Festive collection"
                        />
                    </div>

                    <div className="form-group-d">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-textarea"
                            name="description"
                            placeholder="Describe your work, materials used, starting price…"
                        ></textarea>
                    </div>

                    <div className="price-avail-row">
                        <div className="form-group-d" style={{ marginTop: 0 }}>
                            <label className="form-label">Starting Price (₹)</label>
                            <input className="form-input-d" type="number" name="price" placeholder="e.g. 500" />
                        </div>
                        <div className="form-group-d" style={{ marginTop: 0 }}>
                            <label className="form-label">Availability</label>
                            <div className="avail-toggle">
                                <button
                                    type="button"
                                    className={`avail-btn ${availability === 'available' ? 'on' : ''}`}
                                    onClick={() => setAvailability('available')}
                                >Available</button>
                                <button
                                    type="button"
                                    className={`avail-btn ${availability === 'busy' ? 'on' : ''}`}
                                    onClick={() => setAvailability('busy')}
                                >Busy</button>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="publish-btn" disabled={loading}>
                        <i className="fa-solid fa-paper-plane"></i>
                        {loading ? 'Publishing…' : 'Publish Post'}
                    </button>
                </form>
            </div>
        </div>
    )
}

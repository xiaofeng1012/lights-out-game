class PhotoAlbum {
    constructor() {
        this.gallery = document.getElementById('gallery');
        this.fileInput = document.getElementById('fileInput');
        this.uploadPreview = document.getElementById('uploadPreview');
        this.clearBtn = document.getElementById('clearAll');
        
        this.init();
    }

    init() {
        // 載入已儲存照片
        this.loadPhotos();
        
        // 綁定事件
        this.fileInput.addEventListener('change', (e) => this.handleUpload(e));
        this.clearBtn.addEventListener('click', () => this.clearAll());
    }

    handleUpload(e) {
        const files = Array.from(e.target.files);
        this.uploadPreview.innerHTML = '';

        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.addPhoto(e.target.result, file.name);
                    this.uploadPreview.innerHTML += `
                        <div class="preview-item">
                            <img src="${e.target.result}" style="width:80px;height:80px;object-fit:cover;border-radius:8px;">
                            <span>${file.name}</span>
                        </div>
                    `;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    addPhoto(src, name) {
        // 儲存到 localStorage
        const photos = JSON.parse(localStorage.getItem('photoAlbum') || '[]');
        photos.unshift({ src, name, id: Date.now() });
        localStorage.setItem('photoAlbum', JSON.stringify(photos.slice(0, 100))); // 限制100張

        // 重新渲染
        this.renderGallery(photos);
    }

    renderGallery(photos) {
        this.gallery.innerHTML = photos.map(photo => `
            <div class="gallery-item">
                <img src="${photo.src}" alt="${photo.name}" loading="lazy">
                <button class="download-btn" onclick="album.downloadPhoto('${photo.src}', '${photo.name}')">
                    <i class="fas fa-download"></i>
                </button>
            </div>
        `).join('');
    }

    loadPhotos() {
        const photos = JSON.parse(localStorage.getItem('photoAlbum') || '[]');
        this.renderGallery(photos);
    }

    downloadPhoto(src, name) {
        const link = document.createElement('a');
        link.download = name || 'photo.jpg';
        link.href = src;
        link.click();
    }

    clearAll() {
        if (confirm('確定要清空全部照片嗎？')) {
            localStorage.removeItem('photoAlbum');
            this.gallery.innerHTML = '';
        }
    }
}

// 初始化
const album = new PhotoAlbum();

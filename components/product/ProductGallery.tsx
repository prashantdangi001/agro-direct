'use client';
import { useState } from 'react';

export default function ProductGallery() {
  const images = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDRTP_mGPdd6IWCvtFZpdRWidi_u4oxUvrrU628JlqQz7ScchZv1FJb24EiA4elt-eFcstrK1dUgB4qS1p2abIvgQWtb7iYaTly2FZnaMSc49qWBsdKQgwnIS-fv1xsTx4jiVDo_53mSRdMqQ7a54g5blYwjVEBPQUersG5Un4-gzOCZe03_IfKgLZzkxG7NBRJjvfak0qgpPNu8ZRw4dWBLxv84Ij2LIcWczpvy--5OhOYBjGsDmEqlKg1IogoxqDeGLjCEO_Lx270",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBVtUdyAB1k8OUPMMiKFrPsSH64kS3UrdJCyrpkYsturqW8S5nIwZxljp46sGLNXRpUp9TXer_8XgJ_eDQwl50JYgLcuw9fu_Ri01bHxZIdN6FbqU-FyAM047KLv9SfwYLy4ULTzJkhj8GI_0PZAFdDtCifJ4_vtmD4nxs78r6AWjgw2YkTtyXBiS6QbvQPd_VGAPaQefUcdinPqUI4j-pjJsxgkQq9DOhlIVpJl3K25Fjh8d_oVDw5vhrqkhDMhT1SQcay4NL-pLbZ",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCXCzKLiA7DYElNgeUREZUpa9kC6REDCsW50r0B5YxHTS6T0VPh8wGc0WWXq7AR4xwtcDQSM5Z2VBoqNLcbU7qJ2wGGZo5mYnyRSp6UT-hhSB9TzVHDsAiXlUUykTRUs60gRoVSkla-WE_FbX_AWLy0UoFqgTNQebomSAJEEP8qQjrQ9INqjfcs70D1cZdSTD1dE3YIifchoDdBfYiq9qEm7XFrKb0U7BSdE8qk2BjKoDd3mx75TPU6KxyTbgdPYt2KNchWhWRa6zq2",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDo8p1zqEAvdNCIDsRmKgmjUMLOHURgZdgmqud9g1cpZfyaEkjYggjlnyR_3_84aBqvMys0gkWcZQkU56sKPJq9hUMrE_L8mMGrZult3ZkwTJXLpTwb_HGDVkMkfWeSdqS9fkgo6ezjB3U-nCkx_PXJw2YGrlLTT8O_9SaI5Vcz57bNM-myxikczwMWcC7TlNoJF0eZF_koHTXqH_OZLB3ugWDaup7qrm-iK_do3VaslOUN2iPGqd74eKVpNbxUABjexE0-Ty8JsYTp"
  ];
  
  const [activeImg, setActiveImg] = useState(images[0]);

  return (
    <div className="space-y-4 w-full">
      {/* Main Image */}
      <div className="w-full aspect-square bg-surface-container rounded-xl overflow-hidden border border-outline-variant shadow-sm elevation-1">
        <img 
          src={activeImg} 
          alt="Product view" 
          className="w-full h-full object-cover transition-opacity duration-300"
        />
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-4">
        {images.map((img, idx) => (
          <button 
            key={idx}
            onClick={() => setActiveImg(img)}
            className={`w-full aspect-square rounded-lg overflow-hidden border-2 transition-all ${
              activeImg === img ? 'border-primary shadow-md' : 'border-outline-variant opacity-70 hover:opacity-100'
            }`}
          >
            <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
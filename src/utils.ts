/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Helper to format currency to Rupiah (IDR)
export function formatIDR(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

// Helper to simulate image compression, resize and cropping with clear logs
export function simulateImageOptimization(
  file: File,
  onProgress: (status: string) => void
): Promise<{ url: string; sizeBefore: string; sizeAfter: string }> {
  return new Promise((resolve) => {
    const sizeBeforeKb = (file.size / 1024).toFixed(1);
    onProgress("Membaca file...");
    
    setTimeout(() => {
      onProgress("Melakukan cropping rasio aspek...");
      setTimeout(() => {
        onProgress("Mengubah ukuran (resizing) ke 800x800px...");
        setTimeout(() => {
          onProgress("Mengompresi kualitas JPG ke 80%...");
          setTimeout(() => {
            // Generate a random high-quality unsplash placeholder as simulated output
            const simulatedImages = [
              "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1558244661-d248897f7bc4?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1524295928322-4b9862f90f38?auto=format&fit=crop&w=600&q=80"
            ];
            const randomImg = simulatedImages[Math.floor(Math.random() * simulatedImages.length)];
            const sizeAfterKb = (file.size * 0.18 / 1024).toFixed(1); // simulated 82% compression!
            onProgress("Optimasi gambar selesai!");
            resolve({
              url: randomImg,
              sizeBefore: `${sizeBeforeKb} KB`,
              sizeAfter: `${sizeAfterKb} KB`
            });
          }, 800);
        }, 800);
      }, 800);
    }, 600);
  });
}

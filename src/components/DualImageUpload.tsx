import React, { useRef, useState } from 'react';
import { Upload, Camera, Image as ImageIcon, X } from 'lucide-react';

interface DualImageUploadProps {
    onImagesSelected: (image1: File, image2: File) => void;
}

export const DualImageUpload: React.FC<DualImageUploadProps> = ({ onImagesSelected }) => {
    const [image1, setImage1] = useState<File | null>(null);
    const [image2, setImage2] = useState<File | null>(null);
    const [preview1, setPreview1] = useState<string | null>(null);
    const [preview2, setPreview2] = useState<string | null>(null);

    const fileInput1Ref = useRef<HTMLInputElement>(null);
    const fileInput2Ref = useRef<HTMLInputElement>(null);
    const cameraInput1Ref = useRef<HTMLInputElement>(null);
    const cameraInput2Ref = useRef<HTMLInputElement>(null);

    const handleImageChange = (file: File, slot: 1 | 2) => {
        const preview = URL.createObjectURL(file);
        if (slot === 1) {
            setImage1(file);
            setPreview1(preview);
        } else {
            setImage2(file);
            setPreview2(preview);
        }
    };

    const removeImage = (slot: 1 | 2) => {
        if (slot === 1) {
            setImage1(null);
            setPreview1(null);
        } else {
            setImage2(null);
            setPreview2(null);
        }
    };

    const handleBattle = () => {
        if (image1 && image2) {
            onImagesSelected(image1, image2);
        }
    };

    const UploadBox: React.FC<{
        slot: 1 | 2;
        image: File | null;
        preview: string | null;
        color: string;
        label: string;
    }> = ({ slot, image, preview, color, label }) => (
        <div className={`relative border-4 border-dashed rounded-2xl p-6 text-center transition-all ${image ? `border-${color}-500 bg-${color}-900/20` : `border-gray-600 hover:border-${color}-500 bg-gray-800`
            }`}>
            {preview ? (
                <div className="relative">
                    <img src={preview} alt={`Kämpfer ${slot}`} className="w-full h-64 object-cover rounded-lg" />
                    <button
                        onClick={() => removeImage(slot)}
                        className="absolute top-2 right-2 p-2 bg-red-500 rounded-full hover:bg-red-600"
                    >
                        <X size={20} />
                    </button>
                    <div className={`absolute bottom-2 left-2 px-3 py-1 bg-${color}-500 rounded-full font-bold text-sm`}>
                        {label}
                    </div>
                </div>
            ) : (
                <>
                    <div className={`p-4 rounded-full bg-${color}-500/20 text-${color}-400 inline-block mb-4`}>
                        <Upload size={40} />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{label}</h3>
                    <p className="text-gray-400 text-sm mb-4">Lade ein Bild hoch oder mache ein Foto</p>

                    <div className="flex flex-col gap-2">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={slot === 1 ? fileInput1Ref : fileInput2Ref}
                            onChange={(e) => e.target.files?.[0] && handleImageChange(e.target.files[0], slot)}
                        />
                        <button
                            onClick={() => (slot === 1 ? fileInput1Ref : fileInput2Ref).current?.click()}
                            className={`flex items-center justify-center gap-2 px-4 py-2 bg-${color}-600 rounded-lg hover:bg-${color}-700 transition-colors`}
                        >
                            <ImageIcon size={18} />
                            <span>Galerie</span>
                        </button>

                        <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            ref={slot === 1 ? cameraInput1Ref : cameraInput2Ref}
                            onChange={(e) => e.target.files?.[0] && handleImageChange(e.target.files[0], slot)}
                        />
                        <button
                            onClick={() => (slot === 1 ? cameraInput1Ref : cameraInput2Ref).current?.click()}
                            className={`flex items-center justify-center gap-2 px-4 py-2 bg-${color}-500 rounded-lg hover:bg-${color}-600 transition-colors`}
                        >
                            <Camera size={18} />
                            <span>Kamera</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    );

    return (
        <div className="w-full max-w-5xl mx-auto mt-8 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <UploadBox slot={1} image={image1} preview={preview1} color="red" label="Kämpfer 1" />
                <UploadBox slot={2} image={image2} preview={preview2} color="blue" label="K ämpfer 2" />
            </div>

            {image1 && image2 && (
                <div className="mt-8 text-center">
                    <button
                        onClick={handleBattle}
                        className="px-12 py-4 bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 rounded-xl font-bold text-xl hover:scale-105 transition-transform shadow-2xl border-2 border-yellow-400"
                    >
                        ⚔️ BATTLE STARTEN! ⚔️
                    </button>
                </div>
            )}

            <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-300 text-center">
                    💡 <strong>Beispiele:</strong> Hai vs Tiger • Messer vs Hund • Auto vs Traktor • Mistkäfer vs Regenwurm
                </p>
            </div>
        </div>
    );
};
